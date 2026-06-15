import React from "react";
import { createClient } from "../../lib/supabase/server";
import AdminSidebar from "./AdminSidebar";

export const metadata = {
  title: "Admin Dashboard | Aruna Karsa",
  description: "Dashboard panel untuk mengelola konten, halaman, dan data website Aruna Karsa.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not authenticated, render children directly (this will display the login page)
  if (!user) {
    return <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">{children}</div>;
  }

  // If authenticated, render with sidebar shell
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col lg:flex-row transition-colors duration-300">
      <AdminSidebar userEmail={user.email || "admin@arunakarsa.co.id"} />
      <main className="flex-1 lg:pl-64 min-h-screen p-6 sm:p-8 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
