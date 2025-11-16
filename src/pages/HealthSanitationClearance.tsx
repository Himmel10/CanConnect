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

const HealthSanitationClearance = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success("Health & Sanitation Clearance application submitted successfully!");
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
                <CardTitle className="text-2xl">Health & Sanitation Clearance</CardTitle>
                <CardDescription>Apply for health and sanitation clearance for establishments and individuals</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Applicant Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Applicant Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="applicantName">Full Name</Label>
                  <Input id="applicantName" required placeholder="Juan Dela Cruz" />
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

              {/* Type of Clearance */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Type of Clearance Requested</h3>

                <div className="space-y-2">
                  <Label htmlFor="clearanceType">Clearance Category</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select clearance type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food-establishment">Food Establishment</SelectItem>
                      <SelectItem value="water-supply">Water Supply System</SelectItem>
                      <SelectItem value="wastewater">Wastewater Management</SelectItem>
                      <SelectItem value="healthcare">Healthcare Facility</SelectItem>
                      <SelectItem value="childcare">Childcare/Day Care Center</SelectItem>
                      <SelectItem value="swimming">Swimming Pool/Water Facility</SelectItem>
                      <SelectItem value="lodging">Lodging/Accommodation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Establishment Information */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Establishment/Facility Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="establishmentName">Name of Establishment/Facility</Label>
                  <Input id="establishmentName" required placeholder="e.g., ABC Restaurant, XYZ Clinic" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="establishmentAddress">Establishment Address</Label>
                  <Textarea id="establishmentAddress" required placeholder="Complete address of the establishment" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Type of Business/Service</Label>
                    <Input id="businessType" required placeholder="e.g., Restaurant, Bakery, Clinic" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operatingYears">Years in Operation</Label>
                    <Input id="operatingYears" type="number" min="0" required />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfEmployees">Number of Employees</Label>
                    <Input id="numberOfEmployees" type="number" min="1" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dailyCapacity">Daily Capacity/Customers</Label>
                    <Input id="dailyCapacity" type="number" min="1" required />
                  </div>
                </div>
              </div>

              {/* Health & Sanitation Details */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Health & Sanitation Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="waterSource">Water Source</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select water source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="municipal">Municipal Water Supply</SelectItem>
                      <SelectItem value="deep-well">Deep Well</SelectItem>
                      <SelectItem value="spring">Spring Water</SelectItem>
                      <SelectItem value="rainwater">Rainwater Harvesting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wasteDisposal">Waste Disposal Method</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select disposal method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="municipal">Municipal Waste Management</SelectItem>
                      <SelectItem value="septic">Septic Tank System</SelectItem>
                      <SelectItem value="treatment">Wastewater Treatment Plant</SelectItem>
                      <SelectItem value="recycling">Recycling Program</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sanitationMeasures">Implemented Sanitation Measures</Label>
                  <Textarea id="sanitationMeasures" required placeholder="Describe sanitation and hygiene practices (e.g., handwashing stations, food storage, employee training)" rows={4} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="violations">Any Previous Health/Sanitation Violations?</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No violations</SelectItem>
                      <SelectItem value="resolved">Yes, but resolved</SelectItem>
                      <SelectItem value="pending">Yes, pending resolution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="violationDetails">If yes, describe violations and corrective actions</Label>
                  <Textarea id="violationDetails" placeholder="Describe previous violations and steps taken to correct them" />
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Staff Certifications</h3>

                <div className="space-y-2">
                  <Label htmlFor="healthCerts">Number of Employees with Health Certificates</Label>
                  <Input id="healthCerts" type="number" min="0" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trainingCerts">Number of Employees with Food Safety/Sanitation Training</Label>
                  <Input id="trainingCerts" type="number" min="0" required />
                </div>
              </div>

              {/* Requirements */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="mb-4 font-semibold">Required Documents:</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input type="checkbox" id="req1" className="mt-1" />
                    <label htmlFor="req1" className="text-sm text-muted-foreground">
                      Valid ID of applicant/owner
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req2" className="mt-1" />
                    <label htmlFor="req2" className="text-sm text-muted-foreground">
                      Business Permit/License
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req3" className="mt-1" />
                    <label htmlFor="req3" className="text-sm text-muted-foreground">
                      Barangay Clearance
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req4" className="mt-1" />
                    <label htmlFor="req4" className="text-sm text-muted-foreground">
                      Floor plan/layout of establishment
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req5" className="mt-1" />
                    <label htmlFor="req5" className="text-sm text-muted-foreground">
                      Water source certificate/analysis report
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req6" className="mt-1" />
                    <label htmlFor="req6" className="text-sm text-muted-foreground">
                      Health certificates of food handlers (if applicable)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req7" className="mt-1" />
                    <label htmlFor="req7" className="text-sm text-muted-foreground">
                      Sanitation/waste disposal plan
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req8" className="mt-1" />
                    <label htmlFor="req8" className="text-sm text-muted-foreground">
                      Photographs of establishment (interior and exterior)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req9" className="mt-1" />
                    <label htmlFor="req9" className="text-sm text-muted-foreground">
                      Processing fee: ₱300-₱500
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

export default HealthSanitationClearance;
