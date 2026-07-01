import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gcppbksljexnvafixtbv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjcHBia3NsamV4bnZhZml4dGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NTc4NzcsImV4cCI6MjA5ODQzMzg3N30.JVvdFDE3DTUf-g9sw4fi3VKCaKzUTyM1rh2yuUtS1d4'

export const supabase = createClient(supabaseUrl, supabaseKey)