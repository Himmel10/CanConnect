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

const BusinessPermit = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    businessAddress: "",
    applicationType: "",
    ownerFirstName: "",
    ownerLastName: "",
    ownerEmail: "",
    ownerPhone: "",
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
        const newApp = addApplication("Business Permit", formData);
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
            <CardTitle className="text-2xl">Business Permit Application</CardTitle>
            <CardDescription>
              Apply for a new business permit or renew an existing one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input 
                    id="businessName" 
                    placeholder="Enter business name" 
                    required 
                    value={formData.businessName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select 
                    value={formData.businessType}
                    onValueChange={(value) => handleSelectChange("businessType", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="food">Food Service</SelectItem>
                      <SelectItem value="professional">Professional Service</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Textarea 
                    id="businessAddress" 
                    placeholder="Complete business address"
                    required 
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applicationType">Application Type</Label>
                  <Select 
                    value={formData.applicationType}
                    onValueChange={(value) => handleSelectChange("applicationType", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Application</SelectItem>
                      <SelectItem value="renewal">Renewal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Owner Information</h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ownerFirstName">First Name</Label>
                    <Input 
                      id="ownerFirstName" 
                      placeholder="First name" 
                      required 
                      value={formData.ownerFirstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerLastName">Last Name</Label>
                    <Input 
                      id="ownerLastName" 
                      placeholder="Last name" 
                      required 
                      value={formData.ownerLastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail">Email Address</Label>
                    <Input 
                      id="ownerEmail" 
                      type="email" 
                      placeholder="email@example.com" 
                      required 
                      value={formData.ownerEmail}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone">Phone Number</Label>
                    <Input 
                      id="ownerPhone" 
                      type="tel" 
                      placeholder="+63 912 345 6789" 
                      required 
                      value={formData.ownerPhone}
                      onChange={handleInputChange}
                    />
                  </div>
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
                  <li>DTI Registration (for sole proprietorship)</li>
                  <li>Valid ID of the business owner</li>
                  <li>Barangay Clearance</li>
                  <li>Cedula (Community Tax Certificate)</li>
                  <li>Location Map/Sketch</li>
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

export default BusinessPermit;
