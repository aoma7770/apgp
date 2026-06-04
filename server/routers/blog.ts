import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createPost, deletePost, getPostById, getPostBySlug, listAllPosts, listPublishedPosts, updatePost } from "../blogDb";
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
  // Public: list published posts
  list: publicProcedure.query(() => listPublishedPosts()),

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
