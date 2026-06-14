import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User, MessageSquare } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ContactSection from "../../components/ContactSection";
import { blogPosts } from "../posts";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Find other posts for recommendation sidebar
  const otherPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <Header />
      <main className="flex-grow pt-24">
        {/* Article Container */}
        <article className="max-w-4xl mx-auto px-6 py-12">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-brand-amber-600 dark:hover:text-brand-amber-500 mb-8 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Blog
          </Link>

          {/* Heading Metadata */}
          <div className="space-y-4 mb-8">
            <span className="px-3.5 py-1.5 rounded-xl bg-brand-amber-500/10 text-brand-amber-600 dark:text-brand-amber-500 text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-zinc-900 dark:text-white leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400 font-semibold border-b border-zinc-100 dark:border-zinc-900 pb-6">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-zinc-400" />
                <span>Oleh {post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span>Dipublikasi: {post.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span>Estimasi: {post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-xl mb-12 border border-zinc-200/50 dark:border-zinc-800/50">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-w-1024px) 100vw, 800px"
              priority
            />
          </div>

          {/* Article Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main content body */}
            <div className="lg:col-span-8 space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal text-base
              prose dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-h3:text-xl prose-h3:text-zinc-900 dark:prose-h3:text-white prose-blockquote:border-l-4 prose-blockquote:border-brand-amber-500 prose-blockquote:italic prose-blockquote:pl-4 prose-blockquote:py-1">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Sidebar recommendations */}
            <div className="lg:col-span-4 space-y-8">
              <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 space-y-6">
                <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white pb-3 border-b border-zinc-200 dark:border-zinc-800">
                  Artikel Menarik Lainnya
                </h3>
                <div className="space-y-6">
                  {otherPosts.map((rec) => (
                    <div key={rec.slug} className="space-y-2 group">
                      <span className="text-[10px] font-bold text-brand-amber-600 dark:text-brand-amber-500 uppercase tracking-widest">
                        {rec.category}
                      </span>
                      <Link href={`/blog/${rec.slug}`} className="block">
                        <h4 className="font-bold text-zinc-900 dark:text-white text-sm group-hover:text-brand-amber-600 dark:group-hover:text-brand-amber-500 transition-colors leading-snug">
                          {rec.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {rec.excerpt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultation card */}
              <div className="p-6 rounded-3xl bg-brand-amber-600 text-white shadow-lg shadow-brand-amber-600/20 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display font-bold text-lg leading-tight">Jadwalkan Konsultasi</h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Diskusikan kebutuhan arsitektur, RAB, atau pelaksanaan bangun baru Anda bersama arsitek profesional kami.
                </p>
                <Link
                  href="/contact"
                  className="block w-full py-2.5 bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs rounded-xl tracking-wider uppercase transition-colors"
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Contact form at the bottom */}
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
