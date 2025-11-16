import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import BarangayClearance from "./pages/BarangayClearance";
import BusinessPermit from "./pages/BusinessPermit";
import PoliceClearance from "./pages/PoliceClearance";
import BirthCertificate from "./pages/BirthCertificate";
import MarriageCertificate from "./pages/MarriageCertificate";
import CertificateOfResidency from "./pages/CertificateOfResidency";
import CertificateOfIndigency from "./pages/CertificateOfIndigency";
import CommunityTaxCertificate from "./pages/CommunityTaxCertificate";
import BuildingPermit from "./pages/BuildingPermit";
import SeniorCitizenID from "./pages/SeniorCitizenID";
import PWDID from "./pages/PWDID";
import DeathCertificate from "./pages/DeathCertificate";
import CENOMAR from "./pages/CENOMAR";
import SoloParentID from "./pages/SoloParentID";
import OccupancyPermit from "./pages/OccupancyPermit";
import FencingPermit from "./pages/FencingPermit";
import DemolitionPermit from "./pages/DemolitionPermit";
import TricycleFranchise from "./pages/TricycleFranchise";
import MedicalBurialAssistance from "./pages/MedicalBurialAssistance";
import FourPsProgram from "./pages/FourPsProgram";
import FinancialAssistance from "./pages/FinancialAssistance";
import HealthSanitationClearance from "./pages/HealthSanitationClearance";
import VeterinaryCertificate from "./pages/VeterinaryCertificate";
import Profile from "./pages/Profile";
import Tracking from "./pages/Tracking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services/barangay-clearance" element={<BarangayClearance />} />
          <Route path="/services/business-permit" element={<BusinessPermit />} />
          <Route path="/services/police-clearance" element={<PoliceClearance />} />
          <Route path="/services/birth-certificate" element={<BirthCertificate />} />
          <Route path="/services/marriage-certificate" element={<MarriageCertificate />} />
          <Route path="/services/certificate-of-residency" element={<CertificateOfResidency />} />
          <Route path="/services/certificate-of-indigency" element={<CertificateOfIndigency />} />
          <Route path="/services/community-tax-certificate" element={<CommunityTaxCertificate />} />
          <Route path="/services/building-permit" element={<BuildingPermit />} />
          <Route path="/services/senior-citizen-id" element={<SeniorCitizenID />} />
          <Route path="/services/pwd-id" element={<PWDID />} />
          <Route path="/services/death-certificate" element={<DeathCertificate />} />
          <Route path="/services/cenomar" element={<CENOMAR />} />
          <Route path="/services/solo-parent-id" element={<SoloParentID />} />
          <Route path="/services/occupancy-permit" element={<OccupancyPermit />} />
          <Route path="/services/fencing-permit" element={<FencingPermit />} />
          <Route path="/services/demolition-permit" element={<DemolitionPermit />} />
          <Route path="/services/tricycle-franchise" element={<TricycleFranchise />} />
          <Route path="/services/medical-burial-assistance" element={<MedicalBurialAssistance />} />
          <Route path="/services/4ps-program" element={<FourPsProgram />} />
          <Route path="/services/financial-assistance" element={<FinancialAssistance />} />
          <Route path="/services/health-sanitation-clearance" element={<HealthSanitationClearance />} />
          <Route path="/services/veterinary-certificate" element={<VeterinaryCertificate />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/tracking/:id" element={<Tracking />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
