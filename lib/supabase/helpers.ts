import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { blogPosts as defaultBlogPosts } from "../../app/blog/posts";

// Cookie-less client for public static site generation and read queries
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  try {
    return createSupabaseClient(url, anonKey);
  } catch (err) {
    console.error("Failed to create Supabase client:", err);
    return null;
  }
}

export async function getPageData(pageName: string) {
  const supabase = createPublicClient();
  if (!supabase) {
    return { config: null, page: null, supabase: null };
  }

  try {
    // Try to query site_config
    const { data: config } = await supabase
      .from("site_config")
      .select("*")
      .eq("id", 1)
      .single();

    // Try to query page layout configurations
    const { data: page } = await supabase
      .from("pages")
      .select("*")
      .eq("page_name", pageName)
      .single();

    return { config, page, supabase };
  } catch (err) {
    console.error("Error in getPageData:", err);
    return { config: null, page: null, supabase };
  }
}

export async function getServices() {
  const supabase = createPublicClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });
    
    if (error) {
      console.error("Error fetching services:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Exception fetching services:", err);
    return [];
  }
}

export async function getProjects() {
  const supabase = createPublicClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("portfolio")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Exception fetching projects:", err);
    return [];
  }
}

export async function getBlogPosts(onlyPublished = true) {
  const supabase = createPublicClient();
  if (!supabase) {
    return defaultBlogPosts;
  }

  try {
    let query = supabase.from("blog_posts").select("*").order("created_at", { ascending: false });

    if (onlyPublished) {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching blog posts:", error);
      return defaultBlogPosts;
    }
    return data && data.length > 0 ? data : defaultBlogPosts;
  } catch (err) {
    console.error("Exception fetching blog posts:", err);
    return defaultBlogPosts;
  }
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = createPublicClient();
  if (!supabase) {
    return defaultBlogPosts.find((p) => p.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      return defaultBlogPosts.find((p) => p.slug === slug) || null;
    }
    return data;
  } catch (err) {
    console.error("Exception fetching blog post:", err);
    return defaultBlogPosts.find((p) => p.slug === slug) || null;
  }
}

export async function getActiveProjects() {
  const supabase = createPublicClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("active_projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching active projects:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Exception fetching active projects:", err);
    return [];
  }
}

export async function getPublishedReviews() {
  const supabase = createPublicClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching published reviews:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Exception fetching published reviews:", err);
    return [];
  }
}

export async function getReviews() {
  const supabase = createPublicClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Exception fetching reviews:", err);
    return [];
  }
}

export async function getStaffMembers() {
  const supabase = createPublicClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("staff_members")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching staff members:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Exception fetching staff members:", err);
    return [];
  }
}

export async function getTasks() {
  const supabase = createPublicClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("due_date", { ascending: true });

    if (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Exception fetching tasks:", err);
    return [];
  }
}


