import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Option for CRON_SECRET authorization
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  return NextResponse.json({
    status: "ok",
    message: "Server is alive and active",
    timestamp: new Date().toISOString(),
  });
}
