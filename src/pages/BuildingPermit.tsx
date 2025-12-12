import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, ArrowLeft, Building2 } from "lucide-react";
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

const BuildingPermit = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    applicantName: "",
    projectType: "",
    projectLocation: "",
    floorArea: "",
    stories: "",
    estimatedCost: "",
    engineer: "",
    paymentMethod: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        const newApp = addApplication("Building Permit", formData);
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
              <Building2 className="h-12 w-12 text-primary" />
              <div>
                <CardTitle className="text-2xl">Building Permit Application</CardTitle>
                <CardDescription>For construction, renovation, or repair projects</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="applicantName">Applicant/Owner Name</Label>
                <Input 
                  id="applicantName" 
                  required 
                  value={formData.applicantName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectType">Type of Construction</Label>
                <Select 
                  value={formData.projectType}
                  onValueChange={(value) => handleSelectChange("projectType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Construction</SelectItem>
                    <SelectItem value="renovation">Renovation</SelectItem>
                    <SelectItem value="addition">Addition/Extension</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="demolition">Demolition</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectLocation">Project Location</Label>
                <Textarea 
                  id="projectLocation" 
                  required 
                  placeholder="Complete address with lot number"
                  rows={2}
                  value={formData.projectLocation}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="floorArea">Total Floor Area (sq.m.)</Label>
                  <Input 
                    id="floorArea" 
                    type="number" 
                    required 
                    value={formData.floorArea}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stories">Number of Stories</Label>
                  <Input 
                    id="stories" 
                    type="number" 
                    min="1" 
                    required 
                    value={formData.stories}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedCost">Estimated Project Cost</Label>
                <Input 
                  id="estimatedCost" 
                  type="number" 
                  required 
                  placeholder="₱0.00"
                  value={formData.estimatedCost}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="engineer">Licensed Engineer/Architect</Label>
                <Input 
                  id="engineer" 
                  required 
                  placeholder="Full name and license number"
                  value={formData.engineer}
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
                  <li>Architectural plans (5 sets)</li>
                  <li>Structural plans</li>
                  <li>Electrical and plumbing plans</li>
                  <li>Title of property/Tax Declaration</li>
                  <li>Locational clearance</li>
                  <li>Certificate of land use</li>
                  <li>Engineer's license and stamp</li>
                  <li>Processing fee (varies by project cost)</li>
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

export default BuildingPermit;
