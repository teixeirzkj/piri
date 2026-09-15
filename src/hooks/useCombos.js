import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { DEMO_COMBOS } from '../lib/demoData'

let demoStore = DEMO_COMBOS.map((c) => ({ ...c }))
const listeners = new Set()
const notify = () => listeners.forEach((fn) => fn([...demoStore]))

export function useCombos() {
  const [combos, setCombos] = useState(isSupabaseConfigured ? [] : [...demoStore])
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      listeners.add(setCombos)
      return () => listeners.delete(setCombos)
    }
    let channel
    const load = async () => {
      const { data } = await supabase.from('combos').select('*').order('price')
      setCombos(data || [])
      setLoading(false)
    }
    load()
    channel = supabase
      .channel('combos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'combos' }, load)
      .subscribe()
    const poll = setInterval(load, 20000)
    return () => {
      supabase.removeChannel(channel)
      clearInterval(poll)
    }
  }, [])

  const addCombo = useCallback(async (combo) => {
    if (!isSupabaseConfigured) {
      demoStore = [...demoStore, combo]
      notify()
      return
    }
    setCombos((cs) => [...cs, combo])
    const { error } = await supabase.from('combos').insert(combo)
    if (error) console.error('addCombo failed:', error)
  }, [])

  const updateCombo = useCallback(async (id, patch) => {
    if (!isSupabaseConfigured) {
      demoStore = demoStore.map((c) => (c.id === id ? { ...c, ...patch } : c))
      notify()
      return
    }
    setCombos((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)))
    const { error } = await supabase.from('combos').update(patch).eq('id', id)
    if (error) console.error('updateCombo failed:', error)
  }, [])

  const deleteCombo = useCallback(async (id) => {
    if (!isSupabaseConfigured) {
      demoStore = demoStore.filter((c) => c.id !== id)
      notify()
      return
    }
    setCombos((cs) => cs.filter((c) => c.id !== id))
    const { error } = await supabase.from('combos').delete().eq('id', id)
    if (error) console.error('deleteCombo failed:', error)
  }, [])

  return { combos, loading, addCombo, updateCombo, deleteCombo }
}
