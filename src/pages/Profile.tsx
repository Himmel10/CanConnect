import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, Mail, Phone, MapPin, Calendar, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();

  // Mock user data - in a real app, this would come from an API/context
  const userProfile = {
    name: "Joey B. Mondragon",
    email: "joeymondragon90@gmail.com",
    phone: "09171234567",
    address: "Purok-3, Lininti-an, Cantilan, Surigao del Sur",
    dateOfBirth: "January 15, 1985",
    idType: "National ID",
    idNumber: "123456789012-3",
    joinedDate: "December 1, 2025",
    profileComplete: 85,
  };

  const applications = [
    {
      id: "BRG-2024-001",
      type: "Barangay Clearance",
      status: "processing",
      date: "2024-11-15",
      dueDate: "2024-11-22",
    },
    {
      id: "BIZ-2024-045",
      type: "Business Permit",
      status: "approved",
      date: "2024-11-10",
      approvalDate: "2024-11-15",
    },
    {
      id: "BIR-2024-032",
      type: "Birth Certificate",
      status: "completed",
      date: "2024-11-05",
      completionDate: "2024-11-12",
    },
    {
      id: "PRF-2024-018",
      type: "Police Clearance",
      status: "pending",
      date: "2024-11-08",
      dueDate: "2024-11-25",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      processing: { variant: "default" as const, icon: Clock, text: "Processing", className: "bg-blue-100 text-blue-800 border-blue-300" },
      approved: { variant: "default" as const, icon: CheckCircle, text: "Approved", className: "bg-green-100 text-green-800 border-green-300" },
      completed: { variant: "default" as const, icon: CheckCircle, text: "Completed", className: "bg-emerald-100 text-emerald-800 border-emerald-300" },
      pending: { variant: "default" as const, icon: AlertCircle, text: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="mr-1 h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">CanConnect</span>
          </Link>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">JM</span>
                </div>
                <div>
                  <CardTitle className="text-3xl">{userProfile.name}</CardTitle>
                  <CardDescription className="text-base">Member since {userProfile.joinedDate}</CardDescription>
                </div>
              </div>
              <Button variant="outline" onClick={() => toast.info("Edit profile feature coming soon!")}>
                Edit Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userProfile.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userProfile.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userProfile.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Personal Information */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    {userProfile.dateOfBirth}
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground">ID Information</p>
                  <p className="mt-1 text-sm">{userProfile.idType}</p>
                  <p className="text-sm font-mono">{userProfile.idNumber}</p>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Profile Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div 
                      className="h-2 rounded-full bg-green-500 transition-all duration-300" 
                      style={{ width: `${userProfile.profileComplete}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-center font-medium">{userProfile.profileComplete}% Complete</p>
                  <Button className="w-full" size="sm" variant="outline">
                    Complete Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Applications */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">My Applications</CardTitle>
                  <Link to="/tracking">
                    <Button variant="link" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{app.type}</p>
                            <p className="text-xs text-muted-foreground">{app.id} • Submitted {app.date}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(app.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Account Settings */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences and security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Change password feature coming soon!")}>
                <span className="mr-2">🔒</span>
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Two-factor authentication coming soon!")}>
                <span className="mr-2">🔐</span>
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Notification settings coming soon!")}>
                <span className="mr-2">🔔</span>
                Notification Preferences
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Privacy settings coming soon!")}>
                <span className="mr-2">👁️</span>
                Privacy Settings
              </Button>
              <div className="border-t pt-4">
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  Log Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Help & Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Button variant="outline" className="h-auto flex-col py-4" onClick={() => toast.info("FAQ page coming soon!")}>
                <span className="text-2xl mb-2">❓</span>
                FAQ
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4" onClick={() => toast.info("Contact support coming soon!")}>
                <span className="text-2xl mb-2">💬</span>
                Contact Support
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4" onClick={() => toast.info("Knowledge base coming soon!")}>
                <span className="text-2xl mb-2">📚</span>
                Knowledge Base
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4" onClick={() => toast.info("Feedback form coming soon!")}>
                <span className="text-2xl mb-2">📝</span>
                Send Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
