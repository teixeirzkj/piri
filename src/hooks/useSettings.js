import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { DEMO_SETTINGS } from '../lib/demoData'

let demoSettings = { ...DEMO_SETTINGS }
const listeners = new Set()
const notify = () => listeners.forEach((fn) => fn({ ...demoSettings }))

export function useSettings() {
  const [settings, setSettings] = useState(isSupabaseConfigured ? null : { ...demoSettings })

  useEffect(() => {
    if (!isSupabaseConfigured) {
      listeners.add(setSettings)
      return () => listeners.delete(setSettings)
    }
    let channel
    const load = async () => {
      const { data } = await supabase.from('settings').select('*').eq('id', 'store').maybeSingle()
      setSettings(data || DEMO_SETTINGS)
    }
    load()
    channel = supabase
      .channel('settings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const updateSettings = useCallback(async (patch) => {
    if (!isSupabaseConfigured) {
      demoSettings = { ...demoSettings, ...patch }
      notify()
      return
    }
    await supabase.from('settings').update(patch).eq('id', 'store')
  }, [])

  return { settings, updateSettings }
}
