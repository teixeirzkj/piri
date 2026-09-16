import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { DEMO_PRODUCTS } from '../lib/demoData'

let demoStore = DEMO_PRODUCTS.map((p) => ({ ...p }))
const listeners = new Set()
const notify = () => listeners.forEach((fn) => fn([...demoStore]))

export function useProducts() {
  const [products, setProducts] = useState(isSupabaseConfigured ? [] : [...demoStore])
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      listeners.add(setProducts)
      return () => listeners.delete(setProducts)
    }
    let channel
    const load = async () => {
      const { data } = await supabase.from('products').select('*').order('sort_order').order('name')
      setProducts(data || [])
      setLoading(false)
    }
    load()
    channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const addProduct = useCallback(async (product) => {
    if (!isSupabaseConfigured) {
      demoStore = [...demoStore, product]
      notify()
      return
    }
    setProducts((ps) => [...ps, product])
    const { error } = await supabase.from('products').insert(product)
    if (error) console.error('addProduct failed:', error)
  }, [])

  const updateProduct = useCallback(async (id, patch) => {
    if (!isSupabaseConfigured) {
      demoStore = demoStore.map((p) => (p.id === id ? { ...p, ...patch } : p))
      notify()
      return
    }
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)))
    const { error } = await supabase.from('products').update(patch).eq('id', id)
    if (error) console.error('updateProduct failed:', error)
  }, [])

  const deleteProduct = useCallback(async (id) => {
    if (!isSupabaseConfigured) {
      demoStore = demoStore.filter((p) => p.id !== id)
      notify()
      return
    }
    setProducts((ps) => ps.filter((p) => p.id !== id))
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) console.error('deleteProduct failed:', error)
  }, [])

  return { products, loading, addProduct, updateProduct, deleteProduct }
}
