import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/authContext";
import { useNavigate } from "react-router-dom";
import { CanConnectLogo } from "@/components/CanConnectLogo";
import {
  MoreVertical,
  LogOut,
  FileText,
  CheckCircle,
  BarChart3,
  Download,
  Eye,
  Printer,
  AlertTriangle,
  Zap,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Clock,
  Users,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Department = "civil-registry" | "treasury" | "health-sanitation" | "admin";

interface DepartmentConfig {
  name: string;
  description: string;
  icon: string;
  services: string[];
  stats: {
    pending: number;
    processing: number;
    completed: number;
    rejected: number;
  };
}

interface ValidationIssue {
  type: "incomplete" | "incorrect" | "duplicate";
  severity: "high" | "medium" | "low";
  message: string;
}

interface ValidatedDocument {
  id: number;
  name: string;
  status: string;
  uploadDate: string;
  validationStatus: "passed" | "flagged";
  issues: ValidationIssue[];
}

interface PeakHourData {
  hour: string;
  requests: number;
  peakLevel: "low" | "medium" | "high";
}

interface ManpowerRecommendation {
  time: string;
  currentStaff: number;
  recommendedStaff: number;
  utilizationRate: number;
}

interface ProcessingForecast {
  serviceType: string;
  avgProcessingTime: string;
  predictedTime: string;
  confidence: number;
  trend: "improving" | "stable" | "declining";
}

const DEPARTMENTS: Record<Department, DepartmentConfig> = {
  "civil-registry": {
    name: "Civil Registry Office",
    description: "Manage civil registry documents and certificates",
    icon: "📋",
    services: ["Birth Certificate", "Marriage Certificate", "Death Certificate", "CENOMAR"],
    stats: {
      pending: 8,
      processing: 5,
      completed: 24,
      rejected: 1,
    },
  },
  treasury: {
    name: "Treasury Office",
    description: "Process payments and financial transactions",
    icon: "💰",
    services: ["Business Permit Payments", "License Renewals", "Tax Payments", "Fees Collection"],
    stats: {
      pending: 3,
      processing: 2,
      completed: 45,
      rejected: 0,
    },
  },
  "health-sanitation": {
    name: "Health & Sanitation Office",
    description: "Manage health and sanitation clearances",
    icon: "🏥",
    services: ["Health Clearance", "Sanitation Clearance", "Workplace Health Inspection", "Food Safety Certification"],
    stats: {
      pending: 5,
      processing: 3,
      completed: 18,
      rejected: 2,
    },
  },
  admin: {
    name: "Administration Office",
    description: "General administrative services",
    icon: "🏛️",
    services: ["Barangay Clearance", "Police Clearance", "ID Services", "General Inquiries"],
    stats: {
      pending: 6,
      processing: 4,
      completed: 32,
      rejected: 1,
    },
  },
};

const mockValidatedDocuments: ValidatedDocument[] = [
  {
    id: 1,
    name: "Juan dela Cruz - Birth Certificate",
    status: "pending",
    uploadDate: "2025-12-10",
    validationStatus: "flagged",
    issues: [
      { type: "incomplete", severity: "high", message: "Missing father's name field" },
      { type: "incorrect", severity: "medium", message: "Birth date format is invalid (expected MM/DD/YYYY)" },
    ],
  },
  {
    id: 2,
    name: "Maria Santos - Marriage Certificate",
    status: "reviewed",
    uploadDate: "2025-12-09",
    validationStatus: "passed",
    issues: [],
  },
  {
    id: 3,
    name: "Pedro Reyes - Death Certificate",
    status: "processing",
    uploadDate: "2025-12-08",
    validationStatus: "flagged",
    issues: [
      { type: "duplicate", severity: "high", message: "Possible duplicate: Similar record found (Pedro Reyes, DOB: 1950-03-15)" },
    ],
  },
  {
    id: 4,
    name: "Ana Gonzales - Birth Certificate",
    status: "pending",
    uploadDate: "2025-12-07",
    validationStatus: "flagged",
    issues: [
      { type: "incomplete", severity: "high", message: "Missing mother's maiden name" },
      { type: "incomplete", severity: "medium", message: "Birthplace municipality not specified" },
    ],
  },
  {
    id: 5,
    name: "Carlos Lopez - Birth Certificate",
    status: "pending",
    uploadDate: "2025-12-06",
    validationStatus: "passed",
    issues: [],
  },
];

const mockPeakHours: PeakHourData[] = [
  { hour: "8:00 AM", requests: 5, peakLevel: "low" },
  { hour: "9:00 AM", requests: 12, peakLevel: "high" },
  { hour: "10:00 AM", requests: 18, peakLevel: "high" },
  { hour: "11:00 AM", requests: 14, peakLevel: "high" },
  { hour: "12:00 PM", requests: 8, peakLevel: "medium" },
  { hour: "1:00 PM", requests: 6, peakLevel: "low" },
  { hour: "2:00 PM", requests: 10, peakLevel: "medium" },
  { hour: "3:00 PM", requests: 15, peakLevel: "high" },
  { hour: "4:00 PM", requests: 11, peakLevel: "medium" },
];

const mockManpowerRecommendations: ManpowerRecommendation[] = [
  { time: "8:00 AM - 12:00 PM", currentStaff: 2, recommendedStaff: 3, utilizationRate: 92 },
  { time: "12:00 PM - 4:00 PM", currentStaff: 2, recommendedStaff: 2, utilizationRate: 71 },
  { time: "4:00 PM - 5:00 PM", currentStaff: 1, recommendedStaff: 2, utilizationRate: 88 },
];

const mockProcessingForecasts: ProcessingForecast[] = [
  {
    serviceType: "Birth Certificate",
    avgProcessingTime: "2.5 days",
    predictedTime: "2.2 days",
    confidence: 94,
    trend: "improving",
  },
  {
    serviceType: "Marriage Certificate",
    avgProcessingTime: "3 days",
    predictedTime: "2.8 days",
    confidence: 89,
    trend: "improving",
  },
  {
    serviceType: "Death Certificate",
    avgProcessingTime: "2 days",
    predictedTime: "2.1 days",
    confidence: 91,
    trend: "stable",
  },
  {
    serviceType: "CENOMAR",
    avgProcessingTime: "4 days",
    predictedTime: "3.5 days",
    confidence: 85,
    trend: "improving",
  },
];

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState<Department>("civil-registry");
  const [selectedValidationDoc, setSelectedValidationDoc] = useState<ValidatedDocument | null>(null);

  const currentDept = DEPARTMENTS[selectedDepartment];

  const pendingRequests = [
    {
      id: 1,
      service: currentDept.services[0],
      requestor: "Juan dela Cruz",
      status: "pending" as const,
      date: "2025-12-10",
    },
    {
      id: 2,
      service: currentDept.services[1],
      requestor: "Maria Santos",
      status: "pending" as const,
      date: "2025-12-09",
    },
    {
      id: 3,
      service: currentDept.services[0],
      requestor: "Pedro Reyes",
      status: "processing" as const,
      date: "2025-12-08",
    },
  ];

  const mockDocuments = mockValidatedDocuments;

  const mockReports = [
    { period: "December 2025", pending: 8, processing: 5, completed: 24, rejected: 1, avgTime: "3 days" },
    { period: "November 2025", pending: 2, processing: 0, completed: 31, rejected: 2, avgTime: "3.5 days" },
    { period: "October 2025", pending: 1, processing: 0, completed: 28, rejected: 1, avgTime: "3.2 days" },
  ];

  const validationStats = {
    total: mockDocuments.length,
    passed: mockDocuments.filter(d => d.validationStatus === "passed").length,
    flagged: mockDocuments.filter(d => d.validationStatus === "flagged").length,
    issues: mockDocuments.reduce((acc, d) => acc + d.issues.length, 0),
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getSeverityColor = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-blue-600";
    }
  };

  const getSeverityBg = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high": return "bg-red-50";
      case "medium": return "bg-yellow-50";
      case "low": return "bg-blue-50";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <CanConnectLogo size="md" />
            <span className="text-xl font-bold text-primary">CanConnect</span>
            <span className="ml-4 text-sm text-muted-foreground">| LGU Staff Portal</span>
          </Link>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-primary/10">
              STAFF
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Department Selector */}
        <div className="mb-8 flex items-center gap-4">
          <Label htmlFor="department-select" className="text-base font-semibold">
            Select Office:
          </Label>
          <Select value={selectedDepartment} onValueChange={(val) => setSelectedDepartment(val as Department)}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="civil-registry">Civil Registry Office</SelectItem>
              <SelectItem value="treasury">Treasury Office</SelectItem>
              <SelectItem value="health-sanitation">Health & Sanitation Office</SelectItem>
              <SelectItem value="admin">Administration Office</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Department Header */}
        <div className="mb-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{currentDept.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{currentDept.name}</h1>
              <p className="text-muted-foreground">{currentDept.description}</p>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-lg text-muted-foreground">Welcome back, {user?.first_name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentDept.stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentDept.stats.processing}</div>
              <p className="text-xs text-muted-foreground mt-1">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentDept.stats.completed}</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentDept.stats.rejected}</div>
              <p className="text-xs text-muted-foreground mt-1">Needs revision</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Document Validation Stats */}
        <div className="mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <CardTitle>AI Document Validation System</CardTitle>
              </div>
              <CardDescription>Intelligent document analysis and verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-sm text-muted-foreground">Total Scanned</p>
                  <p className="text-2xl font-bold text-blue-600">{validationStats.total}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-sm text-muted-foreground">Passed Validation</p>
                  <p className="text-2xl font-bold text-green-600">{validationStats.passed}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-sm text-muted-foreground">Flagged Issues</p>
                  <p className="text-2xl font-bold text-orange-600">{validationStats.flagged}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-sm text-muted-foreground">Total Issues</p>
                  <p className="text-2xl font-bold text-red-600">{validationStats.issues}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Predictive Analytics & Resource Planning */}
        <div className="mb-8">
          <Card className="border-emerald-200 bg-emerald-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <CardTitle>Predictive Analytics & Resource Planning</CardTitle>
              </div>
              <CardDescription>AI-powered forecasting and resource optimization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Peak Request Hours */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-semibold">Peak Request Hours</h3>
                </div>
                <div className="space-y-2">
                  {mockPeakHours.map((hour) => (
                    <div key={hour.hour} className="flex items-center justify-between p-2 bg-white rounded border">
                      <span className="text-sm font-medium">{hour.hour}</span>
                      <div className="flex items-center gap-3 flex-1 ml-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              hour.peakLevel === "high"
                                ? "bg-red-500"
                                : hour.peakLevel === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                            style={{ width: `${(hour.requests / 20) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-12">{hour.requests}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          hour.peakLevel === "high"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : hour.peakLevel === "medium"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-green-50 text-green-700 border-green-200"
                        }
                      >
                        {hour.peakLevel.charAt(0).toUpperCase() + hour.peakLevel.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Processing Time Forecasts */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-semibold">Processing Time Forecasts</h3>
                </div>
                <div className="space-y-3">
                  {mockProcessingForecasts.map((forecast) => (
                    <div key={forecast.serviceType} className="p-3 bg-white rounded border">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{forecast.serviceType}</p>
                          <p className="text-xs text-muted-foreground">
                            Average: {forecast.avgProcessingTime} → Predicted: {forecast.predictedTime}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              forecast.trend === "improving"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : forecast.trend === "stable"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-orange-50 text-orange-700 border-orange-200"
                            }
                          >
                            {forecast.trend === "improving" && "📈"}
                            {forecast.trend === "stable" && "➡️"}
                            {forecast.trend === "declining" && "📉"}
                            {" " + forecast.trend.charAt(0).toUpperCase() + forecast.trend.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={forecast.confidence} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Confidence: {forecast.confidence}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manpower Recommendations */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-semibold">Manpower Allocation Recommendations</h3>
                </div>
                <div className="space-y-3">
                  {mockManpowerRecommendations.map((rec) => (
                    <div key={rec.time} className="p-3 bg-white rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{rec.time}</p>
                        <span className="text-sm font-bold text-emerald-600">
                          {rec.currentStaff} → {rec.recommendedStaff} staff
                        </span>
                      </div>
                      <Progress value={rec.utilizationRate} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Utilization Rate: {rec.utilizationRate}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Handled */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Services Handled by {currentDept.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2">
                {currentDept.services.map((service, idx) => (
                  <Badge key={idx} variant="secondary" className="justify-start py-2 px-3">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests Section */}
        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Pending Service Requests</CardTitle>
              <CardDescription>
                Requests waiting for your action in {currentDept.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Requestor Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Submitted</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.service}</TableCell>
                        <TableCell>{request.requestor}</TableCell>
                        <TableCell>
                          <Badge
                            variant={request.status === "pending" ? "secondary" : "default"}
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{request.date}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* View Documents with AI Validation */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Verify Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check and verify with AI validation
                  </p>
                  <Button className="w-full">View Documents</Button>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-96 overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Verify Documents (AI Validated)</DialogTitle>
                <DialogDescription>
                  AI-assisted document review with automated validation
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {mockDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      doc.validationStatus === "flagged"
                        ? "border-orange-200 bg-orange-50"
                        : "border-green-200 bg-green-50"
                    }`}
                    onClick={() => setSelectedValidationDoc(doc)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded: {doc.uploadDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            doc.validationStatus === "flagged" ? "destructive" : "default"
                          }
                        >
                          {doc.validationStatus === "flagged" ? (
                            <>
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Flagged
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Passed
                            </>
                          )}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Issues Section */}
                    {doc.issues.length > 0 && (
                      <div className="mt-3 space-y-2 border-t pt-3">
                        <p className="text-xs font-semibold text-red-700">
                          {doc.issues.length} Issue{doc.issues.length !== 1 ? "s" : ""} Detected:
                        </p>
                        {doc.issues.map((issue, idx) => (
                          <Alert key={idx} className={`${getSeverityBg(issue.severity)} border-0`}>
                            <div className="flex gap-2">
                              <AlertCircle className={`h-4 w-4 mt-0.5 ${getSeverityColor(issue.severity)}`} />
                              <div className="flex-1">
                                <p className={`text-xs font-semibold ${getSeverityColor(issue.severity)}`}>
                                  {issue.type.charAt(0).toUpperCase() + issue.type.slice(1)} - {issue.severity.toUpperCase()}
                                </p>
                                <AlertDescription className="text-xs text-gray-700">
                                  {issue.message}
                                </AlertDescription>
                              </div>
                            </div>
                          </Alert>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Issue Documents */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Issue Certificate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate and issue official certificates
                  </p>
                  <Button className="w-full">Issue Document</Button>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Issue Certificate</DialogTitle>
                <DialogDescription>
                  Generate and issue official documents from {currentDept.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipient">Recipient Name</Label>
                  <Input id="recipient" placeholder="Enter recipient name" />
                </div>
                <div>
                  <Label htmlFor="doc-type">Document Type</Label>
                  <Select>
                    <SelectTrigger id="doc-type">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentDept.services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="issue-date">Issue Date</Label>
                  <Input id="issue-date" type="date" defaultValue="2025-12-10" />
                </div>
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional notes..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline" className="flex-1">
                      Close
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* View Reports */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    View Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check processing statistics and reports
                  </p>
                  <Button className="w-full">View Reports</Button>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Department Reports</DialogTitle>
                <DialogDescription>
                  Processing statistics for {currentDept.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {mockReports.map((report) => (
                  <Card key={report.period} className="p-4">
                    <h3 className="font-semibold mb-3">{report.period}</h3>
                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Pending</p>
                        <p className="text-lg font-bold text-yellow-600">{report.pending}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Processing</p>
                        <p className="text-lg font-bold text-blue-600">{report.processing}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Completed</p>
                        <p className="text-lg font-bold text-green-600">{report.completed}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rejected</p>
                        <p className="text-lg font-bold text-red-600">{report.rejected}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground border-t pt-2">
                      Avg. Processing Time: <span className="font-semibold">{report.avgTime}</span>
                    </p>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}