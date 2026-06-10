import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import {
  Search, Building2, MapPin, Filter, LogOut, Home, Users, Shield,
  ChevronDown, X, Menu, ExternalLink, Eye, EyeOff, Edit2, Trash2,
  Save, Plus, UserCheck, UserX, Key, Settings, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const ADMIN_TOKEN_KEY = "apgp_admin_token";
const STATES = ["", "NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];
const PROPERTY_TYPES = ["", "SDA", "SIL", "Both"];
const VACANCY_STATUSES = ["", "Available", "Pending", "Occupied"];
const ACCOM_TYPES = ["", "SDA (Specialist Disability Accommodation)", "SIL (Supported Independent Living)", "STA (Short-Term Accommodation / Respite)", "MTA (Medium-Term Accommodation)", "Not sure"];
const TIMELINES = ["", "Immediately", "Within 30 days", "Within 60 days", "Within 90 days", "Unsure"];
const NDIS_OPTS = ["", "Yes", "No", "In progress"];

const vacancyBadge: Record<string, string> = {
  Available: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Occupied: "bg-gray-100 text-gray-600",
};

type Tab = "overview" | "leads" | "search" | "admins";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: me, isLoading } = trpc.adminAuth.me.useQuery();

  useEffect(() => {
    if (!isLoading && !me) {
      try { localStorage.removeItem(ADMIN_TOKEN_KEY); } catch { /* ignore */ }
      setLocation("/admin/login");
    }
  }, [me, isLoading, setLocation]);

  const logout = trpc.adminAuth.logout.useMutation({
    onSuccess: () => {
      try { localStorage.removeItem(ADMIN_TOKEN_KEY); } catch { /* ignore */ }
      setLocation("/admin/login");
    },
  });

  // ── Leads state ────────────────────────────────────────────────────────────
  const { data: allLeads = [], refetch: refetchLeads } = trpc.leads.adminList.useQuery(undefined, { enabled: tab === "leads" });
  const [leadSearch, setLeadSearch] = useState("");
  const [leadFilters, setLeadFilters] = useState({ accommodationType: "", moveInTimeline: "", ndisRegistered: "", visibility: "" });
  const [editingLeadId, setEditingLeadId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      const q = leadSearch.toLowerCase();
      const matchSearch = !q || lead.accommodationType.toLowerCase().includes(q) ||
        (lead.postcode ?? "").includes(q) || (lead.preferredState ?? "").toLowerCase().includes(q) ||
        (lead.mondayLeadId ?? "").toLowerCase().includes(q) || (lead.supportNeeds ?? "").toLowerCase().includes(q);
      const matchType = !leadFilters.accommodationType || lead.accommodationType === leadFilters.accommodationType;
      const matchTimeline = !leadFilters.moveInTimeline || lead.moveInTimeline === leadFilters.moveInTimeline;
      const matchNdis = !leadFilters.ndisRegistered || lead.ndisRegistered === leadFilters.ndisRegistered;
      const matchVis = !leadFilters.visibility ||
        (leadFilters.visibility === "visible" && lead.isActive) ||
        (leadFilters.visibility === "hidden" && !lead.isActive);
      return matchSearch && matchType && matchTimeline && matchNdis && matchVis;
    });
  }, [allLeads, leadSearch, leadFilters]);

  const toggleActive = trpc.leads.toggleActive.useMutation({
    onSuccess: () => { toast.success("Lead visibility updated."); refetchLeads(); },
    onError: (e) => toast.error(e.message),
  });
  const updateLead = trpc.leads.adminUpdate.useMutation({
    onSuccess: () => { toast.success("Lead updated."); setEditingLeadId(null); refetchLeads(); },
    onError: (e) => toast.error(e.message),
  });
  const deleteLead = trpc.leads.adminDelete.useMutation({
    onSuccess: () => { toast.success("Lead deleted."); refetchLeads(); },
    onError: (e) => toast.error(e.message),
  });

  // ── Property search state ───────────────────────────────────────────────────
  const [filters, setFilters] = useState({ state: "", propertyType: "", vacancyStatus: "", suburb: "", supportNeeds: "" });
  const [activeFilters, setActiveFilters] = useState(filters);
  const [hasSearched, setHasSearched] = useState(false);
  const { data: searchResults = [], isFetching } = trpc.accommodation.adminSearch.useQuery(activeFilters, { enabled: hasSearched });

  // ── Admin users state ───────────────────────────────────────────────────────
  const { data: adminList = [], refetch: refetchAdmins } = trpc.adminAuth.listAdmins.useQuery(undefined, {
    enabled: tab === "admins" && me?.role === "super_admin",
  });
  const [newAdmin, setNewAdmin] = useState({ username: "", email: "", password: "", fullName: "", role: "admin" as "admin" | "super_admin" });
  const [showNewAdminForm, setShowNewAdminForm] = useState(false);
  const [resetPasswordId, setResetPasswordId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const createAdmin = trpc.adminAuth.createAdmin.useMutation({
    onSuccess: () => { toast.success("Admin user created."); refetchAdmins(); setShowNewAdminForm(false); setNewAdmin({ username: "", email: "", password: "", fullName: "", role: "admin" }); },
    onError: (e) => toast.error(e.message),
  });
  const toggleAdminActive = trpc.adminAuth.toggleAdminActive.useMutation({
    onSuccess: () => { toast.success("Admin status updated."); refetchAdmins(); },
    onError: (e) => toast.error(e.message),
  });
  const resetPassword = trpc.adminAuth.resetPassword.useMutation({
    onSuccess: () => { toast.success("Password reset."); setResetPasswordId(null); setNewPassword(""); },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!me) return null;

  const isSuperAdmin = me.role === "super_admin";

  const allNavItems: Array<{ id: Tab; label: string; icon: React.ReactNode; superOnly?: boolean }> = [
    { id: "overview" as Tab, label: "Overview", icon: <Home className="w-4 h-4" /> },
    { id: "leads" as Tab, label: "Leads Management", icon: <Users className="w-4 h-4" /> },
    { id: "search" as Tab, label: "Property Search", icon: <Search className="w-4 h-4" /> },
    { id: "admins" as Tab, label: "Admin Users", icon: <Shield className="w-4 h-4" />, superOnly: true },
  ];
  const navItems = allNavItems.filter((item) => !item.superOnly || isSuperAdmin);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy text-white flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}>
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal flex items-center justify-center text-white font-bold font-heading">A</div>
            <div>
              <div className="font-bold text-white font-heading text-sm">APGP Admin</div>
              <div className="text-xs text-teal-300">Internal Portal</div>
            </div>
          </Link>
        </div>
        <div className="p-4 border-b border-white/10">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3.5 h-3.5 text-teal-300" />
              <p className="text-xs text-teal-300 font-semibold uppercase tracking-widest">{me.role.replace("_", " ")}</p>
            </div>
            <p className="text-sm font-medium text-white truncate">{me.fullName ?? me.username}</p>
            <p className="text-xs text-gray-400 truncate">{me.email}</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === item.id ? "bg-teal text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}
            >
              {item.icon}{item.label}
            </button>
          ))}
          <Link href="/staff/blog" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
            <Edit2 className="w-4 h-4" />Blog Management
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors w-full">
            <ExternalLink className="w-4 h-4" />Public Website
          </Link>
          <button onClick={() => logout.mutate()} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-navy font-heading text-sm">Admin Portal</span>
          <div className="w-9" />
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">

          {/* Overview */}
          {tab === "overview" && (
            <div>
              <h1 className="text-2xl font-bold text-navy font-heading mb-2">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm mb-8">Welcome, {me.fullName ?? me.username}. You have {isSuperAdmin ? "super admin" : "admin"} access.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button onClick={() => setTab("leads")} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow text-left group">
                  <div className="w-14 h-14 rounded-2xl bg-teal-light flex items-center justify-center mb-5 group-hover:bg-teal transition-colors">
                    <Users className="w-7 h-7 text-teal group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-navy font-heading mb-2">Leads Management</h3>
                  <p className="text-gray-600 text-sm">View, search, filter, hide/unhide, edit, and delete participant enquiry leads.</p>
                </button>
                <button onClick={() => setTab("search")} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow text-left group">
                  <div className="w-14 h-14 rounded-2xl bg-teal-light flex items-center justify-center mb-5 group-hover:bg-teal transition-colors">
                    <Search className="w-7 h-7 text-teal group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-navy font-heading mb-2">Property Search</h3>
                  <p className="text-gray-600 text-sm">Search all provider accommodation listings.</p>
                </button>
                {isSuperAdmin && (
                  <button onClick={() => setTab("admins")} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow text-left group">
                    <div className="w-14 h-14 rounded-2xl bg-teal-light flex items-center justify-center mb-5 group-hover:bg-teal transition-colors">
                      <Shield className="w-7 h-7 text-teal group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-navy font-heading mb-2">Admin Users</h3>
                    <p className="text-gray-600 text-sm">Manage admin team members, roles, and access.</p>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Leads Management */}
          {tab === "leads" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-navy font-heading">Leads Management</h1>
                  <p className="text-gray-500 text-sm mt-1">{filteredLeads.length} of {allLeads.length} leads shown · {allLeads.filter(l => l.isActive).length} visible, {allLeads.filter(l => !l.isActive).length} hidden</p>
                </div>
              </div>

              {/* Search + Filters */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-5 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Search by accommodation type, postcode, state, Monday ID, or support needs..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-teal outline-none"
                  />
                  {leadSearch && (
                    <button onClick={() => setLeadSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-navy block mb-1">Accommodation Type</label>
                    <select value={leadFilters.accommodationType} onChange={(e) => setLeadFilters({ ...leadFilters, accommodationType: e.target.value })} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:border-teal outline-none">
                      <option value="">All types</option>
                      {ACCOM_TYPES.filter(Boolean).map((t) => <option key={t} value={t}>{t.split("(")[0].trim()}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy block mb-1">Move-in Timeline</label>
                    <select value={leadFilters.moveInTimeline} onChange={(e) => setLeadFilters({ ...leadFilters, moveInTimeline: e.target.value })} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:border-teal outline-none">
                      <option value="">All timelines</option>
                      {TIMELINES.filter(Boolean).map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy block mb-1">NDIS Status</label>
                    <select value={leadFilters.ndisRegistered} onChange={(e) => setLeadFilters({ ...leadFilters, ndisRegistered: e.target.value })} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:border-teal outline-none">
                      <option value="">All</option>
                      {NDIS_OPTS.filter(Boolean).map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy block mb-1">Visibility</label>
                    <select value={leadFilters.visibility} onChange={(e) => setLeadFilters({ ...leadFilters, visibility: e.target.value })} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:border-teal outline-none">
                      <option value="">All</option>
                      <option value="visible">Visible only</option>
                      <option value="hidden">Hidden only</option>
                    </select>
                  </div>
                </div>
                {(leadSearch || Object.values(leadFilters).some(Boolean)) && (
                  <button onClick={() => { setLeadSearch(""); setLeadFilters({ accommodationType: "", moveInTimeline: "", ndisRegistered: "", visibility: "" }); }} className="text-xs text-teal hover:underline">
                    Clear all filters
                  </button>
                )}
              </div>

              {filteredLeads.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{allLeads.length === 0 ? "No leads yet." : "No leads match your filters."}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLeads.map((lead) => (
                    <div key={lead.id} className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${!lead.isActive ? "opacity-50 border-gray-200" : "border-gray-100"}`}>
                      {editingLeadId === lead.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                              { key: "accommodationType", label: "Accommodation Type" },
                              { key: "dwellingType", label: "Dwelling Type" },
                              { key: "moveInTimeline", label: "Move-in Timeline" },
                              { key: "preferredState", label: "State" },
                              { key: "postcode", label: "Postcode" },
                              { key: "mondayLeadId", label: "Monday Lead ID" },
                            ].map(({ key, label }) => (
                              <div key={key}>
                                <label className="text-xs font-semibold text-navy block mb-1">{label}</label>
                                <input value={editForm[key] ?? ""} onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-teal outline-none" />
                              </div>
                            ))}
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-navy block mb-1">Support Needs</label>
                            <textarea value={editForm["supportNeeds"] ?? ""} onChange={(e) => setEditForm({ ...editForm, supportNeeds: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-teal outline-none resize-none" />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-teal hover:bg-teal-600 text-white" onClick={() => updateLead.mutate({ id: lead.id, ...editForm })} disabled={updateLead.isPending}>
                              <Save className="w-3.5 h-3.5 mr-1" />{updateLead.isPending ? "Saving..." : "Save"}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingLeadId(null)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${lead.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                {lead.isActive ? "● Visible" : "○ Hidden"}
                              </span>
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-navy text-white">{lead.accommodationType.split("(")[0].trim()}</span>
                              {lead.mondayLeadId && <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">ID: {lead.mondayLeadId}</span>}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600">
                              <span><strong>Dwelling:</strong> {lead.dwellingType}</span>
                              <span><strong>Timeline:</strong> {lead.moveInTimeline}</span>
                              <span><strong>Postcode:</strong> {lead.postcode ?? lead.preferredState ?? "—"}</span>
                              <span><strong>NDIS:</strong> {lead.ndisRegistered}</span>
                            </div>
                            {lead.supportNeeds && <p className="text-xs text-gray-500 mt-1 truncate"><strong>Notes:</strong> {lead.supportNeeds}</p>}
                            <p className="text-xs text-gray-400 mt-1">{new Date(lead.createdAt).toLocaleString("en-AU")}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button onClick={() => toggleActive.mutate({ id: lead.id })} className={`p-2 rounded-lg transition-colors ${lead.isActive ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"}`} title={lead.isActive ? "Hide from providers" : "Show to providers"}>
                              {lead.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button onClick={() => { setEditingLeadId(lead.id); setEditForm({ accommodationType: lead.accommodationType, dwellingType: lead.dwellingType, moveInTimeline: lead.moveInTimeline, preferredState: lead.preferredState ?? "", postcode: lead.postcode ?? "", mondayLeadId: lead.mondayLeadId ?? "", supportNeeds: lead.supportNeeds ?? "" }); }} className="p-2 rounded-lg text-gray-400 hover:text-teal hover:bg-teal-light transition-colors" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => { if (confirm("Permanently delete this lead?")) deleteLead.mutate({ id: lead.id }); }} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Property Search */}
          {tab === "search" && (
            <div>
              <h1 className="text-2xl font-bold text-navy font-heading mb-2">Property Search</h1>
              <p className="text-gray-500 text-sm mb-6">Search all provider accommodation listings.</p>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">State</label>
                    <Select value={filters.state} onValueChange={(v) => setFilters({ ...filters, state: v === "all" ? "" : v })}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All states" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All states</SelectItem>
                        {STATES.filter(Boolean).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">Type</label>
                    <Select value={filters.propertyType} onValueChange={(v) => setFilters({ ...filters, propertyType: v === "all" ? "" : v })}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All types" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {PROPERTY_TYPES.filter(Boolean).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">Vacancy</label>
                    <Select value={filters.vacancyStatus} onValueChange={(v) => setFilters({ ...filters, vacancyStatus: v === "all" ? "" : v })}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All statuses" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        {VACANCY_STATUSES.filter(Boolean).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">Suburb</label>
                    <Input value={filters.suburb} onChange={(e) => setFilters({ ...filters, suburb: e.target.value })} placeholder="e.g. Parramatta" className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">Support Needs</label>
                    <Input value={filters.supportNeeds} onChange={(e) => setFilters({ ...filters, supportNeeds: e.target.value })} placeholder="e.g. High Physical" className="h-9 text-sm" />
                  </div>
                </div>
                <Button onClick={() => { setActiveFilters(filters); setHasSearched(true); }} className="bg-teal hover:bg-teal-600 text-white" disabled={isFetching}>
                  <Search className="w-4 h-4 mr-2" />{isFetching ? "Searching..." : "Search Properties"}
                </Button>
              </div>
              {hasSearched && (
                <div>
                  <p className="text-sm text-gray-500 mb-4">{searchResults.length} {searchResults.length === 1 ? "property" : "properties"} found</p>
                  {searchResults.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                      <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No properties match your search criteria.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(searchResults as Array<{ id: number; propertyName?: string; address?: string; suburb?: string; state?: string; postcode?: string; propertyType?: string; vacancyStatus?: string; availableRooms?: number; totalRooms?: number; supportNeeds?: string; providerName?: string; providerEmail?: string }>).map((listing) => (
                        <div key={listing.id as number} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 className="font-bold text-navy">{(listing.propertyName as string) || (listing.address as string)}</h3>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${vacancyBadge[listing.vacancyStatus as string] ?? "bg-gray-100 text-gray-600"}`}>{listing.vacancyStatus as string}</span>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-navy text-white">{listing.propertyType as string}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                                <MapPin className="w-3 h-3" />
                                <span>{[listing.address, listing.suburb, listing.state, listing.postcode].filter(Boolean).join(", ")}</span>
                              </div>
                              {listing.supportNeeds && <p className="text-xs text-gray-500 mt-1"><strong>Support:</strong> {listing.supportNeeds as string}</p>}
                              {listing.providerName && <p className="text-xs text-gray-400 mt-1"><strong>Provider:</strong> {listing.providerName as string} · {listing.providerEmail as string}</p>}
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-bold text-navy">{listing.availableRooms as number}/{listing.totalRooms as number} rooms</p>
                              <p className="text-xs text-gray-400">available</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Admin Users (super admin only) */}
          {tab === "admins" && isSuperAdmin && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-navy font-heading">Admin Users</h1>
                  <p className="text-gray-500 text-sm mt-1">{adminList.length} admin {adminList.length === 1 ? "user" : "users"}</p>
                </div>
                <Button onClick={() => setShowNewAdminForm(!showNewAdminForm)} className="bg-teal hover:bg-teal-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />Add Admin
                </Button>
              </div>

              {showNewAdminForm && (
                <div className="bg-white rounded-2xl border border-teal/30 p-6 shadow-sm mb-6">
                  <h3 className="font-bold text-navy font-heading mb-4">New Admin User</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-navy font-medium text-sm">Username *</Label>
                      <Input value={newAdmin.username} onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })} placeholder="e.g. john.smith" className="mt-1.5" />
                    </div>
                    <div>
                      <Label className="text-navy font-medium text-sm">Email *</Label>
                      <Input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} placeholder="email@ausnewhomecare.com" className="mt-1.5" />
                    </div>
                    <div>
                      <Label className="text-navy font-medium text-sm">Full Name</Label>
                      <Input value={newAdmin.fullName} onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })} placeholder="Full name" className="mt-1.5" />
                    </div>
                    <div>
                      <Label className="text-navy font-medium text-sm">Initial Password *</Label>
                      <Input type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} placeholder="Min 8 characters" className="mt-1.5" />
                    </div>
                    <div>
                      <Label className="text-navy font-medium text-sm">Role *</Label>
                      <select value={newAdmin.role} onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as "admin" | "super_admin" })} className="mt-1.5 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal outline-none">
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={() => createAdmin.mutate(newAdmin)} className="bg-teal hover:bg-teal-600 text-white" disabled={createAdmin.isPending}>
                      {createAdmin.isPending ? "Creating..." : "Create Admin User"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewAdminForm(false)}>Cancel</Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {adminList.map((admin) => (
                  <div key={admin.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${!admin.isActive ? "opacity-60 border-gray-200" : "border-gray-100"}`}>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-white font-bold font-heading text-sm shrink-0">
                          {(admin.fullName ?? admin.username).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-navy">{admin.fullName ?? admin.username}</p>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${admin.role === "super_admin" ? "bg-teal text-white" : "bg-navy/10 text-navy"}`}>
                              {admin.role.replace("_", " ")}
                            </span>
                            {!admin.isActive && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Inactive</span>}
                            {admin.id === me.id && <span className="text-xs text-teal bg-teal-light px-2 py-0.5 rounded-full">You</span>}
                          </div>
                          <p className="text-xs text-gray-500">@{admin.username} · {admin.email}</p>
                          {admin.lastSignedIn && <p className="text-xs text-gray-400">Last signed in: {new Date(admin.lastSignedIn).toLocaleString("en-AU")}</p>}
                        </div>
                      </div>
                      {admin.id !== me.id && (
                        <div className="flex items-center gap-2 shrink-0">
                          {resetPasswordId === admin.id ? (
                            <div className="flex items-center gap-2">
                              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-teal outline-none w-40" />
                              <Button size="sm" className="bg-teal hover:bg-teal-600 text-white" onClick={() => resetPassword.mutate({ id: admin.id, newPassword })} disabled={resetPassword.isPending || newPassword.length < 8}>
                                {resetPassword.isPending ? "..." : "Set"}
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => { setResetPasswordId(null); setNewPassword(""); }}>Cancel</Button>
                            </div>
                          ) : (
                            <>
                              <button onClick={() => setResetPasswordId(admin.id)} className="p-2 rounded-lg text-gray-400 hover:text-teal hover:bg-teal-light transition-colors" title="Reset password">
                                <Key className="w-4 h-4" />
                              </button>
                              <button onClick={() => toggleAdminActive.mutate({ id: admin.id })} className={`p-2 rounded-lg transition-colors ${admin.isActive ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"}`} title={admin.isActive ? "Deactivate" : "Activate"}>
                                {admin.isActive ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
