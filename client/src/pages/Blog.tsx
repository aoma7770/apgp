import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowRight, Search, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const FALLBACK_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486953469/VXENecN32kGDVq7itT27ZC/apgp-hero-home-UrsEnEjTwniUeLFyWQ3XFG.webp";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage?: string | null;
  thumbnailUrl?: string | null;
  category?: string | null;
  author?: string | null;
  publishedAt?: Date | null;
  createdAt: Date;
};

function BlogCard({ post }: { post: BlogPost }) {
  const thumb = post.thumbnailUrl ?? post.coverImage ?? FALLBACK_IMG;
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })
    : new Date(post.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white h-full flex flex-col cursor-pointer">
        {/* 16:9 thumbnail */}
        <div className="aspect-video overflow-hidden bg-navy/10 shrink-0">
          <img
            src={thumb}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-5 flex flex-col flex-1">
          {post.category && (
            <span className="inline-block text-xs font-semibold text-teal bg-teal-light px-2.5 py-1 rounded-full mb-2 self-start">
              {post.category}
            </span>
          )}
          <p className="text-xs text-gray-400 mb-2">{date}</p>
          <h3 className="font-bold text-navy text-lg leading-snug line-clamp-2 mb-2 font-heading">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-gray-500 text-sm line-clamp-3 flex-1">{post.excerpt}</p>
          )}
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal">
            Read More <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function Blog() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const LIMIT = 12;

  const { data: blogData, isLoading } = trpc.blog.list.useQuery({ page, limit: LIMIT });
  const posts: BlogPost[] = blogData?.posts ?? [];
  const totalPages = blogData?.pages ?? 1;

  // Client-side search filter
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      (p.excerpt ?? "").toLowerCase().includes(q) ||
      (p.category ?? "").toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-navy text-white py-16 lg:py-20">
        <div className="container max-w-3xl text-center">
          <div className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-4">Insights &amp; Resources</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-heading mb-4">APGP Blog</h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            Guides, insights, and practical advice for SDA and SIL accommodation providers across Australia.
          </p>
          {/* Search bar */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search articles..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-teal text-sm"
            />
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-navy mb-2">
                {searchQuery ? "No articles match your search" : "No posts yet"}
              </h3>
              <p className="text-gray-500 text-sm">
                {searchQuery ? "Try a different search term." : "Check back soon for guides and insights."}
              </p>
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="mt-4 text-teal text-sm hover:underline">
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              {searchQuery && (
                <p className="text-sm text-gray-500 mb-6">{filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""} for "{searchQuery}"</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination — only show when not searching */}
              {!searchQuery && totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="border-navy text-navy hover:bg-navy hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-navy text-white" : "text-gray-600 hover:bg-gray-100"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="border-navy text-navy hover:bg-navy hover:text-white"
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-teal py-14 text-white text-center">
        <div className="container max-w-xl">
          <h2 className="text-2xl font-bold font-heading mb-3">Ready to Fill Your Vacancies?</h2>
          <p className="text-white/90 mb-6">Join APGP and get matched with pre-qualified NDIS participants. No upfront cost.</p>
          <Link href="/provider/register">
            <Button className="bg-navy hover:bg-navy-dark text-white font-semibold px-8">
              Register Free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
