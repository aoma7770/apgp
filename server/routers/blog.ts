import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createPost, deletePost, getBlogPostCount, getPostById, getPostBySlug, listAllPosts, listPublishedPosts, updatePost } from "../blogDb";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin" && ctx.user.role !== "staff") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export const blogRouter = router({
  // Public: paginated list of published posts (Arvow spec)
  list: publicProcedure
    .input(z.object({ page: z.number().default(1), limit: z.number().default(12) }).optional())
    .query(async ({ input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 12;
      const offset = (page - 1) * limit;
      const posts = await listPublishedPosts(limit, offset);
      const total = await getBlogPostCount();
      return { posts, total, pages: Math.ceil(total / limit) };
    }),

  // Public: Arvow webhook ingest (called by Arvow when a new article is published)
  ingestWebhook: publicProcedure
    .input(z.object({
      title: z.string(),
      slug: z.string(),
      content: z.string(),
      excerpt: z.string().optional(),
      thumbnail_url: z.string().optional(),
      keyword_seed: z.string().optional(),
      tags: z.array(z.string()).optional(),
      published_at: z.string().optional(),
      arvow_secret: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Validate secret
      const secret = (ctx.req as { headers?: Record<string, string> }).headers?.['x-arvow-secret'];
      const expectedSecret = process.env.ARVOW_WEBHOOK_SECRET;
      if (expectedSecret && secret !== expectedSecret && input.arvow_secret !== expectedSecret) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid Arvow secret' });
      }
      const { selectFallbackImage } = await import('../arvowWebhook');
      const thumbnailUrl = input.thumbnail_url || selectFallbackImage(input.keyword_seed ?? '', input.title);
      await createPost({
        title: input.title,
        slug: input.slug,
        content: input.content,
        excerpt: input.excerpt ?? '',
        thumbnailUrl,
        keywordSeed: input.keyword_seed ?? null,
        tags: input.tags ? JSON.stringify(input.tags) : null,
        source: 'arvow',
        published: true,
        publishedAt: input.published_at ? new Date(input.published_at) : new Date(),
        author: 'Ausnew APGP Team',
      });
      return { success: true };
    }),

  // Public: get single post by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const post = await getPostBySlug(input.slug);
      if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      return post;
    }),

  // Admin: list all posts (including drafts)
  adminList: adminProcedure.query(() => listAllPosts()),

  // Admin: create post
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(3),
        excerpt: z.string().optional(),
        content: z.string().min(10),
        coverImage: z.string().url().optional().or(z.literal("")),
        category: z.string().optional(),
        author: z.string().optional(),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const slug = slugify(input.title);
      const id = await createPost({
        ...input,
        slug,
        publishedAt: input.published ? new Date() : null,
      });
      return { success: true, id, slug };
    }),

  // Admin: update post
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(3).optional(),
        excerpt: z.string().optional(),
        content: z.string().min(10).optional(),
        coverImage: z.string().url().optional().or(z.literal("")),
        category: z.string().optional(),
        author: z.string().optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const post = await getPostById(id);
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      const updates: Record<string, unknown> = { ...data };
      if (data.published && !post.published) {
        updates.publishedAt = new Date();
      }
      await updatePost(id, updates);
      return { success: true };
    }),

  // Admin: delete post
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const post = await getPostById(input.id);
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      await deletePost(input.id);
      return { success: true };
    }),
});
