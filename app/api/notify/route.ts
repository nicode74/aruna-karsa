import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const webhookUrl = process.env.DISCORD_NOTIFY_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ error: "Webhook URL not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { type, data } = body;

    let embed: Record<string, any>;

    if (type === "contact") {
      embed = {
        title: "📬 Pesan Konsultasi Baru",
        color: 0xf59e0b, // amber
        fields: [
          { name: "👤 Nama", value: data.name || "-", inline: true },
          { name: "📧 Email", value: data.email || "-", inline: true },
          { name: "🏷️ Jenis Proyek", value: data.projectType || "-", inline: true },
          { name: "💬 Pesan", value: data.message || "-", inline: false },
        ],
        footer: { text: "Aruna Karsa — Contact Form" },
        timestamp: new Date().toISOString(),
      };
    } else if (type === "review") {
      const stars = "⭐".repeat(data.rating || 0);
      embed = {
        title: "🌟 Ulasan Baru Masuk",
        color: 0x22c55e, // green
        fields: [
          { name: "👤 Nama", value: data.name || "-", inline: true },
          { name: "⭐ Rating", value: `${stars} (${data.rating}/5)`, inline: true },
          { name: "💬 Ulasan", value: data.message || "-", inline: false },
        ],
        footer: { text: "Aruna Karsa — Review Form" },
        timestamp: new Date().toISOString(),
      };
    } else {
      return NextResponse.json({ error: "Unknown notification type" }, { status: 400 });
    }

    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      return NextResponse.json({ error: `Discord error: ${errText}` }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
