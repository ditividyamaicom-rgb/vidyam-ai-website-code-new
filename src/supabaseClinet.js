import { createClient } from "@supabase/supabase-js";

const supabaseURL= "https://kwapdqllgpxvfxuoucjv.supabase.co"

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3YXBkcWxsZ3B4dmZ4dW91Y2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMjEzNzQsImV4cCI6MjA3MDg5NzM3NH0.mWHsRBKkk50ng5jJjWSIR2ovcR-RMVSK1TaQGXdCAaM"


// Test 
// const supabaseURL="https://szyvtqjvucowujgodpin.supabase.co"
// const supabaseAnonKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eXZ0cWp2dWNvd3VqZ29kcGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk3OTY1ODQsImV4cCI6MjAyNTM3MjU4NH0.w-hXOb6LFsQWZqhJwiKbBhR_zV89tsxQCXBYs7d6qsM"


export const supabase = await createClient(supabaseURL, supabaseAnonKey)
