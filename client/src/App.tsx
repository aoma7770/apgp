import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Scroll to top on every route change
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Pathways from "./pages/Pathways";
import DoneForYou from "./pages/DoneForYou";
import Pricing from "./pages/Pricing";
import Outcomes from "./pages/Outcomes";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ParticipantEnquiries from "./pages/ParticipantEnquiries";


// Provider portal
import ProviderRegister from "./pages/ProviderRegister";
import ProviderLogin from "./pages/ProviderLogin";
import ProviderDashboard from "./pages/ProviderDashboard";

// Staff portal
import StaffLogin from "./pages/StaffLogin";
import StaffDashboard from "./pages/StaffDashboard";
import StaffBlog from "./pages/StaffBlog";

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
      {/* Public */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/pathways" component={Pathways} />
      <Route path="/done-for-you" component={DoneForYou} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/outcomes" component={Outcomes} />
      <Route path="/faq" component={FAQ} />
      <Route path="/terms" component={Terms} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/participant-enquiries" component={ParticipantEnquiries} />


      {/* Provider portal */}
      <Route path="/provider/register" component={ProviderRegister} />
      <Route path="/provider/login" component={ProviderLogin} />
      <Route path="/provider/dashboard" component={ProviderDashboard} />

      {/* Staff portal */}
      <Route path="/staff/login" component={StaffLogin} />
      <Route path="/staff/dashboard" component={StaffDashboard} />
      <Route path="/staff/blog" component={StaffBlog} />

      {/* Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
