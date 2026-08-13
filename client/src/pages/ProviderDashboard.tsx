import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Building2, User, LogOut, Plus, Edit2, Trash2, CheckCircle2, AlertCircle,
  Home, MapPin, ChevronRight, Settings, Menu, X, Users, Clock, Tag, Handshake, ExternalLink,
  FileText, CreditCard, Upload, Download, Trash, Search
} from "lucide-react";
import ReferralAgreementModal from "@/components/ReferralAgreementModal";
import APGPLogo from "@/components/APGPLogo";
import LeadNotificationToast from "@/components/LeadNotificationToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { clearPortalSession, openPublicHomeWithoutLeavingPortal } from "@/lib/portalSession";

type Tab = "overview" | "profile" | "listings" | "add-listing" | "leads" | "documents" | "billing";

const STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];
const SUPPORT_TYPES = ["SDA", "SIL", "Both"];
const REGIONS = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];
const SDA_CATEGORIES = ["Improved Liveability", "Fully Accessible", "Robust", "High Physical Support", "Basic"];

// Client-side postcode → state lookup (mirrors server formula exactly)
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

const vacancyBadge: Record<string, string> = {
  Available: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Occupied: "bg-gray-100 text-gray-600",
};

export default function ProviderDashboard() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const utils = trpc.useUtils();

  const { data: provider, isLoading, error: providerError } = trpc.provider.me.useQuery(undefined, {
    retry: false,
  });

  if (providerError && !isLoading) {
    setLocation("/provider/login");
  }

  const { data: listings = [] } = trpc.accommodation.listMine.useQuery(undefined, { enabled: !!provider });
  const { data: leads = [], refetch: refetchLeads } = trpc.leads.list.useQuery(undefined, { enabled: !!provider });
  const [interestLeadId, setInterestLeadId] = useState<number | null>(null);
  const [interestLeadSummary, setInterestLeadSummary] = useState("");
  const [leadSearchQuery, setLeadSearchQuery] = useState("");
  const [leadStateFilter, setLeadStateFilter] = useState("");

  // Documents
  const { data: documents = [], refetch: refetchDocs } = trpc.documents.list.useQuery(undefined, { enabled: !!provider });
  const [uploadCategory, setUploadCategory] = useState<"Referral Agreement" | "Consent Form" | "NDIS Registration" | "Insurance" | "Other">("Other");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadDoc = trpc.documents.upload.useMutation({
    onSuccess: () => { toast.success("Document uploaded."); refetchDocs(); },
    onError: (e) => toast.error(e.message),
  });

  const deleteDoc = trpc.documents.delete.useMutation({
    onSuccess: () => { toast.success("Document removed."); refetchDocs(); },
    onError: (e) => toast.error(e.message),
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("File must be under 10MB"); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadDoc.mutate({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileBase64: base64,
        category: uploadCategory,
      });
      setUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const logout = trpc.provider.logout.useMutation({
    onSuccess: () => {
      clearPortalSession("provider");
      toast.success("Signed out");
      setLocation("/provider/login");
    },
  });

  const updateProfile = trpc.provider.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated and synced to our team.");
      utils.provider.me.invalidate();
      setTab("overview");
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteListing = trpc.accommodation.delete.useMutation({
    onSuccess: () => {
      toast.success("Listing removed");
      utils.accommodation.listMine.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  // Profile form — initialised from provider data (auto-populated from registration)
  const [profileFormInit, setProfileFormInit] = useState(false);
  const [profileForm, setProfileForm] = useState({
    organisationName: "",
    abn: "",
    contactName: "",
    contactTitle: "",
    phone: "",
    website: "",
    regionsServiced: "",
    supportTypes: "",
    companyType: "" as "SDA" | "SIL" | "Both" | "",
  });

  // Auto-populate profile form from registration data when provider loads
  useEffect(() => {
    if (provider && !profileFormInit) {
      setProfileForm({
        organisationName: provider.organisationName ?? "",
        abn: provider.abn ?? "",
        contactName: provider.contactName ?? "",
        contactTitle: provider.contactTitle ?? "",
        phone: provider.phone ?? "",
        website: provider.website ?? "",
        regionsServiced: provider.regionsServiced ?? "",
        supportTypes: provider.supportTypes ?? "",
        companyType: (provider.companyType as "SDA" | "SIL" | "Both" | "") ?? "",
      });
      setProfileFormInit(true);
    }
  }, [provider, profileFormInit]);

  const initProfileForm = () => {
    if (!provider) return;
    setProfileForm({
      organisationName: provider.organisationName ?? "",
      abn: provider.abn ?? "",
      contactName: provider.contactName ?? "",
      contactTitle: provider.contactTitle ?? "",
      phone: provider.phone ?? "",
      website: provider.website ?? "",
      regionsServiced: provider.regionsServiced ?? "",
      supportTypes: provider.supportTypes ?? "",
      companyType: (provider.companyType as "SDA" | "SIL" | "Both" | "") ?? "",
    });
    setTab("profile");
  };

  // Listing form
  type StateType = "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "ACT" | "NT";
  type SdaCategoryType = "Improved Liveability" | "Fully Accessible" | "Robust" | "High Physical Support" | "Basic";
  const [listingForm, setListingForm] = useState<{
    propertyName: string;
    address: string;
    suburb: string;
    state: StateType;
    postcode: string;
    propertyType: "SDA" | "SIL" | "Both";
    sdaCategory: SdaCategoryType | "";
    vacancyStatus: "Available" | "Pending" | "Occupied";
    availableRooms: number;
    totalRooms: number;
    supportNeeds: string;
    description: string;
    propertyLink: string;
  }>({
    propertyName: "",
    address: "",
    suburb: "",
    state: "NSW",
    postcode: "",
    propertyType: "SDA",
    sdaCategory: "",
    vacancyStatus: "Available",
    availableRooms: 1,
    totalRooms: 1,
    supportNeeds: "",
    description: "",
    propertyLink: "",
  });

  const createListing = trpc.accommodation.create.useMutation({
    onSuccess: () => {
      toast.success("Property listing added.");
      utils.accommodation.listMine.invalidate();
      setTab("listings");
      setListingForm({ propertyName: "", address: "", suburb: "", state: "NSW", postcode: "", propertyType: "SDA", sdaCategory: "", vacancyStatus: "Available", availableRooms: 1, totalRooms: 1, supportNeeds: "", description: "", propertyLink: "" });
    },
    onError: (err) => toast.error(err.message),
  });

  const updateListing = trpc.accommodation.update.useMutation({
    onSuccess: () => {
      toast.success("Listing updated.");
      utils.accommodation.listMine.invalidate();
      setEditingId(null);
      setTab("listings");
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!provider) return null;

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <Home className="w-4 h-4" /> },
    { id: "profile", label: "Company Profile", icon: <User className="w-4 h-4" /> },
    { id: "listings", label: "My Listings", icon: <Building2 className="w-4 h-4" /> },
    { id: "leads", label: "Live Enquiries", icon: <Users className="w-4 h-4" /> },
    { id: "documents", label: "Documents", icon: <FileText className="w-4 h-4" /> },
    { id: "billing", label: "Billing", icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy text-white flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}>
        <div className="p-6 border-b border-white/10">
          <button type="button" onClick={openPublicHomeWithoutLeavingPortal} className="group -m-2 flex cursor-pointer items-center gap-3 rounded-xl p-2 text-left transition-all duration-200 hover:bg-white/10 hover:shadow-lg hover:shadow-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300" title="Open APGP website in a new tab">
            <span className="transition-transform duration-200 group-hover:scale-105"><APGPLogo variant="compact" height={36} /></span>
            <div>
              <div className="font-bold text-white font-heading text-sm transition-colors group-hover:text-teal-200">APGP Portal</div>
              <div className="text-xs text-teal-300 transition-colors group-hover:text-white">Provider Dashboard</div>
            </div>
          </button>
        </div>

        <div className="p-4 border-b border-white/10">
          <button type="button" onClick={() => setLocation("/")} className="group w-full cursor-pointer rounded-xl bg-white/10 p-3 text-left transition-all duration-200 hover:bg-white/20 hover:shadow-md hover:shadow-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300" title="Open the APGP homepage in this tab">
            <p className="text-xs text-teal-300 font-semibold uppercase tracking-widest mb-1">Signed in as</p>
            <p className="text-sm font-medium text-white truncate transition-colors group-hover:text-teal-100">{provider.organisationName || provider.email}</p>
            <p className="text-xs text-gray-400 truncate transition-colors group-hover:text-white/80">{provider.email}</p>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === item.id ? "bg-teal text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <button
            onClick={() => { setTab("add-listing"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "add-listing" ? "bg-teal text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}
          >
            <Plus className="w-4 h-4" />
            Add Property
          </button>
          <div className="border-t border-white/10 mt-2 pt-2">
            <button
              onClick={() => logout.mutate()}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-navy font-heading text-sm">Provider Dashboard</span>
          <div className="w-9" />
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Overview */}
          {tab === "overview" && (
            <div>
              <h1 className="text-2xl font-bold text-navy font-heading mb-2">
                Welcome back{provider.organisationName ? `, ${provider.organisationName}` : ""}
              </h1>
              <p className="text-gray-500 text-sm mb-8">Here's a summary of your APGP provider account.</p>

              {/* Profile completion banner */}
              {!provider.profileComplete && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Complete your company profile</p>
                    <p className="text-xs text-amber-700 mt-1">Add your organisation details, ABN, and regions serviced to be visible to the APGP team.</p>
                    <button onClick={initProfileForm} className="text-xs font-semibold text-amber-800 underline mt-2">Complete profile →</button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-teal" />
                    </div>
                    <span className="text-sm font-semibold text-navy">Total Listings</span>
                  </div>
                  <div className="text-3xl font-bold text-navy">{listings.length}</div>
                  <p className="text-xs text-gray-400 mt-1">Active properties</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm font-semibold text-navy">Available</span>
                  </div>
                  <div className="text-3xl font-bold text-navy">{listings.filter((l) => l.vacancyStatus === "Available").length}</div>
                  <p className="text-xs text-gray-400 mt-1">Vacancies open</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <span className="text-sm font-semibold text-navy">Pending</span>
                  </div>
                  <div className="text-3xl font-bold text-navy">{listings.filter((l) => l.vacancyStatus === "Pending").length}</div>
                  <p className="text-xs text-gray-400 mt-1">Listings awaiting approval</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <button onClick={() => setTab("leads")} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-teal/30 transition-all text-left group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-teal-light transition-colors">
                      <Users className="w-5 h-5 text-purple-600 group-hover:text-teal transition-colors" />
                    </div>
                    <span className="text-sm font-semibold text-navy">Live Enquiries</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-teal transition-colors" />
                  </div>
                  <div className="text-3xl font-bold text-navy">{leads.length}</div>
                  <p className="text-xs text-gray-400 mt-1">New participant leads — click to view</p>
                </button>
                <button onClick={() => setTab("documents")} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-teal/30 transition-all text-left group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-teal-light transition-colors">
                      <FileText className="w-5 h-5 text-blue-600 group-hover:text-teal transition-colors" />
                    </div>
                    <span className="text-sm font-semibold text-navy">Documents</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-teal transition-colors" />
                  </div>
                  <div className="text-3xl font-bold text-navy">{documents.length}</div>
                  <p className="text-xs text-gray-400 mt-1">Uploaded documents — click to view</p>
                </button>
              </div>

              <h2 className="text-xl font-bold text-navy font-heading mb-4">Your Listings</h2>
              {listings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-navy mb-2">No listings yet</h3>
                  <p className="text-gray-500 text-sm mb-6">Add your first SDA or SIL property to make it visible to the APGP team.</p>
                  <Button onClick={() => setTab("add-listing")} className="bg-teal hover:bg-teal-600 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add Your First Property
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {listings.map((listing) => (
                    <div key={listing.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-bold text-navy">{listing.propertyName || listing.address}</h3>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${vacancyBadge[listing.vacancyStatus]}`}>
                              {listing.vacancyStatus}
                            </span>
                            <Badge variant="outline" className="text-xs border-teal text-teal">{listing.propertyType}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span>{listing.address}{listing.suburb ? `, ${listing.suburb}` : ""}{listing.state ? `, ${listing.state}` : ""}</span>
                          </div>
                          <div className="flex gap-4 mt-3 text-xs text-gray-500">
                            <span>{listing.availableRooms} available / {listing.totalRooms} total rooms</span>
                            {listing.sdaCategory && <span>SDA: {listing.sdaCategory}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setListingForm({
                                propertyName: listing.propertyName ?? "",
                                address: listing.address ?? "",
                                suburb: listing.suburb ?? "",
                                state: (listing.state ?? "NSW") as typeof listingForm.state,
                                postcode: listing.postcode ?? "",
                                propertyType: (listing.propertyType ?? "SDA") as "SDA" | "SIL" | "Both",
                                sdaCategory: (listing.sdaCategory ?? "") as SdaCategoryType | "",
                                vacancyStatus: (listing.vacancyStatus ?? "Available") as "Available" | "Pending" | "Occupied",
                                availableRooms: listing.availableRooms ?? 1,
                                totalRooms: listing.totalRooms ?? 1,
                                supportNeeds: listing.supportNeeds ?? "",
                                description: listing.description ?? "",
                                propertyLink: listing.propertyLink ?? "",
                              });
                              setEditingId(listing.id);
                              setTab("add-listing");
                            }}
                            className="p-2 rounded-lg text-gray-400 hover:text-teal hover:bg-teal-light transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Remove this listing?")) deleteListing.mutate({ id: listing.id });
                            }}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Participant Leads Feed */}
          {tab === "leads" && (
            <div>
              {/* Header with live indicator */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-navy font-heading">Live Participant Enquiries</h1>
                    <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Live Feed
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">Real-time disability accommodation enquiries from our participant pipeline. These leads come directly from our CRM — no personal information is shown.</p>
                </div>
              </div>

              {/* Search + State Filter */}
              {leads.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-5">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={leadSearchQuery}
                        onChange={(e) => setLeadSearchQuery(e.target.value)}
                        placeholder="Search by accommodation type, postcode, timeline..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-teal outline-none"
                      />
                    </div>
                    <div className="sm:w-48">
                      <select
                        value={leadStateFilter}
                        onChange={(e) => setLeadStateFilter(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-teal outline-none bg-white"
                      >
                        <option value="">All States</option>
                        {["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    {(leadSearchQuery || leadStateFilter) && (
                      <button
                        onClick={() => { setLeadSearchQuery(""); setLeadStateFilter(""); }}
                        className="text-xs text-gray-400 hover:text-navy transition-colors px-2"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {/* State quick-filter pills */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => setLeadStateFilter("")}
                      className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                        leadStateFilter === "" ? "bg-navy text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      All
                    </button>
                    {["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setLeadStateFilter(leadStateFilter === s ? "" : s)}
                        className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                          leadStateFilter === s ? "bg-teal text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}


              {/* How it works banner */}
              <div className="bg-navy rounded-2xl p-5 mb-6 flex items-start gap-3">
                <Handshake className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">How to action a lead</p>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">Browse the enquiries below. If you have a suitable property, click <strong className="text-teal-300">I'm Interested</strong>. You'll sign a Referral Agreement and Consent Form, then the APGP team will contact both parties to progress the placement. You only pay if the participant moves in.</p>
                </div>
              </div>

              {(() => {
                const q = leadSearchQuery.toLowerCase().trim();
                const filteredLeads = leads.filter((lead) => {
                  const matchSearch = !q ||
                    lead.accommodationType.toLowerCase().includes(q) ||
                    lead.dwellingType.toLowerCase().includes(q) ||
                    lead.moveInTimeline.toLowerCase().includes(q) ||
                    (lead.postcode ?? "").includes(q) ||
                    (lead.mondayLeadId ?? "").includes(q);
                  // Match state: use preferredState first, then derive from postcode as fallback
                  const leadState = lead.preferredState || postcodeToState(lead.postcode);
                  const matchState = !leadStateFilter ||
                    (leadState ?? "").toUpperCase() === leadStateFilter.toUpperCase();
                  return matchSearch && matchState;
                });
                return filteredLeads.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-navy mb-2">{leads.length === 0 ? "No active leads at this time" : "No leads match your search"}</h3>
                  <p className="text-gray-500 text-sm">{leads.length === 0 ? "New participant requests will appear here as they come in. Check back soon." : "Try adjusting your search or state filter."}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLeads.map((lead) => {
                    const summary = `${lead.accommodationType} · ${lead.dwellingType} · ${lead.moveInTimeline} · ${lead.postcode ? `Postcode ${lead.postcode}` : (lead.preferredState ?? 'Any state')}`;
                    const isNew = (Date.now() - new Date(lead.createdAt).getTime()) < 24 * 60 * 60 * 1000; // within 24h
                    return (
                      <div key={lead.id} className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 p-6 ${lead.alreadyInterested ? 'border-green-200 bg-green-50/30' : isNew ? 'border-teal/40 ring-1 ring-teal/20' : 'border-gray-100'}`}>
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            {/* Header row */}
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              {isNew && !lead.alreadyInterested && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-teal text-white animate-pulse">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white" /> NEW
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-navy text-white">
                                <Tag className="w-3 h-3" /> {lead.accommodationType.split('(')[0].trim()}
                              </span>
                              {lead.ndisRegistered === 'Yes' && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                                  <CheckCircle2 className="w-3 h-3" /> NDIS Registered
                                </span>
                              )}
                              {lead.ndisRegistered === 'In progress' && (
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700">NDIS In Progress</span>
                              )}
                              {lead.alreadyInterested && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                                  <CheckCircle2 className="w-3 h-3" /> Interest Submitted
                                </span>
                              )}
                            </div>

                            {/* Details grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                              <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-400 mb-1">Request for</p>
                                <p className="text-sm font-semibold text-navy">{lead.careFor}</p>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-400 mb-1">NDIS Registered</p>
                                <p className={`text-sm font-semibold flex items-center gap-1 ${
                                  (lead.ndisRegistered ?? '').toLowerCase().includes('yes') ? 'text-green-700' :
                                  (lead.ndisRegistered ?? '').toLowerCase().includes('no') ? 'text-red-600' : 'text-amber-600'
                                }`}>
                                  {(lead.ndisRegistered ?? '').toLowerCase().includes('yes') ? '\u2705' :
                                   (lead.ndisRegistered ?? '').toLowerCase().includes('no') ? '\u274c' : '\u23f3'} {lead.ndisRegistered ?? 'Not specified'}
                                </p>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-400 mb-1">Accommodation type</p>
                                <p className="text-sm font-semibold text-navy">{lead.accommodationType.split('(')[0].trim()}</p>
                              </div>
                              {(lead as { ndisFundingType?: string | null }).ndisFundingType && (lead as { ndisFundingType?: string | null }).ndisFundingType !== 'Not specified' && (
                                <div className="bg-gray-50 rounded-xl p-3">
                                  <p className="text-xs text-gray-400 mb-1">NDIS Funding Type</p>
                                  <p className="text-sm font-semibold text-navy">{(lead as { ndisFundingType?: string | null }).ndisFundingType}</p>
                                </div>
                              )}
                              {lead.dwellingType && lead.dwellingType !== 'Not specified' && (
                                <div className="bg-gray-50 rounded-xl p-3">
                                  <p className="text-xs text-gray-400 mb-1">Dwelling type</p>
                                  <p className="text-sm font-semibold text-navy">{lead.dwellingType}</p>
                                </div>
                              )}
                              {lead.moveInTimeline && lead.moveInTimeline !== 'Not specified' && (
                                <div className="bg-gray-50 rounded-xl p-3">
                                  <p className="text-xs text-gray-400 mb-1">Move-in timeline</p>
                                  <p className="text-sm font-semibold text-navy flex items-center gap-1"><Clock className="w-3 h-3 text-teal" />{lead.moveInTimeline}</p>
                                </div>
                              )}
                              <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-400 mb-1">Postcode</p>
                                <p className="text-sm font-semibold text-navy flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-teal" />
                                  {lead.postcode ? lead.postcode : (lead.preferredState && lead.preferredState !== 'Any' ? lead.preferredState : 'Not provided')}
                                </p>
                              </div>
                              {lead.sdaCategory && lead.sdaCategory !== 'N/A' && (
                                <div className="bg-gray-50 rounded-xl p-3">
                                  <p className="text-xs text-gray-400 mb-1">SDA category</p>
                                  <p className="text-sm font-semibold text-navy">{lead.sdaCategory}</p>
                                </div>
                              )}
                            </div>

                            {lead.supportNeeds && (
                              <div className="bg-teal-light rounded-xl p-3">
                                <p className="text-xs text-gray-500 mb-1">Support needs noted</p>
                                <p className="text-sm text-gray-700">{lead.supportNeeds}</p>
                              </div>
                            )}

                            <div className="flex items-center gap-4 mt-3 flex-wrap">
                              <p className="text-xs text-gray-400">
                                Received {new Date(lead.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                              {lead.mondayLeadId && (
                                <p className="text-xs font-mono font-bold text-navy bg-navy/10 px-2.5 py-1 rounded-lg">
                                  Lead ID: {lead.mondayLeadId}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action */}
                          <div className="shrink-0">
                            {lead.alreadyInterested ? (
                              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>Interest Submitted</span>
                              </div>
                            ) : (
                              <Button
                                onClick={() => { setInterestLeadId(lead.id); setInterestLeadSummary(summary); }}
                                className="bg-teal hover:bg-teal-600 text-white"
                              >
                                <Handshake className="w-4 h-4 mr-2" />
                                I'm Interested
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
              })()}
            </div>
          )}

          {/* Documents */}
          {tab === "documents" && (
            <div>
              <h1 className="text-2xl font-bold text-navy font-heading mb-2">Documents</h1>
              <p className="text-gray-500 text-sm mb-6">Upload and manage your signed agreements, NDIS registration, insurance certificates, and other important documents.</p>

              {/* Upload area */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
                <h3 className="font-bold text-navy font-heading mb-4">Upload a Document</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label className="text-navy font-medium text-sm mb-1.5 block">Document Category</Label>
                    <Select value={uploadCategory} onValueChange={(v) => setUploadCategory(v as typeof uploadCategory)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Referral Agreement">Referral Agreement</SelectItem>
                        <SelectItem value="Consent Form">Consent Form</SelectItem>
                        <SelectItem value="NDIS Registration">NDIS Registration</SelectItem>
                        <SelectItem value="Insurance">Insurance</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label className="text-navy font-medium text-sm mb-1.5 block">File Upload</Label>
                    <div className="flex items-center gap-2">
                      <Input type="file" ref={fileInputRef} onChange={handleFileUpload} className="flex-1" />
                      <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-teal hover:bg-teal-600 text-white">
                        {uploading ? "Uploading..." : "Upload"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {documents.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-navy mb-2">No documents uploaded</h3>
                  <p className="text-gray-500 text-sm">Upload your agreements, registration, and insurance documents here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-bold text-navy">{doc.fileName}</h3>
                            <Badge variant="outline" className="text-xs border-teal text-teal">{doc.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-500">Uploaded {new Date(doc.uploadedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View document"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-teal bg-teal-light hover:bg-teal hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> View
                          </a>
                          <a
                            href={doc.fileUrl}
                            download={doc.fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Download"
                            className="p-2 rounded-lg text-gray-400 hover:text-navy hover:bg-gray-100 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => {
                              if (confirm("Remove this document?")) deleteDoc.mutate({ id: doc.id });
                            }}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Billing */}
          {tab === "billing" && (
            <div>
              <h1 className="text-2xl font-bold text-navy font-heading mb-2">Billing & Payments</h1>
              <p className="text-gray-500 text-sm mb-6">Manage your subscription, view invoices, and update payment methods.</p>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
                <h3 className="font-bold text-navy font-heading mb-4">Subscription Plan</h3>
                <p className="text-lg font-semibold text-navy mb-2">Free Tier</p>
                <p className="text-gray-500 text-sm mb-4">You are currently on the free tier. Contact APGP to discuss your partnership options.</p>
                <Button className="bg-teal hover:bg-teal-600 text-white">Contact Support</Button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-bold text-navy font-heading mb-4">Payment Methods</h3>
                <p className="text-gray-500 text-sm">No payment methods on file for the free tier.</p>
              </div>
            </div>
          )}

          {/* Company Profile */}
          {tab === "profile" && (
            <div>
              <h1 className="text-2xl font-bold text-navy font-heading mb-2">Company Profile</h1>
              <p className="text-gray-500 text-sm mb-6">Update your organisation details, contact information, and service regions.</p>

              <form onSubmit={(e) => {
                e.preventDefault();
                updateProfile.mutate({ ...profileForm, companyType: profileForm.companyType || undefined });
              }} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="organisationName" className="text-navy font-medium text-sm mb-1.5 block">Organisation Name</Label>
                    <Input
                      id="organisationName"
                      value={profileForm.organisationName}
                      onChange={(e) => setProfileForm({ ...profileForm, organisationName: e.target.value })}
                      placeholder="Your Organisation Name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="abn" className="text-navy font-medium text-sm mb-1.5 block">ABN</Label>
                    <Input
                      id="abn"
                      value={profileForm.abn}
                      onChange={(e) => setProfileForm({ ...profileForm, abn: e.target.value })}
                      placeholder="Your ABN"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactName" className="text-navy font-medium text-sm mb-1.5 block">Contact Name</Label>
                    <Input
                      id="contactName"
                      value={profileForm.contactName}
                      onChange={(e) => setProfileForm({ ...profileForm, contactName: e.target.value })}
                      placeholder="Contact Person's Name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactTitle" className="text-navy font-medium text-sm mb-1.5 block">Contact Title</Label>
                    <Input
                      id="contactTitle"
                      value={profileForm.contactTitle}
                      onChange={(e) => setProfileForm({ ...profileForm, contactTitle: e.target.value })}
                      placeholder="e.g., CEO, Manager"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-navy font-medium text-sm mb-1.5 block">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="e.g., 0412 345 678"
                      type="tel"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website" className="text-navy font-medium text-sm mb-1.5 block">Website</Label>
                    <Input
                      id="website"
                      value={profileForm.website}
                      onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                      placeholder="https://yourcompany.com.au"
                      type="url"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyType" className="text-navy font-medium text-sm mb-1.5 block">Company Type</Label>
                    <Select value={profileForm.companyType} onValueChange={(v) => setProfileForm({ ...profileForm, companyType: v as "SDA" | "SIL" | "Both" })}> 
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SDA">SDA Provider</SelectItem>
                        <SelectItem value="SIL">SIL Provider</SelectItem>
                        <SelectItem value="Both">Both SDA & SIL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="supportTypes" className="text-navy font-medium text-sm mb-1.5 block">Support Types Provided</Label>
                    <Select value={profileForm.supportTypes} onValueChange={(v) => setProfileForm({ ...profileForm, supportTypes: v })}> 
                      <SelectTrigger><SelectValue placeholder="Select support types" /></SelectTrigger>
                      <SelectContent>
                        {SUPPORT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mb-6">
                  <Label htmlFor="regionsServiced" className="text-navy font-medium text-sm mb-1.5 block">Regions Serviced (comma-separated)</Label>
                  <Input
                    id="regionsServiced"
                    value={profileForm.regionsServiced}
                    onChange={(e) => setProfileForm({ ...profileForm, regionsServiced: e.target.value })}
                    placeholder="e.g., Sydney, Melbourne, Brisbane"
                  />
                </div>
                <Button type="submit" disabled={updateProfile.isPending} className="bg-teal hover:bg-teal-600 text-white">
                  {updateProfile.isPending ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            </div>
          )}

          {/* My Listings */}
          {tab === "listings" && (
            <div>
              <h1 className="text-2xl font-bold text-navy font-heading mb-2">My Property Listings</h1>
              <p className="text-gray-500 text-sm mb-6">Manage your SDA and SIL property listings. These are visible to the APGP team for participant matching.</p>

              <div className="flex justify-end mb-4">
                <Button onClick={() => setTab("add-listing")} className="bg-teal hover:bg-teal-600 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Add New Listing
                </Button>
              </div>

              {listings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-navy mb-2">No listings yet</h3>
                  <p className="text-gray-500 text-sm mb-6">Add your first SDA or SIL property to make it visible to the APGP team.</p>
                  <Button onClick={() => setTab("add-listing")} className="bg-teal hover:bg-teal-600 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add Your First Property
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {listings.map((listing) => (
                    <div key={listing.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-bold text-navy">{listing.propertyName || listing.address}</h3>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${vacancyBadge[listing.vacancyStatus]}`}>
                              {listing.vacancyStatus}
                            </span>
                            <Badge variant="outline" className="text-xs border-teal text-teal">{listing.propertyType}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span>{listing.address}{listing.suburb ? `, ${listing.suburb}` : ""}{listing.state ? `, ${listing.state}` : ""}</span>
                          </div>
                          <div className="flex gap-4 mt-3 text-xs text-gray-500">
                            <span>{listing.availableRooms} available / {listing.totalRooms} total rooms</span>
                            {listing.sdaCategory && <span>SDA: {listing.sdaCategory}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setListingForm({
                                propertyName: listing.propertyName ?? "",
                                address: listing.address ?? "",
                                suburb: listing.suburb ?? "",
                                state: (listing.state ?? "NSW") as typeof listingForm.state,
                                postcode: listing.postcode ?? "",
                                propertyType: (listing.propertyType ?? "SDA") as "SDA" | "SIL" | "Both",
                                sdaCategory: (listing.sdaCategory ?? "") as SdaCategoryType | "",
                                vacancyStatus: (listing.vacancyStatus ?? "Available") as "Available" | "Pending" | "Occupied",
                                availableRooms: listing.availableRooms ?? 1,
                                totalRooms: listing.totalRooms ?? 1,
                                supportNeeds: listing.supportNeeds ?? "",
                                description: listing.description ?? "",
                                propertyLink: listing.propertyLink ?? "",
                              });
                              setEditingId(listing.id);
                              setTab("add-listing");
                            }}
                            className="p-2 rounded-lg text-gray-400 hover:text-teal hover:bg-teal-light transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Remove this listing?")) deleteListing.mutate({ id: listing.id });
                            }}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add/Edit Listing */}
          {tab === "add-listing" && (
            <div>
              <h1 className="text-2xl font-bold text-navy font-heading mb-2">{editingId ? "Edit Property Listing" : "Add New Property Listing"}</h1>
              <p className="text-gray-500 text-sm mb-6">{editingId ? "Update the details for your property listing." : "Add a new SDA or SIL property to your listings."}</p>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (editingId) {
                  updateListing.mutate({ id: editingId as number, ...listingForm, sdaCategory: listingForm.sdaCategory || undefined });
                } else {
                  createListing.mutate({ ...listingForm, sdaCategory: listingForm.sdaCategory || undefined });
                }
              }} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="propertyName" className="text-navy font-medium text-sm mb-1.5 block">Property Name</Label>
                    <Input
                      id="propertyName"
                      value={listingForm.propertyName}
                      onChange={(e) => setListingForm({ ...listingForm, propertyName: e.target.value })}
                      placeholder="e.g., 'The Sanctuary' or 'Main Street House'"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-navy font-medium text-sm mb-1.5 block">Street Address</Label>
                    <Input
                      id="address"
                      value={listingForm.address}
                      onChange={(e) => setListingForm({ ...listingForm, address: e.target.value })}
                      placeholder="e.g., 123 Main St"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="suburb" className="text-navy font-medium text-sm mb-1.5 block">Suburb</Label>
                    <Input
                      id="suburb"
                      value={listingForm.suburb}
                      onChange={(e) => setListingForm({ ...listingForm, suburb: e.target.value })}
                      placeholder="e.g., Sydney"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-navy font-medium text-sm mb-1.5 block">State</Label>
                    <Select value={listingForm.state} onValueChange={(v) => setListingForm({ ...listingForm, state: v as StateType })}>
                      <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                      <SelectContent>
                        {STATES.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="postcode" className="text-navy font-medium text-sm mb-1.5 block">Postcode</Label>
                    <Input
                      id="postcode"
                      value={listingForm.postcode}
                      onChange={(e) => setListingForm({ ...listingForm, postcode: e.target.value })}
                      placeholder="e.g., 2000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="propertyType" className="text-navy font-medium text-sm mb-1.5 block">Property Type</Label>
                    <Select value={listingForm.propertyType} onValueChange={(v) => setListingForm({ ...listingForm, propertyType: v as "SDA" | "SIL" | "Both" })}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SDA">SDA Property</SelectItem>
                        <SelectItem value="SIL">SIL Property</SelectItem>
                        <SelectItem value="Both">Both SDA & SIL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {listingForm.propertyType !== "SIL" && (
                    <div>
                      <Label htmlFor="sdaCategory" className="text-navy font-medium text-sm mb-1.5 block">SDA Category</Label>
                      <Select value={listingForm.sdaCategory} onValueChange={(v) => setListingForm({ ...listingForm, sdaCategory: v as SdaCategoryType })}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {SDA_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="vacancyStatus" className="text-navy font-medium text-sm mb-1.5 block">Vacancy Status</Label>
                    <Select value={listingForm.vacancyStatus} onValueChange={(v) => setListingForm({ ...listingForm, vacancyStatus: v as "Available" | "Pending" | "Occupied" })}>
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Occupied">Occupied</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="totalRooms" className="text-navy font-medium text-sm mb-1.5 block">Total Rooms</Label>
                    <Input
                      id="totalRooms"
                      value={listingForm.totalRooms}
                      onChange={(e) => setListingForm({ ...listingForm, totalRooms: parseInt(e.target.value) || 0 })}
                      type="number"
                      min={1}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="availableRooms" className="text-navy font-medium text-sm mb-1.5 block">Available Rooms</Label>
                    <Input
                      id="availableRooms"
                      value={listingForm.availableRooms}
                      onChange={(e) => setListingForm({ ...listingForm, availableRooms: parseInt(e.target.value) || 0 })}
                      type="number"
                      min={0}
                      max={listingForm.totalRooms}
                      required
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <Label htmlFor="supportNeeds" className="text-navy font-medium text-sm mb-1.5 block">Support Needs Provided (comma-separated)</Label>
                  <Textarea
                    id="supportNeeds"
                    value={listingForm.supportNeeds}
                    onChange={(e) => setListingForm({ ...listingForm, supportNeeds: e.target.value })}
                    placeholder="e.g., 24/7 care, personal care, community access"
                    rows={3}
                  />
                </div>
                <div className="mb-6">
                  <Label htmlFor="description" className="text-navy font-medium text-sm mb-1.5 block">Property Description</Label>
                  <Textarea
                    id="description"
                    value={listingForm.description}
                    onChange={(e) => setListingForm({ ...listingForm, description: e.target.value })}
                    placeholder="Provide a detailed description of the property, its features, and the supports available."
                    rows={5}
                    required
                  />
                </div>
                <div className="mb-6">
                  <Label htmlFor="propertyLink" className="text-navy font-medium text-sm mb-1.5 block">External Property Link (Optional)</Label>
                  <Input
                    id="propertyLink"
                    value={listingForm.propertyLink}
                    onChange={(e) => setListingForm({ ...listingForm, propertyLink: e.target.value })}
                    placeholder="https://yourwebsite.com/property-listing"
                    type="url"
                  />
                </div>
                <div className="flex gap-4">
                  <Button type="submit" disabled={createListing.isPending || updateListing.isPending} className="bg-teal hover:bg-teal-600 text-white">
                    {editingId ? (updateListing.isPending ? "Saving..." : "Save Changes") : (createListing.isPending ? "Adding..." : "Add Listing")}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setEditingId(null);
                    setTab("listings");
                    setListingForm({ propertyName: "", address: "", suburb: "", state: "NSW", postcode: "", propertyType: "SDA", sdaCategory: "", vacancyStatus: "Available", availableRooms: 1, totalRooms: 1, supportNeeds: "", description: "", propertyLink: "" });
                  }}>Cancel</Button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {interestLeadId !== null && provider && (
        <ReferralAgreementModal
          onClose={() => setInterestLeadId(null)}
          leadId={interestLeadId}
          leadSummary={interestLeadSummary}
          provider={provider}
          onSuccess={() => {
              toast.success("Interest submitted. The APGP team will be in touch.");
            refetchLeads();
            setInterestLeadId(null);
          }}
        />
      )}

      <LeadNotificationToast />
    </div>
  );
}
