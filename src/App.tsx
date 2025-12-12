import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/authContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
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
import PaymentProcessing from "./pages/PaymentProcessing";
import Payment from "./pages/Payment";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff-dashboard"
              element={
                <ProtectedRoute requiredRole="staff">
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/barangay-clearance"
              element={
                <ProtectedRoute>
                  <BarangayClearance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/business-permit"
              element={
                <ProtectedRoute>
                  <BusinessPermit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/police-clearance"
              element={
                <ProtectedRoute>
                  <PoliceClearance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/birth-certificate"
              element={
                <ProtectedRoute>
                  <BirthCertificate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/marriage-certificate"
              element={
                <ProtectedRoute>
                  <MarriageCertificate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/certificate-of-residency"
              element={
                <ProtectedRoute>
                  <CertificateOfResidency />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/certificate-of-indigency"
              element={
                <ProtectedRoute>
                  <CertificateOfIndigency />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/community-tax-certificate"
              element={
                <ProtectedRoute>
                  <CommunityTaxCertificate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/building-permit"
              element={
                <ProtectedRoute>
                  <BuildingPermit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/senior-citizen-id"
              element={
                <ProtectedRoute>
                  <SeniorCitizenID />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/pwd-id"
              element={
                <ProtectedRoute>
                  <PWDID />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/death-certificate"
              element={
                <ProtectedRoute>
                  <DeathCertificate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/cenomar"
              element={
                <ProtectedRoute>
                  <CENOMAR />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/solo-parent-id"
              element={
                <ProtectedRoute>
                  <SoloParentID />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/occupancy-permit"
              element={
                <ProtectedRoute>
                  <OccupancyPermit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/fencing-permit"
              element={
                <ProtectedRoute>
                  <FencingPermit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/demolition-permit"
              element={
                <ProtectedRoute>
                  <DemolitionPermit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/tricycle-franchise"
              element={
                <ProtectedRoute>
                  <TricycleFranchise />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/medical-burial-assistance"
              element={
                <ProtectedRoute>
                  <MedicalBurialAssistance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/4ps-program"
              element={
                <ProtectedRoute>
                  <FourPsProgram />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/financial-assistance"
              element={
                <ProtectedRoute>
                  <FinancialAssistance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/health-sanitation-clearance"
              element={
                <ProtectedRoute>
                  <HealthSanitationClearance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/veterinary-certificate"
              element={
                <ProtectedRoute>
                  <VeterinaryCertificate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracking"
              element={
                <ProtectedRoute>
                  <Tracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracking/:id"
              element={
                <ProtectedRoute>
                  <Tracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-processing"
              element={
                <ProtectedRoute>
                  <PaymentProcessing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/:appId"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-confirmation/:appId/:transactionId"
              element={
                <ProtectedRoute>
                  <PaymentConfirmation />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
