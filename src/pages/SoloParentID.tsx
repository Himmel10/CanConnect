import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { addApplication } from "@/lib/applicationStorage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/Logo";

const SoloParentID = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    age: "",
    email: "",
    numberOfChildren: "",
    status: "",
    address: "",
    phone: "",
    paymentMethod: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      try {
        const newApp = addApplication("Solo Parent ID", formData);
        toast.success(`Application submitted! Reference ID: ${newApp.id}`);
        navigate(`/payment/${newApp.id}`);
      } catch (error) {
        toast.error("Failed to submit application. Please try again.");
        setIsSubmitting(false);
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

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-4">
              <FileText className="h-12 w-12 text-primary" />
              <div>
                <CardTitle className="text-2xl">Solo Parent ID Application</CardTitle>
                <CardDescription>Apply for Solo Parent Identification Card</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  required 
                  placeholder="Maria Dela Cruz"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input 
                    id="dateOfBirth" 
                    type="date" 
                    required 
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    required 
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    required 
                    placeholder="09XX-XXX-XXXX"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfChildren">Number of Children</Label>
                <Input 
                  id="numberOfChildren" 
                  type="number" 
                  min="1" 
                  required 
                  value={formData.numberOfChildren}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Parental Status</Label>
                <Select 
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="widow">Widow/Widower</SelectItem>
                    <SelectItem value="separated">Legally Separated</SelectItem>
                    <SelectItem value="annulled">Annulled</SelectItem>
                    <SelectItem value="unmarried">Unmarried</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Complete Address</Label>
                <Input 
                  id="address" 
                  required 
                  placeholder="Street, Barangay, Municipality, Province"
                  value={formData.address}
                  onChange={handleInputChange}
                />
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

              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="mb-2 font-semibold">Required Documents:</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Valid ID (Passport, Driver's License, or PRC ID)</li>
                  <li>Birth Certificates of children (photocopy)</li>
                  <li>Proof of Solo Parenting status (Death Certificate, Divorce Decree, Annulment, etc.)</li>
                  <li>Barangay Clearance</li>
                  <li>2x2 ID photos (4 pieces)</li>
                  <li>Processing fee: ₱0 (Free)</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SoloParentID;
