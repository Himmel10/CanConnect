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

const VeterinaryCertificate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success("Veterinary Certificate application submitted successfully!");
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
                <CardTitle className="text-2xl">Veterinary Certificate Application</CardTitle>
                <CardDescription>Apply for veterinary certificate from Municipal Agriculture Office</CardDescription>
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

              {/* Type of Certificate */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Type of Certificate Requested</h3>

                <div className="space-y-2">
                  <Label htmlFor="certificateType">Certificate Category</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select certificate type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="health">Animal Health Certificate</SelectItem>
                      <SelectItem value="vaccination">Vaccination Certificate</SelectItem>
                      <SelectItem value="brucellosis">Brucellosis Test Certificate</SelectItem>
                      <SelectItem value="tuberculosis">Tuberculosis Test Certificate</SelectItem>
                      <SelectItem value="transport">Animal Transport Permit</SelectItem>
                      <SelectItem value="breeding">Breeding Permit</SelectItem>
                      <SelectItem value="export">Export Health Certificate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose of Certificate</Label>
                  <Textarea id="purpose" required placeholder="Describe the purpose for which the certificate is needed" rows={3} />
                </div>
              </div>

              {/* Animal Information */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Animal Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="animalSpecies">Animal Species</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cattle">Cattle</SelectItem>
                      <SelectItem value="swine">Swine</SelectItem>
                      <SelectItem value="poultry">Poultry</SelectItem>
                      <SelectItem value="goat">Goat</SelectItem>
                      <SelectItem value="sheep">Sheep</SelectItem>
                      <SelectItem value="horse">Horse</SelectItem>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="rabbit">Rabbit</SelectItem>
                      <SelectItem value="fish">Fish</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="animalBreed">Breed</Label>
                    <Input id="animalBreed" required placeholder="e.g., Holstein, Landrace, White Leghorn" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="animalCount">Number of Animals</Label>
                    <Input id="animalCount" type="number" min="1" required />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="animalAge">Average Age of Animals</Label>
                    <Input id="animalAge" required placeholder="e.g., 2 years, 6 months" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="animalSex">Sex</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="animalIdentification">Animal Identification/Markings</Label>
                  <Textarea id="animalIdentification" required placeholder="Describe identifying marks, ear tags, brand marks, etc." rows={3} />
                </div>
              </div>

              {/* Farm/Facility Information */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Farm/Facility Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="facilityName">Name of Farm/Facility</Label>
                  <Input id="facilityName" required placeholder="Farm name or identifier" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facilityAddress">Location of Farm/Facility</Label>
                  <Textarea id="facilityAddress" required placeholder="Complete address" rows={2} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="facilityType">Type of Facility</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farm">Farm</SelectItem>
                        <SelectItem value="ranch">Ranch</SelectItem>
                        <SelectItem value="backyard">Backyard Rearing</SelectItem>
                        <SelectItem value="commercial">Commercial Operation</SelectItem>
                        <SelectItem value="breeding">Breeding Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operatingYears">Years in Operation</Label>
                    <Input id="operatingYears" type="number" min="0" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="farmSize">Farm/Facility Size (hectares or sq.m.)</Label>
                  <Input id="farmSize" placeholder="e.g., 2 hectares or 5000 sq.m." required />
                </div>
              </div>

              {/* Health & Management */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Animal Health & Management</h3>

                <div className="space-y-2">
                  <Label htmlFor="vaccinations">Vaccination Status</Label>
                  <Textarea id="vaccinations" required placeholder="List vaccines administered and dates" rows={3} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recentIllness">Any Recent Illness or Disease in Animals?</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes-recovered">Yes, but recovered</SelectItem>
                      <SelectItem value="yes-ongoing">Yes, still being treated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="illnessDetails">If yes, describe illness and treatment</Label>
                  <Textarea id="illnessDetails" placeholder="Describe the illness and treatment measures taken" rows={3} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="veterinarian">Name of Veterinarian (if previously examined)</Label>
                  <Input id="veterinarian" placeholder="Veterinarian name and clinic" />
                </div>
              </div>

              {/* Requirements */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="mb-4 font-semibold">Required Documents:</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input type="checkbox" id="req1" className="mt-1" />
                    <label htmlFor="req1" className="text-sm text-muted-foreground">
                      Valid ID of applicant
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req2" className="mt-1" />
                    <label htmlFor="req2" className="text-sm text-muted-foreground">
                      Proof of land ownership or lease
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req3" className="mt-1" />
                    <label htmlFor="req3" className="text-sm text-muted-foreground">
                      Farm/Facility registration documents (if available)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req4" className="mt-1" />
                    <label htmlFor="req4" className="text-sm text-muted-foreground">
                      Previous vaccination/health certificates
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req5" className="mt-1" />
                    <label htmlFor="req5" className="text-sm text-muted-foreground">
                      Photographs of animals/farm
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req6" className="mt-1" />
                    <label htmlFor="req6" className="text-sm text-muted-foreground">
                      Veterinarian recommendation letter (if applicable)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req7" className="mt-1" />
                    <label htmlFor="req7" className="text-sm text-muted-foreground">
                      Barangay Clearance
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id="req8" className="mt-1" />
                    <label htmlFor="req8" className="text-sm text-muted-foreground">
                      Processing fee: ₱200-₱300 (varies by certificate type)
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

export default VeterinaryCertificate;
