import type { Express, Request, Response } from "express";
import { getDb } from "./db";
import { blogPosts } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// ─── Fallback image selector ────────────────────────────────────────────────
function selectFallbackImage(keywordSeed: string, title: string): string {
  const text = `${keywordSeed} ${title}`.toLowerCase();
  const fallbacks: Record<string, string> = {
    accommodation: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486953469/VXENecN32kGDVq7itT27ZC/apgp-accommodation-drDCRERqX3KVFHXAG7Ad66.webp",
    sda: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486953469/VXENecN32kGDVq7itT27ZC/apgp-accommodation-drDCRERqX3KVFHXAG7Ad66.webp",
    sil: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486953469/VXENecN32kGDVq7itT27ZC/apgp-accommodation-drDCRERqX3KVFHXAG7Ad66.webp",
    housing: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486953469/VXENecN32kGDVq7itT27ZC/apgp-accommodation-drDCRERqX3KVFHXAG7Ad66.webp",
    community: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486953469/VXENecN32kGDVq7itT27ZC/apgp-hero-home-UrsEnEjTwniUeLFyWQ3XFG.webp",
    daily: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486953469/VXENecN32kGDVq7itT27ZC/apgp-hero-home-UrsEnEjTwniUeLFyWQ3XFG.webp",
    program: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486953469/VXENecN32kGDVq7itT27ZC/apgp-hero-dfy-X3AUdhxXRzirRKHUoyhVjv.webp",
    ndis: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486953469/VXENecN32kGDVq7itT27ZC/apgp-hero-home-UrsEnEjTwniUeLFyWQ3XFG.webp",
    provider: "https://d2xsxph8kpxj0f.cloudfront.net/310519663486953469/VXENecN32kGDVq7itT27ZC/apgp-hero-dfy-X3AUdhxXRzirRKHUoyhVjv.webp",
  };
  for (const [key, url] of Object.entries(fallbacks)) {
    if (text.includes(key)) return url;
  }
  return "https://d2xsxph8kpxj0f.cloudfront.net/310519663486953469/VXENecN32kGDVq7itT27ZC/apgp-hero-home-UrsEnEjTwniUeLFyWQ3XFG.webp";
}

// ─── Insert blog post (idempotent — skips if slug already exists) ───────────
async function insertArvowPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnailUrl?: string | null;
  keywordSeed?: string | null;
  tags?: string | null;
  publishedAt?: Date;
}) {
  const db = await getDb();
  if (!db) return;

  // Check if slug already exists
  const existing = await db.select({ id: blogPosts.id })
    .from(blogPosts)
    .where(eq(blogPosts.slug, data.slug))
    .limit(1);

  if (existing[0]) {
    console.log(`[Arvow] Skipping duplicate slug: ${data.slug}`);
    return;
  }

  await db.insert(blogPosts).values({
    title: data.title,
    slug: data.slug,
    content: data.content,
    excerpt: data.excerpt ?? "",
    thumbnailUrl: data.thumbnailUrl ?? null,
    keywordSeed: data.keywordSeed ?? null,
    tags: data.tags ?? null,
    source: "arvow",
    published: true,
    publishedAt: data.publishedAt ?? new Date(),
    author: "Ausnew APGP Team",
  });
  console.log(`[Arvow] Ingested new post: ${data.slug}`);
}

// ─── Register webhook route ──────────────────────────────────────────────────
export function registerArvowWebhookRoute(app: Express) {
  app.post("/api/webhooks/arvow", async (req: Request, res: Response) => {
    // Validate secret
    const secret = req.headers["x-arvow-secret"];
    const expectedSecret = process.env.ARVOW_WEBHOOK_SECRET;

    if (expectedSecret && secret !== expectedSecret) {
      console.warn("[Arvow] Webhook rejected — invalid secret");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const body = req.body as {
      title?: string;
      slug?: string;
      content?: string;
      excerpt?: string;
      published_at?: string;
      keyword_seed?: string;
      thumbnail_url?: string;
      tags?: string[];
    };

    if (!body.title || !body.slug || !body.content) {
      return res.status(400).json({ error: "Missing required fields: title, slug, content" });
    }

    try {
      const thumbnailUrl = body.thumbnail_url ||
        selectFallbackImage(body.keyword_seed ?? "", body.title);

      await insertArvowPost({
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        thumbnailUrl,
        keywordSeed: body.keyword_seed ?? null,
        tags: body.tags ? JSON.stringify(body.tags) : null,
        publishedAt: body.published_at ? new Date(body.published_at) : new Date(),
      });

      return res.json({ success: true, slug: body.slug });
    } catch (err) {
      console.error("[Arvow] Webhook error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}
