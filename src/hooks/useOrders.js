import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { todayISO } from '../lib/format'

let demoStore = []
let demoSeq = 1
const listeners = new Set()
const notify = () => listeners.forEach((fn) => fn([...demoStore]))

export function useOrders() {
  const [orders, setOrders] = useState(isSupabaseConfigured ? [] : [...demoStore])
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      listeners.add(setOrders)
      return () => listeners.delete(setOrders)
    }
    let channel
    const load = async () => {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      setOrders(data || [])
      setLoading(false)
    }
    load()
    channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const addOrder = useCallback(async (order) => {
    const payload = {
      date_iso: todayISO(),
      status: 'pendente',
      source: 'site',
      created_at: new Date().toISOString(),
      ...order,
    }
    if (!isSupabaseConfigured) {
      const withId = { id: `demo-${demoSeq++}`, ...payload }
      demoStore = [withId, ...demoStore]
      notify()
      return withId
    }
    const { data } = await supabase.from('orders').insert(payload).select().single()
    return data
  }, [])

  const updateOrder = useCallback(async (id, patch) => {
    if (!isSupabaseConfigured) {
      demoStore = demoStore.map((o) => (o.id === id ? { ...o, ...patch } : o))
      notify()
      return
    }
    await supabase.from('orders').update(patch).eq('id', id)
  }, [])

  const deleteOrder = useCallback(async (id) => {
    if (!isSupabaseConfigured) {
      demoStore = demoStore.filter((o) => o.id !== id)
      notify()
      return
    }
    await supabase.from('orders').delete().eq('id', id)
  }, [])

  return { orders, loading, addOrder, updateOrder, deleteOrder }
}
