import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  Building2, User, LogOut, Plus, Edit2, Trash2, CheckCircle2, AlertCircle,
  Home, MapPin, ChevronRight, Settings, Menu, X, Users, Clock, Tag, Handshake,
  FileText, CreditCard, Upload, Download, Trash
} from "lucide-react";
import ReferralAgreementModal from "@/components/ReferralAgreementModal";
import LeadNotificationToast from "@/components/LeadNotificationToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Tab = "overview" | "profile" | "listings" | "add-listing" | "leads" | "documents" | "billing";

const STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];
const SUPPORT_TYPES = ["SDA", "SIL", "Both"];
const REGIONS = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];
const SDA_CATEGORIES = ["Improved Liveability", "Fully Accessible", "Robust", "High Physical Support", "Basic"];

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
      try { localStorage.removeItem("apgp_provider_token"); } catch { /* ignore */ }
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

  // Profile form
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
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal flex items-center justify-center text-white font-bold font-heading">A</div>
            <div>
              <div className="font-bold text-white font-heading text-sm">APGP Portal</div>
              <div className="text-xs text-teal-300">Provider Dashboard</div>
            </div>
          </Link>
        </div>

        <div className="p-4 border-b border-white/10">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xs text-teal-300 font-semibold uppercase tracking-widest mb-1">Signed in as</p>
            <p className="text-sm font-medium text-white truncate">{provider.organisationName || provider.email}</p>
            <p className="text-xs text-gray-400 truncate">{provider.email}</p>
          </div>
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
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => logout.mutate()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
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
                    <p className="text-xs text-amber-700 mt-1">Add your organisation details, ABN, and regions serviced to be visible to the Ausnew team.</p>
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
                    <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-navy" />
                    </div>
                    <span className="text-sm font-semibold text-navy">Profile</span>
                  </div>
                  <div className="text-sm font-semibold text-navy">{provider.profileComplete ? "Complete" : "Incomplete"}</div>
                  <p className="text-xs text-gray-400 mt-1">{provider.companyType ?? "Type not set"}</p>
                </div>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={initProfileForm} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center"><Settings className="w-5 h-5 text-teal" /></div>
                    <div className="text-left">
                      <p className="font-semibold text-navy text-sm">Company Profile</p>
                      <p className="text-xs text-gray-400">Update your organisation details</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal transition-colors" />
                </button>
                <button onClick={() => setTab("add-listing")} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center"><Plus className="w-5 h-5 text-teal" /></div>
                    <div className="text-left">
                      <p className="font-semibold text-navy text-sm">Add Property</p>
                      <p className="text-xs text-gray-400">List a new SDA or SIL accommodation</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal transition-colors" />
                </button>
              </div>
            </div>
          )}

          {/* Profile */}
          {tab === "profile" && (
            <div>
              <h1 className="text-2xl font-bold text-navy font-heading mb-2">Company Profile</h1>
              <p className="text-gray-500 text-sm mb-8">This information is shared with the Ausnew team and synced to our CRM.</p>
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm max-w-2xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateProfile.mutate({
                      ...profileForm,
                      companyType: profileForm.companyType as "SDA" | "SIL" | "Both" | undefined,
                    });
                  }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <Label className="text-navy font-medium text-sm">Organisation Name</Label>
                      <Input value={profileForm.organisationName} onChange={(e) => setProfileForm({ ...profileForm, organisationName: e.target.value })} placeholder="e.g. Sunrise Disability Housing" className="mt-1.5" />
                    </div>
                    <div>
                      <Label className="text-navy font-medium text-sm">ABN</Label>
                      <Input value={profileForm.abn} onChange={(e) => setProfileForm({ ...profileForm, abn: e.target.value })} placeholder="XX XXX XXX XXX" className="mt-1.5" />
                    </div>
                    <div>
                      <Label className="text-navy font-medium text-sm">Company Type</Label>
                      <Select value={profileForm.companyType} onValueChange={(v) => setProfileForm({ ...profileForm, companyType: v as "SDA" | "SIL" | "Both" })}>
                        <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          {SUPPORT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-navy font-medium text-sm">Contact Name</Label>
                      <Input value={profileForm.contactName} onChange={(e) => setProfileForm({ ...profileForm, contactName: e.target.value })} placeholder="Full name" className="mt-1.5" />
                    </div>
                    <div>
                      <Label className="text-navy font-medium text-sm">Contact Title</Label>
                      <Input value={profileForm.contactTitle} onChange={(e) => setProfileForm({ ...profileForm, contactTitle: e.target.value })} placeholder="e.g. Director" className="mt-1.5" />
                    </div>
                    <div>
                      <Label className="text-navy font-medium text-sm">Phone</Label>
                      <Input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="04XX XXX XXX" className="mt-1.5" />
                    </div>
                    <div>
                      <Label className="text-navy font-medium text-sm">Website</Label>
                      <Input value={profileForm.website} onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })} placeholder="https://yourwebsite.com.au" className="mt-1.5" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-navy font-medium text-sm">Regions Serviced</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {REGIONS.map((r) => {
                          const selected = profileForm.regionsServiced.split(",").map((s) => s.trim()).includes(r);
                          return (
                            <button
                              key={r}
                              type="button"
                              onClick={() => {
                                const current = profileForm.regionsServiced.split(",").map((s) => s.trim()).filter(Boolean);
                                const updated = selected ? current.filter((s) => s !== r) : [...current, r];
                                setProfileForm({ ...profileForm, regionsServiced: updated.join(", ") });
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selected ? "bg-teal text-white border-teal" : "bg-white text-gray-600 border-gray-200 hover:border-teal"}`}
                            >
                              {r}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" className="bg-teal hover:bg-teal-600 text-white" disabled={updateProfile.isPending}>
                      {updateProfile.isPending ? "Saving..." : "Save Profile"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setTab("overview")}>Cancel</Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Listings */}
          {tab === "listings" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-navy font-heading">My Listings</h1>
                  <p className="text-gray-500 text-sm mt-1">{listings.length} active {listings.length === 1 ? "property" : "properties"}</p>
                </div>
                <Button onClick={() => setTab("add-listing")} className="bg-teal hover:bg-teal-600 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Add Property
                </Button>
              </div>
              {listings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-navy mb-2">No listings yet</h3>
                  <p className="text-gray-500 text-sm mb-6">Add your first SDA or SIL property to make it visible to the Ausnew team.</p>
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
                  <p className="text-gray-500 text-sm">Real-time NDIS accommodation enquiries from Ausnew's participant pipeline. These leads come directly from our CRM — no personal information is shown.</p>
                </div>
                <div className="shrink-0 text-right hidden sm:block">
                  <p className="text-2xl font-extrabold text-navy font-heading">{leads.length}</p>
                  <p className="text-xs text-gray-400">active {leads.length === 1 ? 'enquiry' : 'enquiries'}</p>
                </div>
              </div>

              {/* How it works banner */}
              <div className="bg-navy rounded-2xl p-5 mb-6 flex items-start gap-3">
                <Handshake className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">How to action a lead</p>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">Browse the enquiries below. If you have a suitable property, click <strong className="text-teal-300">I'm Interested</strong>. You'll sign a Referral Agreement and Consent Form, then the Ausnew team will contact both parties to progress the placement. You only pay if the participant moves in.</p>
                </div>
              </div>

              {leads.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-navy mb-2">No active leads at this time</h3>
                  <p className="text-gray-500 text-sm">New participant requests will appear here as they come in. Check back soon.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leads.map((lead) => {
                    const summary = `${lead.accommodationType} · ${lead.dwellingType} · ${lead.moveInTimeline} · ${lead.preferredState ?? 'Any state'}`;
                    const isNew = (Date.now() - new Date(lead.createdAt).getTime()) < 48 * 60 * 60 * 1000; // within 48h
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
                                <Tag className="w-3 h-3" /> {lead.accommodationType}
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
                                <p className="text-xs text-gray-400 mb-1">Submitted by</p>
                                <p className="text-sm font-semibold text-navy">{lead.requesterType}</p>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-400 mb-1">Dwelling type</p>
                                <p className="text-sm font-semibold text-navy">{lead.dwellingType}</p>
                              </div>
                              {lead.sdaCategory && lead.sdaCategory !== 'N/A' && (
                                <div className="bg-gray-50 rounded-xl p-3">
                                  <p className="text-xs text-gray-400 mb-1">SDA category</p>
                                  <p className="text-sm font-semibold text-navy">{lead.sdaCategory}</p>
                                </div>
                              )}
                              <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-400 mb-1">Move-in timeline</p>
                                <p className="text-sm font-semibold text-navy flex items-center gap-1"><Clock className="w-3 h-3 text-teal" />{lead.moveInTimeline}</p>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-400 mb-1">Preferred state</p>
                                <p className="text-sm font-semibold text-navy flex items-center gap-1"><MapPin className="w-3 h-3 text-teal" />{lead.preferredState ?? 'Any'}</p>
                              </div>
                            </div>

                            {lead.supportNeeds && (
                              <div className="bg-teal-light rounded-xl p-3">
                                <p className="text-xs text-gray-500 mb-1">Support needs noted</p>
                                <p className="text-sm text-gray-700">{lead.supportNeeds}</p>
                              </div>
                            )}

                            <div className="flex items-center gap-4 mt-3">
                              <p className="text-xs text-gray-400">
                                Submitted {new Date(lead.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                              {lead.mondayLeadId && (
                                <p className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                  ID: {lead.mondayLeadId}
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
              )}
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
                        {["Referral Agreement", "Consent Form", "NDIS Registration", "Insurance", "Other"].map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading || uploadDoc.isPending}
                      className="bg-teal hover:bg-teal-600 text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading || uploadDoc.isPending ? "Uploading..." : "Choose File"}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">Accepted formats: PDF, Word, PNG, JPG. Maximum file size: 10MB.</p>
              </div>

              {/* Document list */}
              {documents.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-navy mb-2">No documents yet</h3>
                  <p className="text-gray-500 text-sm">Upload your signed agreements, NDIS registration, and other documents to keep them organised in one place.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-teal" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-navy text-sm truncate">{doc.fileName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-xs border-teal text-teal">{doc.category}</Badge>
                            {doc.fileSize && <span className="text-xs text-gray-400">{(doc.fileSize / 1024).toFixed(0)} KB</span>}
                            <span className="text-xs text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString('en-AU')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                          <button className="p-2 rounded-lg text-gray-400 hover:text-teal hover:bg-teal-light transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </a>
                        <button
                          onClick={() => { if (confirm("Remove this document?")) deleteDoc.mutate({ id: doc.id }); }}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
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
              <h1 className="text-2xl font-bold text-navy font-heading mb-2">Billing</h1>
              <p className="text-gray-500 text-sm mb-6">View your billing history, invoices, and payment details.</p>
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-navy mb-2">Billing Coming Soon</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                  Your billing history and invoices will appear here once your first placement is confirmed. Remember — you only pay when a participant moves in.
                </p>
                <div className="mt-6 bg-teal-light rounded-xl p-4 max-w-sm mx-auto">
                  <p className="text-sm font-semibold text-navy">Current Balance</p>
                  <p className="text-3xl font-extrabold text-teal font-heading mt-1">$0.00</p>
                  <p className="text-xs text-gray-500 mt-1">No outstanding invoices</p>
                </div>
              </div>
            </div>
          )}

          {/* Add/Edit listing */}
          {tab === "add-listing" && (
            <div>
              <h1 className="text-2xl font-bold text-navy font-heading mb-2">{editingId ? "Edit Property" : "Add New Property"}</h1>
              <p className="text-gray-500 text-sm mb-8">Fill in the details of your SDA or SIL accommodation.</p>
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm max-w-2xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const payload = {
                      ...listingForm,
                      sdaCategory: listingForm.sdaCategory as typeof listingForm.sdaCategory | undefined || undefined,
                      propertyLink: listingForm.propertyLink || undefined,
                    };
                    if (editingId) {
                      updateListing.mutate({ id: editingId, ...payload });
                    } else {
                      createListing.mutate(payload);
                    }
                  }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <Label className="text-navy font-medium text-sm">Property Name</Label>
                      <Input value={listingForm.propertyName} onChange={(e) => setListingForm({ ...listingForm, propertyName: e.target.value })} placeholder="e.g. Sunrise House — Parramatta" className="mt-1.5" required />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-navy font-medium text-sm">Full Address</Label>
                      <Input value={listingForm.address} onChange={(e) => setListingForm({ ...listingForm, address: e.target.value })} placeholder="Street address" className="mt-1.5" required />
                    </div>
                    <div>
                      <Label className="text-navy font-medium text-sm">Suburb</Label>
                      <Input value={listingForm.suburb} onChange={(e) => setListingForm({ ...listingForm, suburb: e.target.value })} placeholder="Suburb" className="mt-1.5" required />
                    </div>
                    <div>
                      <Label className="text-navy font-medium text-sm">Postcode</Label>
                      <Input value={listingForm.postcode} onChange={(e) => setListingForm({ ...listingForm, postcode: e.target.value })} placeholder="2000" maxLength={4} className="mt-1.5" required />
                    </div>
                    <div>
                      <Label className="text-navy font-medium text-sm">State</Label>
                      <Select value={listingForm.state} onValueChange={(v) => setListingForm({ ...listingForm, state: v as typeof listingForm.state })}>
                        <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                        <SelectContent>{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-navy font-medium text-sm">Property Type</Label>
                      <Select value={listingForm.propertyType} onValueChange={(v) => setListingForm({ ...listingForm, propertyType: v as "SDA" | "SIL" | "Both" })}>
                        <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                        <SelectContent>{SUPPORT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    {(listingForm.propertyType === "SDA" || listingForm.propertyType === "Both") && (
                      <div>
                        <Label className="text-navy font-medium text-sm">SDA Category</Label>
                        <Select value={listingForm.sdaCategory} onValueChange={(v) => setListingForm({ ...listingForm, sdaCategory: v as SdaCategoryType })}>
                          <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>{SDA_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    )}
                    <div>
                      <Label className="text-navy font-medium text-sm">Vacancy Status</Label>
                      <Select value={listingForm.vacancyStatus} onValueChange={(v) => setListingForm({ ...listingForm, vacancyStatus: v as "Available" | "Pending" | "Occupied" })}>
                        <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Occupied">Occupied</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-navy font-medium text-sm">Available Rooms</Label>
                      <Input type="number" min={0} value={listingForm.availableRooms} onChange={(e) => setListingForm({ ...listingForm, availableRooms: parseInt(e.target.value) || 0 })} className="mt-1.5" />
                    </div>
                    <div>
                      <Label className="text-navy font-medium text-sm">Total Rooms</Label>
                      <Input type="number" min={1} value={listingForm.totalRooms} onChange={(e) => setListingForm({ ...listingForm, totalRooms: parseInt(e.target.value) || 1 })} className="mt-1.5" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-navy font-medium text-sm">Support Needs Catered For</Label>
                      <Input value={listingForm.supportNeeds} onChange={(e) => setListingForm({ ...listingForm, supportNeeds: e.target.value })} placeholder="e.g. High Physical Support, Behaviour Support" className="mt-1.5" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-navy font-medium text-sm">Property Description</Label>
                      <Textarea value={listingForm.description} onChange={(e) => setListingForm({ ...listingForm, description: e.target.value })} placeholder="Describe the property, features, and any relevant details..." className="mt-1.5" rows={3} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-navy font-medium text-sm">Property Link <span className="text-gray-400 font-normal">(Housing Hub / Go-Nest)</span></Label>
                      <Input value={listingForm.propertyLink} onChange={(e) => setListingForm({ ...listingForm, propertyLink: e.target.value })} placeholder="https://housinghub.org.au/..." className="mt-1.5" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" className="bg-teal hover:bg-teal-600 text-white" disabled={createListing.isPending || updateListing.isPending}>
                      {createListing.isPending || updateListing.isPending ? "Saving..." : editingId ? "Update Listing" : "Add Listing"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setTab("listings"); setEditingId(null); }}>Cancel</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Live lead notifications for logged-in providers */}
      <LeadNotificationToast isPublic={false} />

      {/* Referral Agreement Modal */}
      {interestLeadId !== null && provider && (
        <ReferralAgreementModal
          leadId={interestLeadId}
          leadSummary={interestLeadSummary}
          provider={provider}
          onClose={() => { setInterestLeadId(null); setInterestLeadSummary(""); }}
          onSuccess={() => { setInterestLeadId(null); setInterestLeadSummary(""); refetchLeads(); }}
        />
      )}
    </div>
  );
}
