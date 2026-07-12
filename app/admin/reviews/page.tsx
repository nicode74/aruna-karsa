import React from "react";
import { getReviews } from "../../../lib/supabase/helpers";
import ReviewsList from "./ReviewsList";

export default async function AdminReviewsPage() {
  const reviews = await getReviews();

  return <ReviewsList initialReviews={reviews || []} />;
}
