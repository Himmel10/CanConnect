import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft, Heart } from "lucide-react";
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

const MarriageCertificate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    husbandName: "",
    wifeName: "",
    marriageDate: "",
    marriagePlace: "",
    purpose: "",
    copies: "1",
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
        const newApp = addApplication("Marriage Certificate", formData);
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
              <Heart className="h-12 w-12 text-primary" />
              <div>
                <CardTitle className="text-2xl">Marriage Certificate Request</CardTitle>
                <CardDescription>Apply for a local copy of marriage certificate</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="husbandName">Husband's Full Name</Label>
                  <Input 
                    id="husbandName" 
                    required
                    value={formData.husbandName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wifeName">Wife's Maiden Name</Label>
                  <Input 
                    id="wifeName" 
                    required
                    value={formData.wifeName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="marriageDate">Date of Marriage</Label>
                  <Input 
                    id="marriageDate" 
                    type="date" 
                    required
                    value={formData.marriageDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marriagePlace">Place of Marriage</Label>
                  <Input 
                    id="marriagePlace" 
                    required 
                    placeholder="Candelaria, Quezon"
                    value={formData.marriagePlace}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Request</Label>
                <Select 
                  value={formData.purpose}
                  onValueChange={(value) => handleSelectChange("purpose", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa">Visa Application</SelectItem>
                    <SelectItem value="employment">Employment</SelectItem>
                    <SelectItem value="legal">Legal Matters</SelectItem>
                    <SelectItem value="benefits">Benefits/Insurance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="copies">Number of Copies</Label>
                <Input 
                  id="copies" 
                  type="number" 
                  min="1" 
                  value={formData.copies}
                  onChange={handleInputChange}
                  required 
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
                  <li>Valid ID of applicant</li>
                  <li>Authorization letter (if representative)</li>
                  <li>Payment fee: ₱50 per copy</li>
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

export default MarriageCertificate;
