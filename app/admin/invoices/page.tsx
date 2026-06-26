import React from "react";
import { createClient } from "../../../lib/supabase/server";
import InvoicesForm from "./InvoicesForm";

export default async function AdminInvoicesPage() {
  const supabase = await createClient();

  // Fetch all invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });

  return <InvoicesForm initialInvoices={invoices || []} />;
}
