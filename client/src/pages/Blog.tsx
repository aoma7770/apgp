import { Link } from "wouter";
import { Calendar, Tag, ArrowRight, BookOpen } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

import Animate from "@/components/Animate";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const categoryColours: Record<string, string> = {
  "Program Overview": "bg-navy text-white",
  "NDIS Guides": "bg-teal text-white",
  "Provider Tips": "bg-teal-light text-teal",
};

function CategoryBadge({ category }: { category: string | null }) {
  if (!category) return null;
  const cls = categoryColours[category] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
      <Tag className="w-3 h-3" />
      {category}
    </span>
  );
}

export default function Blog() {
  const { data: posts = [], isLoading } = trpc.blog.list.useQuery();

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-navy text-white py-16 lg:py-24">
        <div className="container max-w-3xl text-center">
          <Animate variant="bottom" delay={0}>
            <div className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-4">Insights &amp; Resources</div>
          </Animate>
          <Animate variant="bottom" delay={0.1}>
            <h1 className="text-4xl lg:text-5xl font-extrabold font-heading mb-6">APGP Blog</h1>
          </Animate>
          <Animate variant="bottom" delay={0.2}>
            <p className="text-gray-300 text-lg leading-relaxed">
              Guides, insights, and practical advice for SDA and SIL accommodation providers across Australia.
            </p>
          </Animate>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-navy mb-2">No posts yet</h3>
              <p className="text-gray-500 text-sm">Check back soon for guides and insights.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <Animate key={post.id} variant={i % 3 === 0 ? "left" : i % 3 === 1 ? "bottom" : "right"} delay={(i % 3) * 0.08}>
                  <Link href={`/blog/${post.slug}`}>
                    <article className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
                      {/* Cover image or placeholder */}
                      <div className="h-48 bg-gradient-to-br from-navy to-teal overflow-hidden shrink-0">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-white/40" />
                          </div>
                        )}
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <CategoryBadge category={post.category} />
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <h2 className="font-bold text-navy font-heading text-lg mb-3 leading-snug group-hover:text-teal transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-teal text-sm font-semibold mt-auto">
                          Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </article>
                  </Link>
                </Animate>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16 text-white text-center">
        <div className="container max-w-xl">
          <Animate variant="bottom">
            <h2 className="text-3xl font-bold font-heading mb-4">Ready to Partner with APGP?</h2>
            <p className="text-gray-300 mb-8">Register your organisation for free and our team will be in touch to discuss your partnership options.</p>
            <Link href="/provider/register">
              <Button size="lg" className="bg-teal hover:bg-teal-600 text-white font-semibold px-10">
                Register Now — Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Animate>
        </div>
      </section>
    </PublicLayout>
  );
}