import React from "react";
import { getPricelist } from "../../../lib/supabase/helpers";
import PricelistForm from "./PricelistForm";

export default async function AdminPricelistPage() {
  const pricelist = await getPricelist();

  return <PricelistForm initialPricelist={pricelist} />;
}
