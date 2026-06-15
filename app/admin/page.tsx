import React from "react";
import { createClient } from "../../lib/supabase/server";
import SettingsForm from "./SettingsForm";

export default async function AdminPage() {
  const supabase = await createClient();

  // Query site_config
  const { data: config } = await supabase
    .from("site_config")
    .select("*")
    .eq("id", 1)
    .single();

  // Query counts for statistics
  const { count: servicesCount } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true });

  const { count: portfolioCount } = await supabase
    .from("portfolio")
    .select("*", { count: "exact", head: true });

  const { count: blogCount } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true });

  const stats = {
    services: servicesCount || 0,
    projects: portfolioCount || 0,
    blogs: blogCount || 0,
  };

  return <SettingsForm initialConfig={config} stats={stats} />;
}
