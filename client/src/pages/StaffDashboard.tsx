import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Search, Building2, MapPin, Filter, LogOut, Home, Users, Shield,
  ChevronDown, X, Menu, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

const STATES = ["", "NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];
const PROPERTY_TYPES = ["", "SDA", "SIL", "Both"];
const VACANCY_STATUSES = ["", "Available", "Pending", "Occupied"];

const vacancyBadge: Record<string, string> = {
  Available: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Occupied: "bg-gray-100 text-gray-600",
};

type Tab = "search" | "overview";

export default function StaffDashboard() {
  const [, setLocation] = useLocation();
  const { user, loading, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("search");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    state: "",
    propertyType: "",
    vacancyStatus: "",
    suburb: "",
    supportNeeds: "",
  });
  const [activeFilters, setActiveFilters] = useState(filters);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (user.role !== "admin" && user.role !== "staff") {
        toast.error("Access restricted to Ausnew staff only.");
        setLocation("/staff/login");
      }
    } else if (!loading && !user) {
      setLocation("/staff/login");
    }
  }, [user, loading, setLocation]);

  const { data: results = [], isFetching } = trpc.accommodation.search.useQuery(
    {
      state: activeFilters.state || undefined,
      propertyType: activeFilters.propertyType || undefined,
      vacancyStatus: activeFilters.vacancyStatus || undefined,
      suburb: activeFilters.suburb || undefined,
      supportNeeds: activeFilters.supportNeeds || undefined,
    },
    { enabled: hasSearched }
  );

  const handleSearch = () => {
    setActiveFilters(filters);
    setHasSearched(true);
  };

  const clearFilters = () => {
    const empty = { state: "", propertyType: "", vacancyStatus: "", suburb: "", supportNeeds: "" };
    setFilters(empty);
    setActiveFilters(empty);
    setHasSearched(false);
  };

  const handleLogout = () => {
    logout();
    setLocation("/staff/login");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user.role !== "admin" && user.role !== "staff") return null;

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <Home className="w-4 h-4" /> },
    { id: "search", label: "Property Search", icon: <Search className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy text-white flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}>
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal flex items-center justify-center text-white font-bold font-heading">A</div>
            <div>
              <div className="font-bold text-white font-heading text-sm">APGP Staff</div>
              <div className="text-xs text-teal-300">Internal Portal</div>
            </div>
          </Link>
        </div>

        <div className="p-4 border-b border-white/10">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3.5 h-3.5 text-teal-300" />
              <p className="text-xs text-teal-300 font-semibold uppercase tracking-widest">{user.role}</p>
            </div>
            <p className="text-sm font-medium text-white truncate">{user.name ?? "Staff Member"}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
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
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors w-full">
            <ExternalLink className="w-4 h-4" />
            Public Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
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
          <span className="font-bold text-navy font-heading text-sm">Staff Portal</span>
          <div className="w-9" />
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Overview */}
          {tab === "overview" && (
            <div>
              <h1 className="text-2xl font-bold text-navy font-heading mb-2">Staff Dashboard</h1>
              <p className="text-gray-500 text-sm mb-8">Welcome, {user.name ?? "Staff Member"}. Use the Property Search to find and filter available accommodation listings.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setTab("search")}
                  className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow text-left group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-teal-light flex items-center justify-center mb-5 group-hover:bg-teal transition-colors">
                    <Search className="w-7 h-7 text-teal group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-navy font-heading mb-2">Property Search</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Search and filter all provider accommodation listings by state, property type, vacancy status, and support needs.</p>
                </button>
                <div className="bg-navy rounded-2xl p-8 text-white">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
                    <Shield className="w-7 h-7 text-teal-300" />
                  </div>
                  <h3 className="text-lg font-bold font-heading mb-2">Access Level: {user.role}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">You have access to all provider accommodation listings. Provider portal data is read-only from this interface.</p>
                </div>
              </div>
            </div>
          )}

          {/* Property Search */}
          {tab === "search" && (
            <div>
              <h1 className="text-2xl font-bold text-navy font-heading mb-2">Property Search</h1>
              <p className="text-gray-500 text-sm mb-6">Search all provider accommodation listings. This tool is restricted to authorised Ausnew staff.</p>

              {/* Filters */}
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
                    <label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">Property Type</label>
                    <Select value={filters.propertyType} onValueChange={(v) => setFilters({ ...filters, propertyType: v === "all" ? "" : v })}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="All types" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {PROPERTY_TYPES.filter(Boolean).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">Vacancy Status</label>
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
                    <Input
                      value={filters.suburb}
                      onChange={(e) => setFilters({ ...filters, suburb: e.target.value })}
                      placeholder="e.g. Parramatta"
                      className="h-9 text-sm"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">Support Needs</label>
                    <Input
                      value={filters.supportNeeds}
                      onChange={(e) => setFilters({ ...filters, supportNeeds: e.target.value })}
                      placeholder="e.g. High Physical"
                      className="h-9 text-sm"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={handleSearch} className="bg-teal hover:bg-teal-600 text-white" disabled={isFetching}>
                    <Search className="w-4 h-4 mr-2" />
                    {isFetching ? "Searching..." : "Search Properties"}
                  </Button>
                  {hasSearched && (
                    <Button variant="outline" onClick={clearFilters} className="border-gray-200 text-gray-600">
                      <X className="w-4 h-4 mr-2" /> Clear
                    </Button>
                  )}
                </div>
              </div>

              {/* Results */}
              {!hasSearched && (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-navy mb-2">Search Provider Listings</h3>
                  <p className="text-gray-500 text-sm">Use the filters above to search all provider accommodation listings across Australia.</p>
                </div>
              )}

              {hasSearched && !isFetching && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-navy">{results.length}</span>{" "}
                      {results.length === 1 ? "property" : "properties"} found
                    </p>
                  </div>
                  {results.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                      <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-semibold text-navy mb-2">No properties found</h3>
                      <p className="text-gray-500 text-sm">Try adjusting your filters or clearing the search.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {results.map((listing) => (
                        <div key={listing.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 className="font-bold text-navy">{listing.propertyName || listing.address}</h3>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${vacancyBadge[listing.vacancyStatus]}`}>
                                  {listing.vacancyStatus}
                                </span>
                                <Badge variant="outline" className="text-xs border-teal text-teal">{listing.propertyType}</Badge>
                                {listing.sdaCategory && (
                                  <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">{listing.sdaCategory}</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                <span>{listing.address}{listing.suburb ? `, ${listing.suburb}` : ""}{listing.state ? `, ${listing.state}` : ""} {listing.postcode}</span>
                              </div>
                              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
                                <span>{listing.availableRooms} available / {listing.totalRooms} total rooms</span>
                                {listing.supportNeeds && <span>Supports: {listing.supportNeeds}</span>}
                              </div>
                              {listing.description && (
                                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{listing.description}</p>
                              )}
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-xs text-gray-400 mb-1">Provider</p>
                              <p className="text-sm font-semibold text-navy">{listing.providerName ?? "—"}</p>
                              <p className="text-xs text-gray-500">{listing.providerEmail}</p>
                              {listing.propertyLink && (
                                <a
                                  href={listing.propertyLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-teal hover:underline mt-2"
                                >
                                  View listing <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
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
        </main>
      </div>
    </div>
  );
}
