import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import {
  Search, Building2, MapPin, Filter, LogOut, Home, Users, Shield,
  ChevronDown, X, Menu, ExternalLink, Eye, EyeOff, Edit2, Trash2,
  Save, Plus, UserCheck, UserX, Key, Settings, CheckCircle2, Clock3
} from "lucide-react";
import APGPLogo from "@/components/APGPLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { clearPortalSession, openPublicHomeWithoutLeavingPortal } from "@/lib/portalSession";

// Postcode → state lookup (official Australia Post ranges)
function postcodeToState(postcode: string | null | undefined): string | undefined {
  if (!postcode) return undefined;
  const raw = postcode.trim().padStart(4, '0');
  const pc = parseInt(raw, 10);
  if (isNaN(pc)) return undefined;
  if (raw.startsWith('08')) return 'NT';
  if ((pc >= 2600 && pc <= 2618) || (pc >= 2900 && pc <= 2920)) return 'ACT';
  if ((pc >= 2000 && pc <= 2599) || (pc >= 2619 && pc <= 2899) || (pc >= 2921 && pc <= 2999)) return 'NSW';
  if (pc >= 3000 && pc <= 3999) return 'VIC';
  if (pc >= 4000 && pc <= 4999) return 'QLD';
  if (pc >= 5000 && pc <= 5799) return 'SA';
  if (pc >= 6000 && pc <= 6797) return 'WA';
  if (pc >= 7000 && pc <= 7799) return 'TAS';
  return undefined;
}
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

type Tab = "overview" | "leads" | "providers" | "search" | "admins" | "agreements";

function formatPortalDate(value: Date | string | null | undefined) {
  return value ? new Date(value).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" }) : "Not recorded";
}

