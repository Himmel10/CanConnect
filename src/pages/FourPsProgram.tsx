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

const FourPsProgram = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success("4Ps Program application submitted successfully!");
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
                <CardTitle className="text-2xl">4Ps Program Application</CardTitle>
                <CardDescription>Pantawid Pamilyong Pilipino Program - Apply for conditional cash transfer assistance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Household Head Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Household Head Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="householdHeadName">Full Name</Label>
                  <Input id="householdHeadName" required placeholder="Juan Dela Cruz" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="civilStatus">Civil Status</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="separated">Separated</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
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

              {/* Household Members */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Household Members (Children 0-18 years old)</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfChildren">Number of Children (0-18 years)</Label>
                    <Input id="numberOfChildren" type="number" min="1" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numberOfSchoolAge">Number of School-Age Children (6-18 years)</Label>
                    <Input id="numberOfSchoolAge" type="number" min="0" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="householdSize">Total Household Size</Label>
                  <Input id="householdSize" type="number" min="2" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="childrenList">List of Children (Name, Age, School/Status)</Label>
                  <Textarea id="childrenList" required placeholder="1. Maria, 8 years old, Grade 3&#10;2. Jose, 5 years old, Pre-school" rows={5} />
                </div>
              </div>

              {/* Financial & Health Status */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Financial & Health Status</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncome">Monthly Household Income (₱)</Label>
                    <Input id="monthlyIncome" type="number" min="0" step="0.01" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primaryOccupation">Primary Occupation of Head</Label>
                    <Input id="primaryOccupation" required placeholder="e.g., Farmer, Laborer, Vendor" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="housingType">Type of Housing</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select housing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owned">Owned</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="shared">Shared/Informal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="healthStatus">Health Status of Children</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Good health</SelectItem>
                      <SelectItem value="with-condition">With health conditions</SelectItem>
                      <SelectItem value="undernourished">Undernourished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prenatalPostnatal">Pregnant/Nursing Members</Label>
                  <Input id="prenatalPostnatal" type="number" min="0" required />
                </div>
              </div>

              {/* Commitments */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Program Commitments</h3>
                
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-3">
                  <p className="text-sm font-semibold text-blue-900">As a 4Ps beneficiary, you must:</p>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input type="checkbox" id="commit1" className="mt-1" required />
                      <label htmlFor="commit1" className="text-sm text-blue-900">
                        Ensure children attend school regularly (at least 85% attendance)
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <input type="checkbox" id="commit2" className="mt-1" required />
                      <label htmlFor="commit2" className="text-sm text-blue-900">
                        Bring children for regular health check-ups and immunizations
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <input type="checkbox" id="commit3" className="mt-1" required />
                      <label htmlFor="commit3" className="text-sm text-blue-900">
                        Pregnant women must attend prenatal care
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <input type="checkbox" id="commit4" className="mt-1" required />
                      <label htmlFor="commit4" className="text-sm text-blue-900">
                        Comply with nutrition and health programs
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="mb-4 font-semibold">Required Documents:</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input type="checkbox" id="req1" className="mt-1" />
                    <label htmlFor="req1" className="text-sm text-muted-foreground">
                      Valid ID of household head (both sides)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req2" className="mt-1" />
                    <label htmlFor="req2" className="text-sm text-muted-foreground">
                      Birth certificates of all children
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req3" className="mt-1" />
                    <label htmlFor="req3" className="text-sm text-muted-foreground">
                      School enrollment/records of school-age children
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req4" className="mt-1" />
                    <label htmlFor="req4" className="text-sm text-muted-foreground">
                      Proof of income/livelihood
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req5" className="mt-1" />
                    <label htmlFor="req5" className="text-sm text-muted-foreground">
                      Barangay Clearance
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req6" className="mt-1" />
                    <label htmlFor="req6" className="text-sm text-muted-foreground">
                      Certificate of Indigency
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req7" className="mt-1" />
                    <label htmlFor="req7" className="text-sm text-muted-foreground">
                      Health certificates (if any medical conditions)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req8" className="mt-1" />
                    <label htmlFor="req8" className="text-sm text-muted-foreground">
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

export default FourPsProgram;
