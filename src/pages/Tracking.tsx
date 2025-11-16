import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Shield, ArrowLeft, Search, Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Tracking = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const applications = [
    {
      id: "BRG-2024-001",
      type: "Barangay Clearance",
      status: "processing",
      date: "2024-11-15",
      steps: [
        { label: "Submitted", completed: true },
        { label: "Under Review", completed: true },
        { label: "Processing", completed: false },
        { label: "Ready for Pickup", completed: false },
      ],
    },
    {
      id: "BIZ-2024-045",
      type: "Business Permit",
      status: "approved",
      date: "2024-11-10",
      steps: [
        { label: "Submitted", completed: true },
        { label: "Under Review", completed: true },
        { label: "Processing", completed: true },
        { label: "Approved", completed: true },
      ],
    },
    {
      id: "POL-2024-089",
      type: "Police Clearance",
      status: "pending",
      date: "2024-11-14",
      steps: [
        { label: "Submitted", completed: true },
        { label: "Under Review", completed: false },
        { label: "Processing", completed: false },
        { label: "Ready for Pickup", completed: false },
      ],
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      processing: { icon: Clock, text: "Processing", className: "bg-primary text-primary-foreground" },
      approved: { icon: CheckCircle, text: "Approved", className: "bg-success text-success-foreground" },
      pending: { icon: AlertCircle, text: "Pending Review", className: "bg-warning text-warning-foreground" },
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={config.className}>
        <Icon className="mr-1 h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const filteredApplications = applications.filter(app =>
    app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Track Applications</h1>
          <p className="text-muted-foreground">
            Monitor the status of your document requests
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by application ID or type..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredApplications.map((app) => (
            <Card key={app.id}>
              <CardContent className="p-6">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-semibold">{app.type}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Application ID: <span className="font-mono font-medium text-foreground">{app.id}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {new Date(app.date).toLocaleDateString('en-PH', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(app.status)}
                  </div>
                </div>

                <div className="space-y-2">
                  {app.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        step.completed 
                          ? 'bg-success text-success-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-current" />
                        )}
                      </div>
                      <span className={step.completed ? 'font-medium' : 'text-muted-foreground'}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>

                {app.status === 'approved' && (
                  <div className="mt-4 rounded-lg border border-success bg-success/10 p-4">
                    <p className="text-sm font-medium text-success-foreground">
                      Your document is ready for pickup at the Municipal Office during office hours (8:00 AM - 5:00 PM, Monday to Friday)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filteredApplications.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">No applications found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or submit a new application
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracking;
