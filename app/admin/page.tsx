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
  const [
    servicesRes,
    portfolioRes,
    blogRes,
    contactRes,
    reviewsRes,
    reviewsPublishedRes,
    activeProjectsRes,
    invoicesRes,
  ] = await Promise.all([
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("portfolio").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("active_projects").select("*", { count: "exact", head: true }),
    supabase.from("invoices").select("*", { count: "exact", head: true }),
  ]);

  const stats = {
    services: servicesRes.count ?? 0,
    projects: portfolioRes.count ?? 0,
    blogs: blogRes.count ?? 0,
    contacts: contactRes.count ?? 0,
    reviews: reviewsRes.count ?? 0,
    reviewsPublished: reviewsPublishedRes.count ?? 0,
    activeProjects: activeProjectsRes.count ?? 0,
    invoices: invoicesRes.count ?? 0,
  };

  return <SettingsForm initialConfig={config} stats={stats} />;
}
