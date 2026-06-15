import React from "react";
import { createClient } from "../../../lib/supabase/server";
import ServicesForm from "./ServicesForm";

export default async function AdminServicesPage() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });

  return <ServicesForm initialServices={services || []} />;
}
