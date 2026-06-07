import { Link, useParams } from "wouter";
import { Calendar, Tag, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";

  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug },
    { enabled: !!slug, retry: false }
  );

  const { data: allPosts = [] } = trpc.blog.list.useQuery();
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 2);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container max-w-3xl py-16">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-64 w-full rounded-2xl mb-8" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-4 w-48 mb-8" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-4 w-full" />)}
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error || !post) {
    return (
      <PublicLayout>
        <div className="container max-w-3xl py-24 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-navy font-heading mb-4">Post Not Found</h1>
          <p className="text-gray-500 mb-8">This article doesn't exist or has been removed.</p>
          <Link href="/blog">
            <Button className="bg-teal hover:bg-teal-600 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-navy text-white py-12 lg:py-16">
        <div className="container max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-teal-300 hover:text-teal transition-colors text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {post.category && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-teal text-white">
                <Tag className="w-3 h-3" />{post.category}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="text-xs text-gray-400">By {post.author}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold font-heading leading-tight">{post.title}</h1>
          {post.excerpt && <p className="text-gray-300 mt-4 text-lg leading-relaxed">{post.excerpt}</p>}
        </div>
      </section>

      {/* Cover image */}
      {post.coverImage && (
        <div className="bg-navy">
          <div className="container max-w-3xl pb-0">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-64 lg:h-96 object-cover rounded-t-2xl"
            />
          </div>
        </div>
      )}

      {/* Article body */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container max-w-3xl">
          <div
            className="prose prose-lg max-w-none text-gray-700 prose-headings:text-navy prose-headings:font-heading prose-a:text-teal prose-strong:text-navy"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA inline */}
          <div className="mt-12 bg-teal-light rounded-2xl p-8 text-center border border-teal/20">
            <h3 className="text-xl font-bold text-navy font-heading mb-3">Ready to Partner with APGP?</h3>
            <p className="text-gray-600 text-sm mb-5">Register your organisation for free and our team will be in touch within 2 business days.</p>
            <Link href="/provider/register">
  <Button size="lg" className="bg-teal hover:bg-teal-600 text-white font-semibold px-10">
    Register Now — Free <ArrowRight className="w-4 h-4 ml-2" />
  </Button>
</Link>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="container max-w-3xl">
            <h2 className="text-2xl font-bold text-navy font-heading mb-8">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`}>
                  <article className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    {p.category && (
                      <span className="text-xs font-semibold text-teal uppercase tracking-widest mb-2 block">{p.category}</span>
                    )}
                    <h3 className="font-bold text-navy font-heading mb-2 group-hover:text-teal transition-colors line-clamp-2">{p.title}</h3>
                    {p.excerpt && <p className="text-gray-500 text-sm line-clamp-2 mb-3">{p.excerpt}</p>}
                    <span className="inline-flex items-center gap-1 text-teal text-sm font-semibold">
                      Read <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
}