const providerActivityLabels: Record<string, string> = {
  registered: "Account registered",
  login: "Signed in to the provider portal",
  logout: "Signed out of the provider portal",
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: me, isLoading } = trpc.adminAuth.me.useQuery();

  useEffect(() => {
    if (!isLoading && !me) {
      clearPortalSession("admin");
      // Redirect to whichever login page the user came from
      const isStaffUrl = window.location.pathname.startsWith('/staff');
      window.location.href = isStaffUrl ? '/staff/login' : '/admin/login';
    }
  }, [me, isLoading]);

  const logout = trpc.adminAuth.logout.useMutation({
    onSuccess: () => {
      clearPortalSession("admin");
      // Use hard navigation to avoid React state update on unmounted component (error #300)
      window.location.href = '/admin/login';
    },
    onError: () => {
      // Even if the server call fails, clear local token and redirect
      clearPortalSession("admin");
      window.location.href = '/admin/login';
    },
  });

  // ── Leads state ────────────────────────────────────────────────────────────
  const { data: allLeads = [], refetch: refetchLeads } = trpc.leads.adminList.useQuery(undefined, { enabled: tab === "leads" });
  const [leadSearch, setLeadSearch] = useState("");
  const [leadFilters, setLeadFilters] = useState({ accommodationType: "", moveInTimeline: "", ndisRegistered: "", visibility: "", state: "" });
  const [editingLeadId, setEditingLeadId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [showAddLead, setShowAddLead] = useState(false);
  const [addLeadForm, setAddLeadForm] = useState({ mondayLeadId: "", postcode: "", careFor: "Myself", accommodationType: "", ndisRegistered: "Yes - NDIS Registered" });

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
      const leadState = lead.preferredState || postcodeToState(lead.postcode);
      const matchState = !leadFilters.state || (leadState ?? "").toUpperCase() === leadFilters.state.toUpperCase();
      return matchSearch && matchType && matchTimeline && matchNdis && matchVis && matchState;
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
  const addLeadMutation = trpc.leads.adminCreate.useMutation({
    onSuccess: () => { toast.success("Lead added."); refetchLeads(); },
    onError: (e: { message: string }) => toast.error(e.message),
  });

  // ── Registered providers state ─────────────────────────────────────────────
  const { data: registeredProviders = [], isLoading: providersLoading } = trpc.provider.adminList.useQuery(undefined, {
    enabled: tab === "providers",
  });
  const [providerSearch, setProviderSearch] = useState("");
  const [expandedProviderId, setExpandedProviderId] = useState<number | null>(null);
  const filteredProviders = useMemo(() => {
    const query = providerSearch.trim().toLowerCase();
    if (!query) return registeredProviders;
    return registeredProviders.filter((provider) => [
      provider.organisationName,
      provider.contactName,
      provider.email,
      provider.phone,
      provider.abn,
      provider.companyType,
      provider.regionsServiced,
    ].some((value) => value?.toLowerCase().includes(query)));
  }, [registeredProviders, providerSearch]);

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
    { id: "providers" as Tab, label: "Registered Providers", icon: <Building2 className="w-4 h-4" /> },
    { id: "agreements" as Tab, label: "Signed Agreements", icon: <ExternalLink className="w-4 h-4" /> },
    { id: "search" as Tab, label: "Property Search", icon: <Search className="w-4 h-4" /> },
    { id: "admins" as Tab, label: "Admin Users", icon: <Shield className="w-4 h-4" />, superOnly: true },
  ];
  const navItems = allNavItems.filter((item) => !item.superOnly || isSuperAdmin);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy text-white flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}>
        <div className="p-6 border-b border-white/10">
          <button type="button" onClick={openPublicHomeWithoutLeavingPortal} className="group -m-2 flex cursor-pointer items-center gap-3 rounded-xl p-2 text-left transition-all duration-200 hover:bg-white/10 hover:shadow-lg hover:shadow-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300" title="Open APGP website in a new tab">
            <span className="transition-transform duration-200 group-hover:scale-105"><APGPLogo variant="compact" height={36} /></span>
            <div>
              <div className="font-bold text-white font-heading text-sm transition-colors group-hover:text-teal-200">APGP Admin</div>
              <div className="text-xs text-teal-300 transition-colors group-hover:text-white">Internal Portal</div>
            </div>
          </button>
        </div>
        <div className="p-4 border-b border-white/10">
          <button type="button" onClick={() => setLocation("/")} className="group w-full cursor-pointer rounded-xl bg-white/10 p-3 text-left transition-all duration-200 hover:bg-white/20 hover:shadow-md hover:shadow-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300" title="Open the APGP homepage in this tab">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3.5 h-3.5 text-teal-300" />
              <p className="text-xs text-teal-300 font-semibold uppercase tracking-widest">{me.role.replace("_", " ")}</p>
            </div>
            <p className="text-sm font-medium text-white truncate transition-colors group-hover:text-teal-100">{me.fullName ?? me.username}</p>
            <p className="text-xs text-gray-400 truncate transition-colors group-hover:text-white/80">{me.email}</p>
          </button>
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
          <button type="button" onClick={openPublicHomeWithoutLeavingPortal} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors w-full">
            <ExternalLink className="w-4 h-4" />Public Website
          </button>
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
                <button onClick={() => setTab("providers")} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow text-left group">
                  <div className="w-14 h-14 rounded-2xl bg-teal-light flex items-center justify-center mb-5 group-hover:bg-teal transition-colors">
                    <Building2 className="w-7 h-7 text-teal group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-navy font-heading mb-2">Registered Providers</h3>
                  <p className="text-gray-600 text-sm">Review provider account, company, contact and portal activity details.</p>
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
                <div className="flex gap-2">
                  <Button onClick={() => setShowAddLead(!showAddLead)} className="bg-teal hover:bg-teal-600 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add Lead
                  </Button>
                  <label className="cursor-pointer">
                    <input type="file" accept=".csv" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const text = await file.text();
                      const lines = text.trim().split('\n');
                      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z_]/g, '_'));
                      let added = 0, skipped = 0;
                      for (let i = 1; i < lines.length; i++) {
                        const vals = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                        const row: Record<string, string> = {};
                        headers.forEach((h, idx) => { row[h] = vals[idx] ?? ''; });
                        const postcode = row['postcode'] || row['post_code'] || row['zip'] || '';
                        if (!postcode) { skipped++; continue; }
                        const state = postcodeToState(postcode);
                        try {
                          await addLeadMutation.mutateAsync({
                            mondayLeadId: row['monday_item_id'] || row['lead_id'] || row['id'] || undefined,
                            postcode,
                            preferredState: state,
                            careFor: row['care_for'] || row['who_is_the_care_for'] || 'Not specified',
                            accommodationType: row['accommodation_type'] || row['type_of_lead_accommodation'] || 'Not specified',
                            ndisRegistered: row['ndis_registered'] || row['ndis_registered_'] || 'Not specified',
                            requesterType: 'Not specified',
                            dwellingType: 'Not specified',
                            moveInTimeline: 'Not specified',
                          });
                          added++;
                        } catch { skipped++; }
                      }
                      toast.success(`CSV imported: ${added} leads added, ${skipped} skipped`);
                      e.target.value = '';
                    }} />
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy text-white text-sm font-medium cursor-pointer hover:bg-navy/80 transition-colors">
                      <Save className="w-4 h-4" /> Import CSV
                    </span>
                  </label>
                </div>
              </div>

              {/* Manual Add Lead Form */}
              {showAddLead && (
                <div className="bg-teal-light border border-teal/20 rounded-2xl p-5 mb-5">
                  <h3 className="font-bold text-navy font-heading mb-4">Add Lead Manually</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    <div>
                      <label className="text-xs font-semibold text-navy block mb-1">Lead ID (Monday.com)</label>
                      <Input value={addLeadForm.mondayLeadId} onChange={(e) => setAddLeadForm({...addLeadForm, mondayLeadId: e.target.value})} placeholder="e.g. 12249378125" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-navy block mb-1">Postcode *</label>
                      <Input value={addLeadForm.postcode} onChange={(e) => setAddLeadForm({...addLeadForm, postcode: e.target.value})} placeholder="e.g. 2000" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-navy block mb-1">Request for</label>
                      <select value={addLeadForm.careFor} onChange={(e) => setAddLeadForm({...addLeadForm, careFor: e.target.value})} className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:border-teal outline-none bg-white">
                        <option>Myself</option>
                        <option>A loved one</option>
                        <option>A client</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-navy block mb-1">Accommodation Type</label>
                      <Input value={addLeadForm.accommodationType} onChange={(e) => setAddLeadForm({...addLeadForm, accommodationType: e.target.value})} placeholder="e.g. SIL, SDA, MTA..." />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-navy block mb-1">NDIS Registered</label>
                      <Input value={addLeadForm.ndisRegistered} onChange={(e) => setAddLeadForm({...addLeadForm, ndisRegistered: e.target.value})} placeholder="Yes - NDIS Registered" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="bg-navy hover:bg-navy-dark text-white"
                      onClick={async () => {
                        if (!addLeadForm.postcode) { toast.error('Postcode is required'); return; }
                        const state = postcodeToState(addLeadForm.postcode);
                        await addLeadMutation.mutateAsync({
                          mondayLeadId: addLeadForm.mondayLeadId || undefined,
                          postcode: addLeadForm.postcode,
                          preferredState: state,
                          careFor: addLeadForm.careFor,
                          accommodationType: addLeadForm.accommodationType || 'Not specified',
                          ndisRegistered: addLeadForm.ndisRegistered || 'Not specified',
                          requesterType: 'Not specified',
                          dwellingType: 'Not specified',
                          moveInTimeline: 'Not specified',
                        });
                        setAddLeadForm({ mondayLeadId: '', postcode: '', careFor: 'Myself', accommodationType: '', ndisRegistered: 'Yes - NDIS Registered' });
                        setShowAddLead(false);
                      }}
                      disabled={addLeadMutation.isPending}
                    >
                      {addLeadMutation.isPending ? 'Adding...' : 'Add Lead'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddLead(false)}>Cancel</Button>
                  </div>
                </div>
              )}

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
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-navy block mb-1">State</label>
                    <select value={leadFilters.state} onChange={(e) => setLeadFilters({ ...leadFilters, state: e.target.value })} className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:border-teal outline-none">
                      <option value="">All States</option>
                      {["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy block mb-1">Accommodation Type</label>
                    <select value={leadFilters.accommodationType} onChange={(e) => setLeadFilters({ ...leadFilters, accommodationType: e.target.value })} className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:border-teal outline-none">
                      {ACCOM_TYPES.map((type) => <option key={type} value={type}>{type || 'All Types'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy block mb-1">NDIS Registered</label>
                    <select value={leadFilters.ndisRegistered} onChange={(e) => setLeadFilters({ ...leadFilters, ndisRegistered: e.target.value })} className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:border-teal outline-none">
                      {NDIS_OPTS.map((opt) => <option key={opt} value={opt}>{opt || 'All'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy block mb-1">Visibility</label>
                    <select value={leadFilters.visibility} onChange={(e) => setLeadFilters({ ...leadFilters, visibility: e.target.value })} className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:border-teal outline-none">
                      <option value="">All</option>
                      <option value="visible">Visible</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button onClick={() => setLeadFilters({ accommodationType: '', moveInTimeline: '', ndisRegistered: '', visibility: '', state: '' })} className="w-full text-xs text-gray-500 hover:text-navy border border-gray-200 rounded-lg px-2.5 py-2 transition-colors">
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Leads Cards */}
              <div className="space-y-3">
                {filteredLeads.length === 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-500 text-sm shadow-sm">No leads found.</div>
                )}
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Clickable summary row */}
                    <button
                      className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                      onClick={() => setEditingLeadId(editingLeadId === lead.id ? null : lead.id)}
                    >
                      <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-3 items-center">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Lead ID</p>
                          <p className="text-xs font-mono font-semibold text-navy">{lead.mondayLeadId ?? lead.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Request For</p>
                          <p className="text-sm font-medium text-gray-800">{lead.careFor ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Accommodation</p>
                          <p className="text-sm font-medium text-gray-800">{lead.accommodationType?.split('(')[0].trim() ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Postcode / State</p>
                          <p className="text-sm font-semibold text-navy">{lead.postcode ?? '—'} {lead.preferredState ? <span className="text-xs text-gray-400">({lead.preferredState})</span> : ''}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            lead.ndisRegistered?.toLowerCase().includes('yes') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>{lead.ndisRegistered?.toLowerCase().includes('yes') ? 'NDIS ✓' : 'NDIS ?'}</span>
                          <Badge variant={lead.isActive ? 'default' : 'secondary'} className="text-xs">{lead.isActive ? 'Visible' : 'Hidden'}</Badge>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${editingLeadId === lead.id ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Expanded detail + edit panel */}
                    {editingLeadId === lead.id && (
                      <div className="border-t border-gray-100 bg-gray-50 px-5 py-5">
                        <h4 className="font-bold text-navy font-heading text-sm mb-4">Full Lead Details — Edit as needed</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Lead ID</label>
                            <input value={editForm.mondayLeadId ?? lead.mondayLeadId ?? ''} onChange={(e) => setEditForm({...editForm, mondayLeadId: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal outline-none bg-white" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Postcode</label>
                            <input value={editForm.postcode ?? lead.postcode ?? ''} onChange={(e) => setEditForm({...editForm, postcode: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal outline-none bg-white" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">State</label>
                            <select value={editForm.preferredState ?? lead.preferredState ?? ''} onChange={(e) => setEditForm({...editForm, preferredState: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal outline-none bg-white">
                              <option value="">Auto-detect</option>
                              {["NSW","VIC","QLD","SA","WA","TAS","ACT","NT"].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Request For</label>
                            <input value={editForm.careFor ?? lead.careFor ?? ''} onChange={(e) => setEditForm({...editForm, careFor: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal outline-none bg-white" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Accommodation Type</label>
                            <input value={editForm.accommodationType ?? lead.accommodationType ?? ''} onChange={(e) => setEditForm({...editForm, accommodationType: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal outline-none bg-white" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">NDIS Registered</label>
                            <input value={editForm.ndisRegistered ?? lead.ndisRegistered ?? ''} onChange={(e) => setEditForm({...editForm, ndisRegistered: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal outline-none bg-white" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">NDIS Funding Type</label>
                            <input value={editForm.ndisFundingType ?? (lead as { ndisFundingType?: string | null }).ndisFundingType ?? ''} onChange={(e) => setEditForm({...editForm, ndisFundingType: e.target.value})} placeholder="e.g. Core, Capital, Capacity Building" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal outline-none bg-white" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Move-in Timeline</label>
                            <input value={editForm.moveInTimeline ?? lead.moveInTimeline ?? ''} onChange={(e) => setEditForm({...editForm, moveInTimeline: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal outline-none bg-white" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Dwelling Type</label>
                            <input value={editForm.dwellingType ?? lead.dwellingType ?? ''} onChange={(e) => setEditForm({...editForm, dwellingType: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal outline-none bg-white" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Support Needs</label>
                            <input value={editForm.supportNeeds ?? lead.supportNeeds ?? ''} onChange={(e) => setEditForm({...editForm, supportNeeds: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal outline-none bg-white" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button size="sm" className="bg-teal hover:bg-teal-600 text-white" onClick={() => updateLead.mutate({ id: lead.id, accommodationType: editForm.accommodationType ?? lead.accommodationType, moveInTimeline: editForm.moveInTimeline ?? lead.moveInTimeline, ndisRegistered: editForm.ndisRegistered ?? lead.ndisRegistered, careFor: editForm.careFor ?? lead.careFor ?? undefined, supportNeeds: editForm.supportNeeds ?? lead.supportNeeds ?? undefined, postcode: editForm.postcode ?? lead.postcode ?? undefined, preferredState: editForm.preferredState ?? lead.preferredState ?? undefined, mondayLeadId: editForm.mondayLeadId ?? lead.mondayLeadId ?? undefined, dwellingType: editForm.dwellingType ?? lead.dwellingType ?? undefined })} disabled={updateLead.isPending}>
                            {updateLead.isPending ? 'Saving...' : 'Save Changes'}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => toggleActive.mutate({ id: lead.id })}>
                            {lead.isActive ? <><EyeOff className="w-3 h-3 mr-1" /> Hide Lead</> : <><Eye className="w-3 h-3 mr-1" /> Show Lead</>}
                          </Button>
                          <button onClick={() => { if (confirm('Delete this lead permanently?')) deleteLead.mutate({ id: lead.id }); }} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-red-600 hover:bg-red-50 border border-red-200 transition-colors">
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                          <Button size="sm" variant="outline" onClick={() => setEditingLeadId(null)}>Close</Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Registered Providers */}
          {tab === "providers" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-navy font-heading">Registered Providers</h1>
                  <p className="text-gray-500 text-sm mt-1">Secure internal directory of provider account, company and portal login activity.</p>
                </div>
                <div className="bg-teal-light border border-teal/15 rounded-xl px-4 py-2.5">
                  <p className="text-xs font-semibold text-teal-dark uppercase tracking-wide">Provider Accounts</p>
                  <p className="text-xl font-bold text-navy">{registeredProviders.length}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={providerSearch}
                    onChange={(event) => setProviderSearch(event.target.value)}
                    placeholder="Search by provider, contact, email, phone, ABN, service type or state..."
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-teal outline-none"
                  />
                  {providerSearch && <button onClick={() => setProviderSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy" aria-label="Clear provider search"><X className="w-4 h-4" /></button>}
                </div>
                <p className="text-xs text-gray-400 mt-3">{filteredProviders.length} of {registeredProviders.length} providers shown. New sign-ins and sign-outs are recorded as portal activity.</p>
              </div>

              {providersLoading ? (
                <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-teal border-t-transparent rounded-full animate-spin" /></div>
              ) : filteredProviders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                  <Building2 className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                  <p className="font-semibold text-navy">No registered providers found.</p>
                  <p className="text-sm text-gray-500 mt-1">Try another search or wait for a provider to create a free account.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProviders.map((provider) => {
                    const isExpanded = expandedProviderId === provider.id;
                    return (
                      <div key={provider.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <button onClick={() => setExpandedProviderId(isExpanded ? null : provider.id)} className="w-full text-left p-5 hover:bg-gray-50 transition-colors" aria-expanded={isExpanded}>
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-navy flex items-center justify-center shrink-0"><Building2 className="w-5 h-5 text-teal-300" /></div>
                            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
                              <div className="min-w-0"><p className="text-xs text-gray-400 mb-0.5">Provider / Company</p><p className="font-semibold text-navy truncate">{provider.organisationName ?? "Organisation not provided"}</p><p className="text-xs text-gray-500 truncate">{provider.contactName ?? "Contact name not provided"}</p></div>
                              <div className="min-w-0"><p className="text-xs text-gray-400 mb-0.5">Email</p><p className="text-sm text-gray-700 truncate">{provider.email}</p></div>
                              <div><p className="text-xs text-gray-400 mb-0.5">Service Type</p><p className="text-sm text-gray-700">{provider.companyType ?? "Not specified"}</p></div>
                              <div><p className="text-xs text-gray-400 mb-0.5">Last Login</p><p className="text-sm text-gray-700">{formatPortalDate(provider.lastLoginAt)}</p></div>
                              <div className="flex items-center gap-2"><Badge className={provider.profileComplete ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-amber-100 text-amber-700 hover:bg-amber-100"}>{provider.profileComplete ? "Profile complete" : "Profile incomplete"}</Badge><span className="text-xs text-gray-500 whitespace-nowrap">{provider.propertyCount} {provider.propertyCount === 1 ? "property" : "properties"}</span></div>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="border-t border-gray-100 bg-gray-50 p-5 lg:p-6 grid grid-cols-1 xl:grid-cols-3 gap-5">
                            <section className="bg-white rounded-xl border border-gray-100 p-5">
                              <h2 className="font-bold text-navy text-sm mb-4 flex items-center gap-2"><Building2 className="w-4 h-4 text-teal" />Company Details</h2>
                              <dl className="space-y-3 text-sm">
                                <div className="flex justify-between gap-4"><dt className="text-gray-500">Organisation</dt><dd className="text-right font-medium text-navy">{provider.organisationName ?? "Not provided"}</dd></div>
                                <div className="flex justify-between gap-4"><dt className="text-gray-500">ABN</dt><dd className="text-right font-medium text-navy">{provider.abn ?? "Not provided"}</dd></div>
                                <div className="flex justify-between gap-4"><dt className="text-gray-500">Provider Type</dt><dd className="text-right font-medium text-navy">{provider.companyType ?? "Not specified"}</dd></div>
                                <div className="flex justify-between gap-4"><dt className="text-gray-500">States Serviced</dt><dd className="text-right font-medium text-navy">{provider.regionsServiced || "Not specified"}</dd></div>
                                <div className="flex justify-between gap-4"><dt className="text-gray-500">Support Types</dt><dd className="text-right font-medium text-navy">{provider.supportTypes || "Not specified"}</dd></div>
                                <div className="flex justify-between gap-4"><dt className="text-gray-500">Vacancies at Registration</dt><dd className="text-right font-medium text-navy">{provider.hasVacancies === null ? "Not recorded" : provider.hasVacancies ? "Yes" : "No"}</dd></div>
                                <div className="flex justify-between gap-4"><dt className="text-gray-500">Properties Listed</dt><dd className="text-right font-medium text-navy">{provider.propertyCount}</dd></div>
                              </dl>
                            </section>

                            <section className="bg-white rounded-xl border border-gray-100 p-5">
                              <h2 className="font-bold text-navy text-sm mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-teal" />Primary Contact</h2>
                              <dl className="space-y-3 text-sm">
                                <div className="flex justify-between gap-4"><dt className="text-gray-500">Name</dt><dd className="text-right font-medium text-navy">{provider.contactName ?? "Not provided"}</dd></div>
                                <div className="flex justify-between gap-4"><dt className="text-gray-500">Position</dt><dd className="text-right font-medium text-navy">{provider.contactTitle ?? "Not provided"}</dd></div>
                                <div className="flex justify-between gap-4"><dt className="text-gray-500">Email</dt><dd className="text-right font-medium text-navy break-all">{provider.email}</dd></div>
                                <div className="flex justify-between gap-4"><dt className="text-gray-500">Phone</dt><dd className="text-right font-medium text-navy">{provider.phone ?? "Not provided"}</dd></div>
                                <div className="flex justify-between gap-4"><dt className="text-gray-500">Website</dt><dd className="text-right font-medium text-navy max-w-[60%] truncate">{provider.website ? <a className="text-teal hover:underline" href={provider.website} target="_blank" rel="noreferrer">{provider.website.replace(/^https?:\/\//, "")}</a> : "Not provided"}</dd></div>
                                <div className="flex justify-between gap-4"><dt className="text-gray-500">Registered</dt><dd className="text-right font-medium text-navy">{formatPortalDate(provider.createdAt)}</dd></div>
                              </dl>
                            </section>

                            <section className="bg-white rounded-xl border border-gray-100 p-5">
                              <h2 className="font-bold text-navy text-sm mb-4 flex items-center gap-2"><Clock3 className="w-4 h-4 text-teal" />Portal Activity</h2>
                              <div className="mb-4 bg-teal-light rounded-lg p-3"><p className="text-xs text-teal-dark font-semibold">Last successful sign-in</p><p className="text-sm font-bold text-navy mt-0.5">{formatPortalDate(provider.lastLoginAt)}</p></div>
                              {provider.activity.length === 0 ? <p className="text-sm text-gray-500 py-3">No activity events have been recorded for this account yet.</p> : (
                                <ol className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                  {provider.activity.map((event) => <li key={event.id} className="flex gap-3 text-sm"><span className="mt-1.5 w-2 h-2 rounded-full bg-teal shrink-0" /><div><p className="font-medium text-navy">{providerActivityLabels[event.eventType] ?? event.eventType}</p><p className="text-xs text-gray-500 mt-0.5">{formatPortalDate(event.occurredAt)}</p></div></li>)}
                                </ol>
                              )}
                            </section>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Property Search */}
          {tab === "search" && (
            <div>
              <h1 className="text-2xl font-bold text-navy font-heading mb-4">Property Search</h1>

              {/* Search + Filters */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-5 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-navy block mb-1">State</label>
                    <select value={filters.state} onChange={(e) => setFilters({ ...filters, state: e.target.value })} className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:border-teal outline-none">
                      {STATES.map((state) => <option key={state} value={state}>{state}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy block mb-1">Property Type</label>
                    <select value={filters.propertyType} onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })} className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:border-teal outline-none">
                      {PROPERTY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy block mb-1">Vacancy Status</label>
                    <select value={filters.vacancyStatus} onChange={(e) => setFilters({ ...filters, vacancyStatus: e.target.value })} className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:border-teal outline-none">
                      {VACANCY_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy block mb-1">Suburb</label>
                    <Input value={filters.suburb} onChange={(e) => setFilters({ ...filters, suburb: e.target.value })} placeholder="e.g., Sydney" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-navy block mb-1">Support Needs</label>
                  <Input value={filters.supportNeeds} onChange={(e) => setFilters({ ...filters, supportNeeds: e.target.value })} placeholder="e.g., Wheelchair accessible" />
                </div>
                <Button onClick={() => { setActiveFilters(filters); setHasSearched(true); }} className="w-full bg-teal hover:bg-teal-600 text-white" disabled={isFetching}>
                  {isFetching ? "Searching..." : "Search Properties"}
                </Button>
              </div>

              {/* Search Results */}
              {hasSearched && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap">
                      <thead>
                        <tr className="text-left text-xs font-semibold text-gray-500 border-b border-gray-100">
                          <th className="p-4">ID</th>
                          <th className="p-4">Title</th>
                          <th className="p-4">Location</th>
                          <th className="p-4">Property Type</th>
                          <th className="p-4">Vacancy Status</th>
                          <th className="p-4">Support Needs</th>
                          <th className="p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResults.length === 0 && (
                          <tr>
                            <td colSpan={7} className="text-center p-6 text-gray-500 text-sm">No properties found matching your criteria.</td>
                          </tr>
                        )}
                        {searchResults.map((property) => (
                          <tr key={property.id} className="border-b border-gray-100 last:border-b-0">
                            <td className="p-4 text-sm text-gray-800">{property.id}</td>
                            <td className="p-4 text-sm text-gray-800">{property.propertyName ?? property.address}</td>
                            <td className="p-4 text-sm text-gray-800">{property.suburb}, {property.state}</td>
                            <td className="p-4 text-sm text-gray-800">{property.propertyType}</td>
                            <td className="p-4 text-sm text-gray-800">
                              <Badge className={vacancyBadge[property.vacancyStatus]}>
                                {property.vacancyStatus}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm text-gray-800">{property.supportNeeds}</td>
                            <td className="p-4 text-sm">
                              <Link href={`/property/${property.id}`} className="text-teal hover:underline" target="_blank">View</Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Admin Users */}
          {tab === "admins" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-navy font-heading">Admin Users</h1>
                <Button onClick={() => setShowNewAdminForm(!showNewAdminForm)} className="bg-teal hover:bg-teal-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />New Admin User
                </Button>
              </div>

              {showNewAdminForm && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-5 space-y-3">
                  <h2 className="text-lg font-bold text-navy font-heading">Create New Admin User</h2>
                  <Input value={newAdmin.fullName} onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })} placeholder="Full Name (optional)" />
                  <Input value={newAdmin.username} onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })} placeholder="Username" />
                  <Input value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} placeholder="Email" type="email" />
                  <Input value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} placeholder="Password" type="password" />
                  <Select value={newAdmin.role} onValueChange={(value) => setNewAdmin({ ...newAdmin, role: value as "admin" | "super_admin" })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button onClick={() => createAdmin.mutate(newAdmin)} className="bg-teal hover:bg-teal-600 text-white" disabled={createAdmin.isPending || !newAdmin.username || !newAdmin.email || !newAdmin.password || newAdmin.password.length < 8}>
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
                        <APGPLogo variant="compact" height={40} />
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

          {/* Signed Agreements */}
          {tab === "agreements" && (
            <div>
              <h1 className="text-2xl font-bold text-navy font-heading mb-2">Signed Agreements</h1>
              <p className="text-gray-500 text-sm mb-6">All referral agreements signed by providers. Each file is named: ProviderName_LeadRef_Date.pdf</p>
              <SignedAgreementsPanel />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// ── Signed Agreements Panel ──────────────────────────────────────────────────
function SignedAgreementsPanel() {
  const { data: docs = [], isLoading } = trpc.documents.adminList.useQuery();

  if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-teal border-t-transparent rounded-full animate-spin" /></div>;

  if (docs.length === 0) return (
    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
      <p className="text-gray-500">No signed agreements yet. They will appear here when providers sign referral agreements.</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {docs.map((doc: { id: number; fileName: string; fileUrl: string; category: string | null; uploadedAt: Date }) => (
        <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-navy truncate">{doc.fileName}</p>
            <p className="text-xs text-gray-400 mt-0.5">{new Date(doc.uploadedAt).toLocaleString('en-AU')} · {doc.category}</p>
          </div>
          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal text-white text-sm font-semibold hover:bg-teal-600 transition-colors">
            View PDF
          </a>
        </div>
      ))}
    </div>
  );
}
