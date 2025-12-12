import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Shield, ArrowLeft, Search, Clock, CheckCircle, AlertCircle, FileText, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { searchApplications, getAllApplications, getApplicationStats } from "@/lib/applicationStorage";

const Tracking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState(getApplicationStats());

  // Load applications from storage on component mount and listen for changes
  useEffect(() => {
    const loadApplications = () => {
      const allApps = getAllApplications();
      setApplications(allApps);
      setStats(getApplicationStats());
    };

    loadApplications();

    // Listen for storage changes from other tabs/windows
    window.addEventListener("storage", loadApplications);
    
    // Also set up a listener for storage changes in the same window
    const handleStorageChange = () => {
      loadApplications();
    };
    window.addEventListener("appStorageUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", loadApplications);
      window.removeEventListener("appStorageUpdated", handleStorageChange);
    };
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      processing: { icon: Clock, text: "Processing", className: "bg-primary text-primary-foreground" },
      approved: { icon: CheckCircle, text: "Approved", className: "bg-green-600 text-white" },
      pending: { icon: AlertCircle, text: "Pending Review", className: "bg-yellow-600 text-white" },
      rejected: { icon: AlertCircle, text: "Rejected", className: "bg-red-600 text-white" },
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

        {/* Statistics Section */}
        {applications.length > 0 && (
          <div className="grid gap-4 md:grid-cols-5 mb-8">
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-1">Processing</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-1">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-1">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </CardContent>
            </Card>
          </div>
        )}

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
                    {app.paymentStatus && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Payment Status:</span>
                        <span className={`text-sm font-semibold ${
                          app.paymentStatus === 'completed' 
                            ? 'text-green-600' 
                            : 'text-yellow-600'
                        }`}>
                          {app.paymentStatus === 'completed' ? '✓ Paid' : '⏳ Pending'}
                        </span>
                      </div>
                    )}
                    {app.transactionId && (
                      <p className="text-sm text-muted-foreground">
                        Transaction ID: <span className="font-mono font-medium text-foreground">{app.transactionId}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    {getStatusBadge(app.status)}
                  </div>
                </div>

                <div className="space-y-2">
                  {app.steps.map((step: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        step.completed 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-200 text-gray-500'
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
                  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="text-sm font-medium text-green-800">
                      Your document is ready for pickup at the Municipal Office during office hours (8:00 AM - 5:00 PM, Monday to Friday)
                    </p>
                  </div>
                )}

                {app.status === 'rejected' && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-800">
                      Your application was rejected. Please contact the office for more information.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {applications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Plus className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">No applications yet</p>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Start by submitting an application for a service from your dashboard
                </p>
                <Link to="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
          ) : filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">No applications found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search terms
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Tracking;
