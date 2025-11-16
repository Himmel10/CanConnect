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

const TricycleFranchise = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success("Tricycle Franchise application submitted successfully!");
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
                <CardTitle className="text-2xl">Tricycle Franchise Application</CardTitle>
                <CardDescription>Apply for a tricycle franchise permit and vehicle registration</CardDescription>
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
                    <Label htmlFor="licenseNumber">Driver's License Number</Label>
                    <Input id="licenseNumber" required placeholder="D123456789" />
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

              {/* Vehicle Information */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Vehicle Details</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make/Brand</Label>
                    <Input id="make" required placeholder="e.g., Bajaj, TVS, Piaggio" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" required placeholder="e.g., RE Auto Rickshaw" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="engineNumber">Engine Number</Label>
                    <Input id="engineNumber" required placeholder="Engine serial number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chassisNumber">Chassis Number</Label>
                    <Input id="chassisNumber" required placeholder="Chassis serial number" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="yearManufactured">Year Manufactured</Label>
                    <Input id="yearManufactured" type="number" min="1990" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" required placeholder="e.g., Yellow, Black" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="motorcycle">Motorcycle with Sidecar</SelectItem>
                        <SelectItem value="auto-rickshaw">Auto Rickshaw</SelectItem>
                        <SelectItem value="trike">Motorized Tricycle</SelectItem>
                        <SelectItem value="hybrid">Hybrid Tricycle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seatingCapacity">Seating Capacity</Label>
                    <Input id="seatingCapacity" type="number" min="2" max="6" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displacement">Engine Displacement (cc)</Label>
                  <Input id="displacement" type="number" min="100" required placeholder="e.g., 100, 200" />
                </div>
              </div>

              {/* Operating Information */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Operating Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="route">Proposed Operating Route/Area</Label>
                  <Textarea id="route" required placeholder="Specify barangay/area where tricycle will operate" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operatingDays">Operating Days</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select operating schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily (All days)</SelectItem>
                      <SelectItem value="weekdays">Weekdays only</SelectItem>
                      <SelectItem value="weekends">Weekends only</SelectItem>
                      <SelectItem value="custom">Custom Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="officeAddress">Parking/Office Address</Label>
                    <Input id="officeAddress" required placeholder="Where vehicle will be parked" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Expected Daily Trips</Label>
                    <Input id="frequency" type="number" min="1" required />
                  </div>
                </div>
              </div>

              {/* Previous Experience */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Previous Experience</h3>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Driving Experience</Label>
                  <Input id="experience" type="number" min="0" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previousTricycle">Previous Tricycle Experience</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes, I have operated tricycle before</SelectItem>
                      <SelectItem value="no">No, this is my first time</SelectItem>
                      <SelectItem value="limited">Limited experience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Requirements */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="mb-4 font-semibold">Required Documents:</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input type="checkbox" id="req1" className="mt-1" />
                    <label htmlFor="req1" className="text-sm text-muted-foreground">
                      Valid Driver's License (Class 2 or 3 minimum)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req2" className="mt-1" />
                    <label htmlFor="req2" className="text-sm text-muted-foreground">
                      Certificate of Registration (CR) of vehicle
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req3" className="mt-1" />
                    <label htmlFor="req3" className="text-sm text-muted-foreground">
                      Official Receipt (OR) of vehicle
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req4" className="mt-1" />
                    <label htmlFor="req4" className="text-sm text-muted-foreground">
                      Barangay Clearance
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req5" className="mt-1" />
                    <label htmlFor="req5" className="text-sm text-muted-foreground">
                      NBI Clearance (not more than 6 months old)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req6" className="mt-1" />
                    <label htmlFor="req6" className="text-sm text-muted-foreground">
                      Certificate of Good Moral Character
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req7" className="mt-1" />
                    <label htmlFor="req7" className="text-sm text-muted-foreground">
                      Insurance Certificate/Policy (Compulsory Motor Vehicle Liability Insurance)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req8" className="mt-1" />
                    <label htmlFor="req8" className="text-sm text-muted-foreground">
                      Proof of ownership or authorization letter
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req9" className="mt-1" />
                    <label htmlFor="req9" className="text-sm text-muted-foreground">
                      Business Permit or Community Tax Certificate
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req10" className="mt-1" />
                    <label htmlFor="req10" className="text-sm text-muted-foreground">
                      Medical Certificate of Fitness
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req11" className="mt-1" />
                    <label htmlFor="req11" className="text-sm text-muted-foreground">
                      Photographs of vehicle (4 angles)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req12" className="mt-1" />
                    <label htmlFor="req12" className="text-sm text-muted-foreground">
                      Franchise fee: ₱500 - ₱1,000
                    </label>
                  </div>
                </div>
              </div>

              {/* Declaration */}
              <div className="rounded-lg border border-warning/50 bg-warning/5 p-4">
                <div className="flex gap-2">
                  <input type="checkbox" id="declaration" className="mt-1" required />
                  <label htmlFor="declaration" className="text-sm">
                    I hereby declare that all information provided in this application is true and correct. I understand that providing false information may result in the rejection of my application and possible legal consequences.
                  </label>
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

export default TricycleFranchise;
