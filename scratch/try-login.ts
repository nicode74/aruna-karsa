import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load .env.local manually
const envPath = path.resolve(process.cwd(), ".env.local");
let supabaseUrl = "";
let supabaseAnonKey = "";

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  const lines = content.split("\n");
  for (const line of lines) {
    if (line.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) {
      supabaseUrl = line.split("=")[1].trim();
    }
    if (line.startsWith("NEXT_PUBLIC_SUPABASE_ANON_KEY=")) {
      supabaseAnonKey = line.split("=")[1].trim();
    }
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase URL or Anon Key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const passwords = [
  "admin",
  "admin123",
  "admin1234",
  "arunakarsa",
  "arunakarsa123",
  "password",
  "Password123",
  "PasswordAdmin123!"
];

async function run() {
  const email = "admin@arunakarsa.co.id";
  for (const password of passwords) {
    console.log(`Trying login for ${email} with password: ${password}`);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.log(`Failed: ${error.message}`);
    } else {
      console.log(`SUCCESS! User logged in. Session:`, data.session);
      return;
    }
  }
}

run();
