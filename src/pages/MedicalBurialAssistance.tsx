import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const MedicalBurialAssistance = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success("Medical/Burial Assistance application submitted successfully!");
      navigate("/tracking");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">CanConnect</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <div className="flex items-center gap-4">
              <FileText className="h-12 w-12 text-primary" />
              <div>
                <CardTitle className="text-2xl">Medical/Burial Assistance Application</CardTitle>
                <CardDescription>Apply for medical or burial assistance benefits</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Applicant Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Applicant Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" required placeholder="Juan Dela Cruz" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" type="number" min="1" required />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Number</Label>
                    <Input id="phone" required placeholder="09XX-XXX-XXXX" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Complete Address</Label>
                  <Textarea id="address" required placeholder="Street, Barangay, Municipality, Province" />
                </div>
              </div>

              {/* Type of Assistance */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Type of Assistance Requested</h3>

                <div className="space-y-2">
                  <Label htmlFor="assistanceType">Assistance Type</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assistance type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical">Medical Assistance</SelectItem>
                      <SelectItem value="burial">Burial Assistance</SelectItem>
                      <SelectItem value="both">Both Medical and Burial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Medical Information */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Medical Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name (if different from applicant)</Label>
                  <Input id="patientName" placeholder="Leave blank if applicant is the patient" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="patientAge">Patient Age</Label>
                    <Input id="patientAge" type="number" min="1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship to Applicant</Label>
                    <Input id="relationship" placeholder="e.g., Child, Spouse, Parent" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="illness">Nature of Illness/Condition</Label>
                  <Textarea id="illness" placeholder="Describe the medical condition" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital/Clinic Name</Label>
                  <Input id="hospital" placeholder="Where the patient is/will be admitted" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">Estimated Medical Cost (₱)</Label>
                  <Input id="estimatedCost" type="number" min="0" step="0.01" placeholder="0.00" />
                </div>
              </div>

              {/* Burial Information */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Burial Information (if applicable)</h3>

                <div className="space-y-2">
                  <Label htmlFor="deceasedName">Deceased's Full Name</Label>
                  <Input id="deceasedName" placeholder="Full name of the deceased" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="deceasedAge">Age at Death</Label>
                    <Input id="deceasedAge" type="number" min="1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="burialRelationship">Relationship to Applicant</Label>
                    <Input id="burialRelationship" placeholder="e.g., Child, Spouse, Parent" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfDeath">Date of Death</Label>
                    <Input id="dateOfDeath" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="burialEstimatedCost">Estimated Burial Cost (₱)</Label>
                    <Input id="burialEstimatedCost" type="number" min="0" step="0.01" placeholder="0.00" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buriallocation">Place of Burial</Label>
                  <Input id="burialLocation" placeholder="Cemetery or location" />
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Financial Information</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncome">Monthly Household Income (₱)</Label>
                    <Input id="monthlyIncome" type="number" min="0" step="0.01" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="householdSize">Household Size</Label>
                    <Input id="householdSize" type="number" min="1" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otherAssistance">Other Assistance Received</Label>
                  <Textarea id="otherAssistance" placeholder="List any other assistance programs you're receiving" />
                </div>
              </div>

              {/* Requirements */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="mb-4 font-semibold">Required Documents:</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input type="checkbox" id="req1" className="mt-1" />
                    <label htmlFor="req1" className="text-sm text-muted-foreground">
                      Valid ID (both sides)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req2" className="mt-1" />
                    <label htmlFor="req2" className="text-sm text-muted-foreground">
                      Barangay Clearance
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req3" className="mt-1" />
                    <label htmlFor="req3" className="text-sm text-muted-foreground">
                      Certificate of Indigency
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req4" className="mt-1" />
                    <label htmlFor="req4" className="text-sm text-muted-foreground">
                      Medical certificate or hospital recommendation (for medical assistance)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req5" className="mt-1" />
                    <label htmlFor="req5" className="text-sm text-muted-foreground">
                      Death certificate (for burial assistance)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req6" className="mt-1" />
                    <label htmlFor="req6" className="text-sm text-muted-foreground">
                      Medical expenses/receipts
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req7" className="mt-1" />
                    <label htmlFor="req7" className="text-sm text-muted-foreground">
                      Birth certificate (for deceased in burial assistance)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req8" className="mt-1" />
                    <label htmlFor="req8" className="text-sm text-muted-foreground">
                      Proof of household income (payslips, business permit, etc.)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req9" className="mt-1" />
                    <label htmlFor="req9" className="text-sm text-muted-foreground">
                      Processing fee: FREE
                    </label>
                  </div>
                </div>
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

export default MedicalBurialAssistance;
