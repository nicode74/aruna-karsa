import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  // Option for CRON_SECRET authorization
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Supabase environment variables are missing" },
        { status: 500 }
      );
    }

    // Initialize direct client to query
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Perform a query on site_config to trigger db activity
    const { data, error } = await supabase.from("site_config").select("id").limit(1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      status: "ok",
      message: "Supabase connection is alive",
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown error occurred" },
      { status: 500 }
    );
  }
}
