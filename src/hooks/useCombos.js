import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { DEMO_COMBOS } from '../lib/demoData'

export function useCombos() {
  const [combos, setCombos] = useState(isSupabaseConfigured ? [] : DEMO_COMBOS)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return
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
    return () => supabase.removeChannel(channel)
  }, [])

  return { combos, loading }
}
