import { createClient } from "@supabase/supabase-js";

// const supabaseURL= "https://pvlwbgupzrjxwsiezdvp.supabase.co"

// const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2bHdiZ3VwenJqeHdzaWV6ZHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1MjU1MTgsImV4cCI6MjAzMTEwMTUxOH0.4PPt0PDSGNDRiyBuh9DW_1csS0kDqd9gKoeKUwQkczk"


// Test 
const supabaseURL="https://szyvtqjvucowujgodpin.supabase.co"
const supabaseAnonKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eXZ0cWp2dWNvd3VqZ29kcGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk3OTY1ODQsImV4cCI6MjAyNTM3MjU4NH0.w-hXOb6LFsQWZqhJwiKbBhR_zV89tsxQCXBYs7d6qsM"


export const supabaseTest = await createClient(supabaseURL, supabaseAnonKey)