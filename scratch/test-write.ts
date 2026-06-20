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
  console.log("Testing write to 'pages' table using anon key...");
  const { data, error } = await supabase.from("pages").insert([
    {
      page_name: "test_page_temp",
      title: "Test Page",
      description: "Temp description",
      sections: []
    }
  ]).select();

  if (error) {
    console.error("Error inserting:", error);
  } else {
    console.log("Insert success:", data);
    
    // Clean up
    console.log("Cleaning up...");
    const { error: deleteError } = await supabase.from("pages").delete().eq("page_name", "test_page_temp");
    if (deleteError) {
      console.error("Error deleting:", deleteError);
    } else {
      console.log("Cleanup success.");
    }
  }
}

run();
