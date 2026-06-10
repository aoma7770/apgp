import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Calendar, Tag } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const FALLBACK_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486953469/VXENecN32kGDVq7itT27ZC/apgp-hero-home-UrsEnEjTwniUeLFyWQ3XFG.webp";
const BRAND_NAME = "APGP — Accommodation Provider Growth Program";

// ─── Contextual CTA detection (Arvow Part 6) ─────────────────────────────────
type ServiceCTA = {
  label: string;
  tagline: string;
  description: string;
  servicePage: string;
  formLabel: string;
  accentColor: string;
};

const SERVICES: Record<string, ServiceCTA> = {
  accommodation: {
    label: "Accommodation Services",
    tagline: "Find the Right SDA or SIL Home",
    description: "APGP connects NDIS participants with high-quality SDA and SIL accommodation providers across Australia. Our team manages the full intake process — from matching to move-in.",
    servicePage: "/participant-enquiries",
    formLabel: "Register Your Vacancy",
    accentColor: "#2BBFCF",
  },
  communityAccess: {
    label: "Community Access Supports",
    tagline: "Engage, Connect, and Thrive",
    description: "Ausnew Support Services delivers community access and social participation supports to NDIS participants. Our Joint Venture model means no placement fee for accommodation providers.",
    servicePage: "/pathways",
    formLabel: "Learn About JV Partnership",
    accentColor: "#1B3A5C",
  },
  dailyLife: {
    label: "Daily Living Supports",
    tagline: "Independence at Home",
    description: "Our SIL providers deliver exceptional in-home supports that help participants live independently. APGP matches the right provider to the right participant.",
    servicePage: "/pathways",
    formLabel: "Register as a Provider",
    accentColor: "#2BBFCF",
  },
  default: {
    label: "APGP Provider Growth Program",
    tagline: "Fill Your Vacancies. Pay Per Result.",
    description: "APGP is Australia's leading NDIS accommodation provider growth program. We find participants, manage intake, and support move-in. You pay nothing until they walk through the door.",
    servicePage: "/done-for-you",
    formLabel: "Register Free",
    accentColor: "#2BBFCF",
  },
};

function detectService(title: string, keywordSeed?: string | null, content?: string): ServiceCTA {
  const text = `${title} ${keywordSeed ?? ""} ${(content ?? "").slice(0, 500)}`.toLowerCase();
  if (/accommodation|sda|sil|housing|property|specialist disability|vacancy|vacancies/.test(text)) return SERVICES.accommodation;
  if (/community access|social|outing|recreation|participation/.test(text)) return SERVICES.communityAccess;
  if (/daily life|daily living|personal care|household|meal prep/.test(text)) return SERVICES.dailyLife;
  return SERVICES.default;
}

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage?: string | null;
  thumbnailUrl?: string | null;
  category?: string | null;
  author?: string | null;
  keywordSeed?: string | null;
  publishedAt?: Date | null;
  createdAt: Date;
};

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";

  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug },
    { enabled: !!slug, retry: false }
  );

  const { data: blogData } = trpc.blog.list.useQuery({ page: 1, limit: 20 });
  const allPosts: BlogPost[] = blogData?.posts ?? [];
  const related = allPosts.filter((p: BlogPost) => p.slug !== slug).slice(0, 2);

  // ── Dynamic SEO meta (Arvow Part 5) ──────────────────────────────────────
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | ${BRAND_NAME}`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", (post.excerpt ?? post.title).slice(0, 160));
    }
    return () => {
      document.title = BRAND_NAME;
    };
  }, [post]);

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
        <div className="container max-w-3xl py-20 text-center">
          <h1 className="text-2xl font-bold text-navy mb-4">Article Not Found</h1>
          <p className="text-gray-500 mb-8">This article may have been moved or removed.</p>
          <Link href="/blog">
            <Button className="bg-teal hover:bg-teal-600 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const typedPost = post as BlogPost;
  const heroImg = typedPost.thumbnailUrl ?? typedPost.coverImage ?? FALLBACK_IMG;
  const date = typedPost.publishedAt
    ? new Date(typedPost.publishedAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })
    : new Date(typedPost.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

  const service = detectService(typedPost.title, typedPost.keywordSeed, typedPost.content);

  return (
    <PublicLayout>
      <article className="py-12 lg:py-16 bg-white">
        <div className="container max-w-3xl">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-teal transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-teal transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-600 truncate max-w-xs">{typedPost.title}</span>
          </nav>

          {/* Hero image */}
          <div className="blog-hero-image-container mb-8">
            <img src={heroImg} alt={typedPost.title} />
          </div>

          {/* Article header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 flex-wrap mb-4">
              {typedPost.category && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal bg-teal-light px-2.5 py-1 rounded-full">
                  <Tag className="w-3 h-3" />{typedPost.category}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />{date}
              </span>
              {typedPost.author && (
                <span className="text-xs text-gray-400">By {typedPost.author}</span>
              )}
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-navy font-heading leading-tight mb-4">
              {typedPost.title}
            </h1>
            {typedPost.excerpt && (
              <p className="text-lg text-gray-500 leading-relaxed border-l-4 border-teal pl-4">
                {typedPost.excerpt}
              </p>
            )}
          </div>

          {/* Article body — Arvow prose typography */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: typedPost.content }}
          />

          {/* Contextual CTA block (Arvow Part 6) */}
          <div className="mt-12 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <div
              className="p-6 text-white"
              style={{ background: `linear-gradient(135deg, #0A2342, ${service.accentColor})` }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest opacity-75 mb-1">
                Also Considering Your Options?
              </p>
              <h3 className="text-xl font-bold font-heading">{service.label}</h3>
              <p className="text-sm opacity-90 mt-1">{service.tagline}</p>
            </div>
            <div className="p-6 bg-white">
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{service.description}</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/provider/register">
                  <button
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: service.accentColor }}
                  >
                    {service.formLabel}
                  </button>
                </Link>
                <Link href={service.servicePage}>
                  <button className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                    Learn More
                  </button>
                </Link>
              </div>
              <p className="mt-4 text-xs text-gray-400">
                NDIS Registered Provider · Serving Australia-Wide
              </p>
            </div>
          </div>

          {/* Back to blog */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <Link href="/blog">
              <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
              </Button>
            </Link>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-navy font-heading mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map((rel: BlogPost) => (
                  <Link key={rel.id} href={`/blog/${rel.slug}`}>
                    <div className="group bg-gray-50 rounded-2xl p-5 hover:bg-teal-light transition-colors cursor-pointer">
                      <h3 className="font-bold text-navy font-heading text-sm line-clamp-2 mb-2 group-hover:text-teal transition-colors">
                        {rel.title}
                      </h3>
                      {rel.excerpt && (
                        <p className="text-xs text-gray-500 line-clamp-2">{rel.excerpt}</p>
                      )}
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal">
                        Read More <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </PublicLayout>
  );
}
