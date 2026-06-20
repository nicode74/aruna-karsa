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

async function run() {
  console.log("Signing up admin user...");
  const { data, error } = await supabase.auth.signUp({
    email: "arunakarsa.dev@gmail.com",
    password: "PasswordAdmin123!",
  });

  if (error) {
    console.error("Error signing up:", error);
  } else {
    console.log("Sign up result:", data);
  }
}

run();
