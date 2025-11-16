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

const FinancialAssistance = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success("Financial Assistance request submitted successfully!");
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
                <CardTitle className="text-2xl">Financial Assistance Request</CardTitle>
                <CardDescription>Apply for emergency financial assistance for qualified individuals and families</CardDescription>
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
                <h3 className="text-lg font-semibold">Type of Financial Assistance</h3>

                <div className="space-y-2">
                  <Label htmlFor="assistanceType">Assistance Category</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assistance type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Emergency/Calamity Relief</SelectItem>
                      <SelectItem value="livelihood">Livelihood/Business Capital</SelectItem>
                      <SelectItem value="education">Educational Assistance</SelectItem>
                      <SelectItem value="housing">Housing/Shelter Assistance</SelectItem>
                      <SelectItem value="medical">Medical/Health Assistance</SelectItem>
                      <SelectItem value="skills">Skills Training Program</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specifics">Specific Purpose/Details</Label>
                  <Textarea id="specifics" required placeholder="Describe the specific purpose of the assistance needed" rows={4} />
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
                  <Label htmlFor="perCapitaIncome">Per Capita Monthly Income (₱)</Label>
                  <Input id="perCapitaIncome" type="number" min="0" step="0.01" readOnly placeholder="Auto-calculated" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assistanceAmount">Amount of Assistance Requested (₱)</Label>
                  <Input id="assistanceAmount" type="number" min="0" step="0.01" required placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otherAssistance">Other Assistance/Support Received</Label>
                  <Textarea id="otherAssistance" placeholder="List any other assistance programs or support you're receiving" rows={3} />
                </div>
              </div>

              {/* Justification */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Justification</h3>

                <div className="space-y-2">
                  <Label htmlFor="whyAssistance">Why do you need this assistance?</Label>
                  <Textarea id="whyAssistance" required placeholder="Explain your current situation and why you need financial assistance" rows={5} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="impact">Expected Impact of Assistance</Label>
                  <Textarea id="impact" required placeholder="Describe how this assistance will help improve your situation" rows={4} />
                </div>
              </div>

              {/* Employment Status */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Employment Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Employment Status</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self-employed">Self-employed</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="underemployed">Underemployed</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="homemaker">Homemaker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Current Occupation/Source of Income</Label>
                  <Input id="occupation" required placeholder="e.g., Vendor, Laborer, Farmer" />
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
                      Proof of income or livelihood (payslips, business permit, etc.)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req5" className="mt-1" />
                    <label htmlFor="req5" className="text-sm text-muted-foreground">
                      Documentation supporting the request (receipts, medical reports, etc.)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req6" className="mt-1" />
                    <label htmlFor="req6" className="text-sm text-muted-foreground">
                      Birth certificates of family members (if applicable)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req7" className="mt-1" />
                    <label htmlFor="req7" className="text-sm text-muted-foreground">
                      Processing fee: FREE
                    </label>
                  </div>
                </div>
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

export default FinancialAssistance;
