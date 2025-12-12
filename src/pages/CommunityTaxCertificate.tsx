import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft, FileCheck } from "lucide-react";
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

const CommunityTaxCertificate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    sex: "",
    civilStatus: "",
    address: "",
    citizenship: "",
    occupation: "",
    annualIncome: "",
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
        const newApp = addApplication("Community Tax Certificate", formData);
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
              <FileCheck className="h-12 w-12 text-primary" />
              <div>
                <CardTitle className="text-2xl">Community Tax Certificate (Cedula)</CardTitle>
                <CardDescription>Basic community tax document</CardDescription>
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
                  placeholder="Juan Dela Cruz"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Date of Birth</Label>
                  <Input 
                    id="birthDate" 
                    type="date" 
                    required 
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sex">Sex</Label>
                  <Select 
                    value={formData.sex}
                    onValueChange={(value) => handleSelectChange("sex", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="civilStatus">Civil Status</Label>
                <Select 
                  value={formData.civilStatus}
                  onValueChange={(value) => handleSelectChange("civilStatus", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select civil status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    <SelectItem value="separated">Separated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Complete Address</Label>
                <Input 
                  id="address" 
                  required 
                  placeholder="House No., Street, Barangay"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="citizenship">Citizenship</Label>
                <Input 
                  id="citizenship" 
                  required 
                  defaultValue="Filipino"
                  value={formData.citizenship}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input 
                    id="occupation" 
                    required 
                    value={formData.occupation}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Gross Income</Label>
                  <Input 
                    id="annualIncome" 
                    type="number" 
                    required 
                    placeholder="₱0.00"
                    value={formData.annualIncome}
                    onChange={handleInputChange}
                  />
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

              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="mb-2 font-semibold">Required Documents:</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Valid ID</li>
                  <li>Basic fee: ₱5 (plus additional based on income)</li>
                  <li>Required for various transactions</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityTaxCertificate;
