import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  LineChart as LineChartIcon,
  Users,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  Settings,
  MoreVertical,
  Eye,
  Download,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CanConnectLogo } from "@/components/CanConnectLogo";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "requests" | "payments" | "reports" | "users">("overview");
  const [userRole, setUserRole] = useState<"admin" | "staff" | "treasury">("admin");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);

  // Mock data for service requests
  const [requests, setRequests] = useState([
    {
      id: "REQ-001",
      citizenName: "Arturo Corvera",
      service: "Barangay Clearance",
      dateSubmitted: "2024-11-15",
      status: "pending",
      amount: 50,
      paymentMethod: "cash",
    },
    {
      id: "REQ-002",
      citizenName: "Joey Mondragon roar",
      service: "Business Permit",
      dateSubmitted: "2024-11-14",
      status: "in-progress",
      amount: 500,
      paymentMethod: "online",
    },
    {
      id: "REQ-003",
      citizenName: "Christian Catindin pogi",
      service: "Police Clearance",
      dateSubmitted: "2024-11-13",
      status: "for-payment",
      amount: 100,
      paymentMethod: "cash",
    },
    {
      id: "REQ-004",
      citizenName: "Pedro Penduko",
      service: "Birth Certificate",
      dateSubmitted: "2024-11-12",
      status: "completed",
      amount: 75,
      paymentMethod: "online",
    },
  ]);

  // Mock staff users
  const [staffUsers, setStaffUsers] = useState([
    { id: 1, name: "Manny Pacquiao", username: "mpacquiao", role: "admin", department: "Administration", status: "active" },
    { id: 2, name: "Bongbong Marcos", username: "bbmarcos", role: "staff", department: "Civil Registry", status: "active" },
    { id: 3, name: "Leni Robredo", username: "lrobredo", role: "treasury", department: "Treasury", status: "active" },
  ]);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const handleUpdateStatus = (requestId: string, newStatus: string) => {
    setRequests(
      requests.map((req) => (req.id === requestId ? { ...req, status: newStatus } : req))
    );
    toast.success(`Request ${requestId} updated to ${newStatus}`);
    setSelectedRequest(null);
  };

  const handleVerifyPayment = (requestId: string) => {
    handleUpdateStatus(requestId, "completed");
    toast.success(`Payment verified for ${requestId}. Receipt: RCP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  };

  const filteredRequests = requests.filter((req) => {
    const statusMatch = filterStatus === "all" || req.status === filterStatus;
    const serviceMatch = filterService === "all" || req.service === filterService;
    return statusMatch && serviceMatch;
  });

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      "in-progress": "bg-blue-100 text-blue-800",
      "for-payment": "bg-orange-100 text-orange-800",
      completed: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: JSX.Element } = {
      pending: <Clock className="h-4 w-4" />,
      "in-progress": <TrendingUp className="h-4 w-4" />,
      "for-payment": <DollarSign className="h-4 w-4" />,
      completed: <CheckCircle className="h-4 w-4" />,
      rejected: <AlertCircle className="h-4 w-4" />,
    };
    return icons[status] || null;
  };

  const metrics = {
    pendingRequests: requests.filter((r) => r.status === "pending").length,
    processedToday: requests.filter((r) => r.status === "completed").length,
    totalRevenue: requests.filter((r) => r.status === "completed").reduce((sum, r) => sum + r.amount, 0),
    avgProcessingTime: "2.5 days",
  };

  // Chart data for Requests by Service Type
  const serviceTypeData = [
    { name: "Barangay Clearance", value: 12, fill: "#0066A1" },
    { name: "Business Permit", value: 8, fill: "#00A9CE" },
    { name: "Police Clearance", value: 15, fill: "#0088CC" },
    { name: "Birth Certificate", value: 10, fill: "#1E90FF" },
    { name: "Residency Cert", value: 7, fill: "#4169E1" },
  ];

  // Chart data for Daily Request Trends (Last 30 Days)
  const trendData = [
    { date: "Nov 1", requests: 12 },
    { date: "Nov 2", requests: 15 },
    { date: "Nov 3", requests: 10 },
    { date: "Nov 4", requests: 18 },
    { date: "Nov 5", requests: 14 },
    { date: "Nov 6", requests: 20 },
    { date: "Nov 7", requests: 22 },
    { date: "Nov 8", requests: 19 },
    { date: "Nov 9", requests: 25 },
    { date: "Nov 10", requests: 21 },
    { date: "Nov 11", requests: 28 },
    { date: "Nov 12", requests: 24 },
    { date: "Nov 13", requests: 30 },
    { date: "Nov 14", requests: 26 },
    { date: "Nov 15", requests: 32 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <CanConnectLogo size="md" />
            <span className="text-xl font-bold text-primary">CanConnect</span>
            <span className="ml-4 text-sm text-muted-foreground">| LGU Staff Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-primary/10">
              {userRole.toUpperCase()}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Change Password</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r bg-card p-6">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                activeTab === "overview" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <BarChart3 className="inline-block mr-2 h-4 w-4" />
              Dashboard Overview
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                activeTab === "requests" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <FileText className="inline-block mr-2 h-4 w-4" />
              Manage Requests
            </button>
            {(userRole === "treasury" || userRole === "admin") && (
              <button
                onClick={() => setActiveTab("payments")}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  activeTab === "payments" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <DollarSign className="inline-block mr-2 h-4 w-4" />
                Manage Payments
              </button>
            )}
            <button
              onClick={() => setActiveTab("reports")}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                activeTab === "reports" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <LineChartIcon className="inline-block mr-2 h-4 w-4" />
              Reports & Analytics
            </button>
            {userRole === "admin" && (
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  activeTab === "users" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <Users className="inline-block mr-2 h-4 w-4" />
                User Management
              </button>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Dashboard Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <h1 className="mb-8 text-3xl font-bold">Dashboard Overview</h1>

              {/* Metrics Cards */}
              <div className="mb-8 grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.pendingRequests}</div>
                    <p className="text-xs text-muted-foreground">Awaiting action</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Processed Today</CardTitle>
                    <CheckCircle className="h-4 w-4 text-success" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.processedToday}</div>
                    <p className="text-xs text-muted-foreground">Completed today</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₱{metrics.totalRevenue}</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.avgProcessingTime}</div>
                    <p className="text-xs text-muted-foreground">Average</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Placeholder */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Requests by Service Type (Last 7 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={serviceTypeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "rgba(255,255,255,0.95)", border: "1px solid #ccc" }}
                        />
                        <Legend />
                        <Bar dataKey="value" fill="#0066A1" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Daily Request Trends (Last 30 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} interval={Math.floor(trendData.length / 7)} />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "rgba(255,255,255,0.95)", border: "1px solid #ccc" }}
                          formatter={(value) => [`${value} requests`, "Total"]}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="requests" 
                          stroke="#0066A1" 
                          dot={{ fill: "#0066A1", r: 5 }}
                          activeDot={{ r: 7 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Manage Requests Tab */}
          {activeTab === "requests" && (
            <div>
              <h1 className="mb-8 text-3xl font-bold">Manage Service Requests</h1>

              {/* Filters */}
              <div className="mb-6 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">Filter by Service Type</label>
                  <Select value={filterService} onValueChange={setFilterService}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="Barangay Clearance">Barangay Clearance</SelectItem>
                      <SelectItem value="Business Permit">Business Permit</SelectItem>
                      <SelectItem value="Police Clearance">Police Clearance</SelectItem>
                      <SelectItem value="Birth Certificate">Birth Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Filter by Status</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="for-payment">For Payment</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Requests Table */}
              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Request ID</th>
                          <th className="text-left py-3 px-4 font-semibold">Citizen Name</th>
                          <th className="text-left py-3 px-4 font-semibold">Service Type</th>
                          <th className="text-left py-3 px-4 font-semibold">Date Submitted</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                          <th className="text-left py-3 px-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRequests.map((req) => (
                          <tr key={req.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium">{req.id}</td>
                            <td className="py-3 px-4">{req.citizenName}</td>
                            <td className="py-3 px-4">{req.service}</td>
                            <td className="py-3 px-4">{req.dateSubmitted}</td>
                            <td className="py-3 px-4">
                              <Badge className={getStatusColor(req.status)}>
                                {getStatusIcon(req.status)}
                                <span className="ml-1">{req.status}</span>
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedRequest(selectedRequest === parseInt(req.id.split("-")[1]) ? null : parseInt(req.id.split("-")[1]))}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Request Details */}
              {selectedRequest && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Request Details & Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {filteredRequests.map((req) => {
                      if (parseInt(req.id.split("-")[1]) !== selectedRequest) return null;
                      return (
                        <div key={req.id}>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="text-sm font-medium">Request ID</label>
                              <p className="text-muted-foreground">{req.id}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Citizen Name</label>
                              <p className="text-muted-foreground">{req.citizenName}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Service Type</label>
                              <p className="text-muted-foreground">{req.service}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Amount</label>
                              <p className="text-muted-foreground">₱{req.amount}</p>
                            </div>
                          </div>

                          <div className="mt-6 space-y-4">
                            <div>
                              <label className="mb-2 block text-sm font-medium">Update Status</label>
                              <Select defaultValue={req.status} onValueChange={(val) => handleUpdateStatus(req.id, val)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="for-payment">For Payment</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Manage Payments Tab */}
          {(activeTab === "payments" && (userRole === "treasury" || userRole === "admin")) && (
            <div>
              <h1 className="mb-8 text-3xl font-bold">Manage Payments</h1>

              <Card>
                <CardHeader>
                  <CardTitle>Cash Payments - Pending Verification</CardTitle>
                  <CardDescription>Verify cash payments and update request status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Request ID</th>
                          <th className="text-left py-3 px-4 font-semibold">Citizen Name</th>
                          <th className="text-left py-3 px-4 font-semibold">Service</th>
                          <th className="text-left py-3 px-4 font-semibold">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests
                          .filter((r) => r.status === "for-payment" && r.paymentMethod === "cash")
                          .map((req) => (
                            <tr key={req.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">{req.id}</td>
                              <td className="py-3 px-4">{req.citizenName}</td>
                              <td className="py-3 px-4">{req.service}</td>
                              <td className="py-3 px-4">₱{req.amount}</td>
                              <td className="py-3 px-4">
                                <Button
                                  size="sm"
                                  onClick={() => handleVerifyPayment(req.id)}
                                >
                                  Verify Payment
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Reports & Analytics Tab */}
          {activeTab === "reports" && (
            <div>
              <h1 className="mb-8 text-3xl font-bold">Reports & Analytics</h1>

              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Report Type</label>
                  <Select defaultValue="summary">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Service Request Summary</SelectItem>
                      <SelectItem value="revenue">Revenue Report</SelectItem>
                      <SelectItem value="barangay">Requests by Barangay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Service Request Summary</CardTitle>
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Service Type</th>
                          <th className="text-left py-3 px-4 font-semibold">Total Requests</th>
                          <th className="text-left py-3 px-4 font-semibold">Completed</th>
                          <th className="text-left py-3 px-4 font-semibold">Pending</th>
                          <th className="text-left py-3 px-4 font-semibold">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { service: "Barangay Clearance", total: 12, completed: 10, pending: 2, revenue: 500 },
                          { service: "Business Permit", total: 8, completed: 6, pending: 2, revenue: 3000 },
                          { service: "Police Clearance", total: 15, completed: 12, pending: 3, revenue: 1200 },
                        ].map((row, idx) => (
                          <tr key={idx} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium">{row.service}</td>
                            <td className="py-3 px-4">{row.total}</td>
                            <td className="py-3 px-4">{row.completed}</td>
                            <td className="py-3 px-4">{row.pending}</td>
                            <td className="py-3 px-4">₱{row.revenue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === "users" && userRole === "admin" && (
            <div>
              <h1 className="mb-8 text-3xl font-bold">Manage LGU Staff Accounts</h1>

              {/* Add New User Form */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Add New Staff Member</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="rounded-lg border bg-background px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Username"
                      className="rounded-lg border bg-background px-3 py-2 text-sm"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="rounded-lg border bg-background px-3 py-2 text-sm"
                    />
                    <Select defaultValue="staff">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="treasury">Treasury</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <input
                      type="text"
                      placeholder="Department"
                      className="rounded-lg border bg-background px-3 py-2 text-sm"
                    />
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Staff Users List */}
              <Card>
                <CardHeader>
                  <CardTitle>Existing Staff Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Name</th>
                          <th className="text-left py-3 px-4 font-semibold">Username</th>
                          <th className="text-left py-3 px-4 font-semibold">Role</th>
                          <th className="text-left py-3 px-4 font-semibold">Department</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                          <th className="text-left py-3 px-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffUsers.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium">{user.name}</td>
                            <td className="py-3 px-4">{user.username}</td>
                            <td className="py-3 px-4">
                              <Badge variant="outline">{user.role}</Badge>
                            </td>
                            <td className="py-3 px-4">{user.department}</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-green-100 text-green-800">{user.status}</Badge>
                            </td>
                            <td className="py-3 px-4 flex gap-2">
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
