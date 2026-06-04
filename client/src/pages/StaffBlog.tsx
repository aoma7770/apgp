import { useState } from "react";
import { useLocation } from "wouter";
import { Plus, Edit2, Trash2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Link } from "wouter";

type View = "list" | "create" | "edit";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "",
  author: "Ausnew APGP Team",
  published: false,
};

export default function StaffBlog() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();
  const [view, setView] = useState<View>("list");
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const utils = trpc.useUtils();

  const { data: posts = [], isLoading } = trpc.blog.adminList.useQuery(undefined, {
    enabled: !!user && (user.role === "admin" || user.role === "staff"),
  });

  const create = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Post created.");
      utils.blog.adminList.invalidate();
      utils.blog.list.invalidate();
      setView("list");
      setForm(emptyForm);
    },
    onError: (e) => toast.error(e.message),
  });

  const update = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Post updated.");
      utils.blog.adminList.invalidate();
      utils.blog.list.invalidate();
      setView("list");
      setEditId(null);
      setForm(emptyForm);
    },
    onError: (e) => toast.error(e.message),
  });

  const del = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Post deleted.");
      utils.blog.adminList.invalidate();
      utils.blog.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  if (loading) return <div className="min-h-screen bg-navy flex items-center justify-center"><div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || (user.role !== "admin" && user.role !== "staff")) {
    setLocation("/staff/login");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      update.mutate({ id: editId, ...form });
    } else {
      create.mutate(form);
    }
  };

  const startEdit = (post: (typeof posts)[0]) => {
    setForm({
      title: post.title,
      excerpt: post.excerpt ?? "",
      content: post.content,
      coverImage: post.coverImage ?? "",
      category: post.category ?? "",
      author: post.author ?? "Ausnew APGP Team",
      published: post.published,
    });
    setEditId(post.id);
    setView("edit");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-navy text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/staff/dashboard" className="text-teal-300 hover:text-teal transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold font-heading text-lg">Blog Management</h1>
        </div>
        {view === "list" && (
          <Button onClick={() => { setForm(emptyForm); setEditId(null); setView("create"); }} className="bg-teal hover:bg-teal-600 text-white">
            <Plus className="w-4 h-4 mr-2" /> New Post
          </Button>
        )}
      </header>

      <main className="container max-w-4xl py-8">
        {/* Post list */}
        {view === "list" && (
          <div>
            <p className="text-gray-500 text-sm mb-6">{posts.length} {posts.length === 1 ? "post" : "posts"} total</p>
            {isLoading ? (
              <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}</div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <p className="text-gray-500 mb-4">No posts yet.</p>
                <Button onClick={() => setView("create")} className="bg-teal hover:bg-teal-600 text-white"><Plus className="w-4 h-4 mr-2" /> Create First Post</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-navy truncate">{post.title}</h3>
                        {post.published ? (
                          <Badge className="bg-green-100 text-green-700 text-xs">Published</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-gray-500">Draft</Badge>
                        )}
                        {post.category && <Badge variant="outline" className="text-xs border-teal text-teal">{post.category}</Badge>}
                      </div>
                      {post.excerpt && <p className="text-gray-500 text-xs line-clamp-1">{post.excerpt}</p>}
                      <p className="text-gray-400 text-xs mt-1">{new Date(post.createdAt).toLocaleDateString("en-AU")}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {post.published && (
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <button className="p-2 rounded-lg text-gray-400 hover:text-teal hover:bg-teal-light transition-colors"><Eye className="w-4 h-4" /></button>
                        </Link>
                      )}
                      <button onClick={() => startEdit(post)} className="p-2 rounded-lg text-gray-400 hover:text-teal hover:bg-teal-light transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => { if (confirm("Delete this post?")) del.mutate({ id: post.id }); }} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create / Edit form */}
        {(view === "create" || view === "edit") && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => { setView("list"); setEditId(null); setForm(emptyForm); }} className="text-gray-500 hover:text-navy transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-navy font-heading">{view === "edit" ? "Edit Post" : "New Post"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-5">
              <div>
                <Label className="text-navy font-medium text-sm">Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title" required className="mt-1.5" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label className="text-navy font-medium text-sm">Category</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. NDIS Guides" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-navy font-medium text-sm">Author</Label>
                  <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author name" className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label className="text-navy font-medium text-sm">Excerpt <span className="text-gray-400 font-normal">(shown on listing page)</span></Label>
                <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short summary of the post..." rows={2} className="mt-1.5" />
              </div>
              <div>
                <Label className="text-navy font-medium text-sm">Cover Image URL <span className="text-gray-400 font-normal">(optional)</span></Label>
                <Input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="https://..." className="mt-1.5" />
              </div>
              <div>
                <Label className="text-navy font-medium text-sm">Content <span className="text-gray-400 font-normal">(HTML supported)</span></Label>
                <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="<h2>Heading</h2><p>Paragraph...</p>" rows={12} className="mt-1.5 font-mono text-sm" required />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="published"
                  checked={form.published}
                  onCheckedChange={(v) => setForm({ ...form, published: v })}
                />
                <Label htmlFor="published" className="text-navy font-medium text-sm cursor-pointer">
                  {form.published ? <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-green-600" /> Published</span> : <span className="flex items-center gap-1.5"><EyeOff className="w-4 h-4 text-gray-400" /> Draft</span>}
                </Label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="bg-teal hover:bg-teal-600 text-white" disabled={create.isPending || update.isPending}>
                  {create.isPending || update.isPending ? "Saving..." : view === "edit" ? "Update Post" : "Create Post"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setView("list"); setEditId(null); setForm(emptyForm); }}>Cancel</Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
