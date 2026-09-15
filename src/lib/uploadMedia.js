import { supabase, isSupabaseConfigured } from './supabase'

// Photos/videos for the hero carousel go to Supabase Storage (bucket "media"),
// not base64-in-a-column like the logo/banner — videos are far too big for that.
export async function uploadMedia(file) {
  const isVideo = file.type.startsWith('video/')

  if (!isSupabaseConfigured) {
    return { type: isVideo ? 'video' : 'image', url: URL.createObjectURL(file) }
  }

  const ext = file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg')
  const path = `hero/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('media').upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('media').getPublicUrl(path)
  return { type: isVideo ? 'video' : 'image', url: data.publicUrl }
}

export async function deleteMedia(url) {
  if (!isSupabaseConfigured || !url || !url.includes('/media/')) return
  const path = url.split('/media/')[1]
  if (path) await supabase.storage.from('media').remove([path])
}
