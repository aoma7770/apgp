import { and, count, desc, eq } from "drizzle-orm";
import { BlogPost, InsertBlogPost, blogPosts } from "../drizzle/schema";
import { getDb } from "./db";

export async function listPublishedPosts(limit = 100, offset = 0): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.publishedAt)).limit(limit).offset(offset);
}

export async function getBlogPostCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: count() }).from(blogPosts).where(eq(blogPosts.published, true));
  return Number(result[0]?.count ?? 0);
}

export async function listAllPosts(): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true))).limit(1);
  return result[0];
}

export async function getPostById(id: number): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result[0];
}

export async function createPost(data: InsertBlogPost): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blogPosts).values(data);
  return (result[0] as { insertId: number }).insertId;
}

export async function updatePost(id: number, data: Partial<InsertBlogPost>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}

export async function deletePost(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}
