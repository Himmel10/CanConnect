import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { addApplication } from "@/lib/applicationStorage";
import { Logo } from "@/components/Logo";

const PoliceClearance = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    address: "",
    email: "",
    phone: "",
    purpose: "",
    additionalInfo: "",
    paymentMethod: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        const newApp = addApplication("Police Clearance", formData);
        toast.success(`Application submitted! Reference ID: ${newApp.id}`);
        navigate(`/payment/${newApp.id}`);
      } catch (error) {
        toast.error("Failed to submit application. Please try again.");
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Logo />
        </div>
      </header>

      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Police Clearance Application</CardTitle>
            <CardDescription>
              Apply for your police clearance certificate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="First name" 
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input 
                      id="middleName" 
                      placeholder="Middle name"
                      value={formData.middleName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Last name" 
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Birth Date</Label>
                    <Input 
                      id="birthDate" 
                      type="date" 
                      required
                      value={formData.birthDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthPlace">Birth Place</Label>
                    <Input 
                      id="birthPlace" 
                      placeholder="Municipality, Province" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input id="height" type="number" placeholder="170" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Complete Address</Label>
                  <Textarea 
                    id="address" 
                    placeholder="House No., Street, Barangay, Municipality"
                    required 
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="email@example.com" 
                      required 
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+63 912 345 6789" 
                      required 
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Purpose of Request</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Select 
                    value={formData.purpose}
                    onValueChange={(value) => handleSelectChange("purpose", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employment">Employment - Local</SelectItem>
                      <SelectItem value="employment-abroad">Employment - Abroad</SelectItem>
                      <SelectItem value="visa">Visa Application</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select 
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="e-wallet">E-Wallet</SelectItem>
                    <SelectItem value="cash">Cash Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border border-info bg-info/10 p-4">
                <h4 className="mb-2 font-semibold text-info-foreground">Required Documents</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Valid Government-issued ID</li>
                  <li>Birth Certificate (Original or Certified True Copy)</li>
                  <li>Barangay Clearance</li>
                  <li>1x1 ID Picture (2 copies)</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Link to="/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PoliceClearance;
