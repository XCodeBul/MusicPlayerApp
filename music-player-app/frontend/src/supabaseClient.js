import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jvioitiqjtkfxxwgzbww.supabase.co'
const supabaseAnonKey = 'sb_publishable_i__SR1u1Sj_L6cPz9rUuCQ_U0a0-84B'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)