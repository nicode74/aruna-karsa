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
    { count: servicesCount },
    { count: portfolioCount },
    { count: blogCount },
    { count: contactCount },
    { count: reviewsCount },
    { count: reviewsPublishedCount },
  ] = await Promise.all([
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("portfolio").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("is_published", true),
  ]);

  const stats = {
    services: servicesCount ?? 0,
    projects: portfolioCount ?? 0,
    blogs: blogCount ?? 0,
    contacts: contactCount ?? 0,
    reviews: reviewsCount ?? 0,
    reviewsPublished: reviewsPublishedCount ?? 0,
  };

  return <SettingsForm initialConfig={config} stats={stats} />;
}
