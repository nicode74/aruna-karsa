import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { seedDatabase } from "../../../../lib/supabase/seed";

/**
 * GET /api/admin/seed
 *
 * One-time endpoint to seed the Supabase database with default content.
 * Protected — only authenticated admin users can trigger this.
 * Safe to call multiple times: each table is only seeded if empty.
 */
export async function GET() {
  const supabase = await createClient();

  // Verify the caller is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please log in to /admin/login first." },
      { status: 401 }
    );
  }

  const result = await seedDatabase(supabase);

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Database seeded successfully. All tables have been populated with default content.",
  });
}
