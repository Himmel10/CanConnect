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
  FileText, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Menu,
  User,
  LogOut,
  Bell,
  Settings,
  X,
  Check,
  Trash2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import AIChat from "@/components/AIChat";

const Dashboard = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "approved",
      title: "Application Approved",
      message: "Your Business Permit application has been approved",
      timestamp: "2 hours ago",
      read: false,
      icon: CheckCircle,
    },
    {
      id: 2,
      type: "processing",
      title: "Application Processing",
      message: "Your Barangay Clearance is currently being processed",
      timestamp: "5 hours ago",
      read: false,
      icon: Clock,
    },
    {
      id: 3,
      type: "reminder",
      title: "Action Required",
      message: "Please submit additional documents for your Police Clearance",
      timestamp: "1 day ago",
      read: true,
      icon: AlertCircle,
    },
    {
      id: 4,
      type: "completed",
      title: "Service Completed",
      message: "Your Birth Certificate request is ready for pickup",
      timestamp: "2 days ago",
      read: true,
      icon: CheckCircle,
    },
  ]);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    toast.success("Notification deleted");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch(type) {
      case "approved":
        return "bg-green-50 border-l-4 border-green-500";
      case "processing":
        return "bg-blue-50 border-l-4 border-blue-500";
      case "reminder":
        return "bg-yellow-50 border-l-4 border-yellow-500";
      case "completed":
        return "bg-emerald-50 border-l-4 border-emerald-500";
      default:
        return "bg-gray-50 border-l-4 border-gray-500";
    }
  };

  const services = [
    {
      category: "Civil Registry",
      items: [
        { title: "Birth Certificate", description: "Request local birth certificate", icon: FileText, link: "/services/birth-certificate" },
        { title: "Marriage Certificate", description: "Request local marriage certificate", icon: FileText, link: "/services/marriage-certificate" },
        { title: "Death Certificate", description: "Request death certificate", icon: FileText, link: "/services/death-certificate" },
        { title: "CENOMAR", description: "Certificate of No Marriage", icon: FileText, link: "/services/cenomar" },
      ]
    },
    {
      category: "Residency Documents",
      items: [
        { title: "Barangay Clearance", description: "Apply for barangay clearance", icon: FileText, link: "/services/barangay-clearance" },
        { title: "Certificate of Residency", description: "Proof of residence", icon: FileText, link: "/services/certificate-of-residency" },
        { title: "Certificate of Indigency", description: "For financial assistance", icon: FileText, link: "/services/certificate-of-indigency" },
      ]
    },
    {
      category: "Business & Permits",
      items: [
        { title: "Business Permit", description: "Register or renew business", icon: Shield, link: "/services/business-permit" },
        { title: "Building Permit", description: "Construction permit application", icon: Shield, link: "/services/building-permit" },
        { title: "Occupancy Permit", description: "Certificate of Occupancy", icon: Shield, link: "/services/occupancy-permit" },
        { title: "Fencing Permit", description: "Fencing work permit", icon: Shield, link: "/services/fencing-permit" },
        { title: "Demolition Permit", description: "Building demolition permit", icon: Shield, link: "/services/demolition-permit" },
        { title: "Tricycle Franchise", description: "Tricycle franchise permit", icon: Shield, link: "/services/tricycle-franchise" },
        { title: "Community Tax Certificate", description: "Cedula application", icon: Shield, link: "/services/community-tax-certificate" },
      ]
    },
    {
      category: "Special IDs",
      items: [
        { title: "Senior Citizen ID", description: "For seniors 60+", icon: Shield, link: "/services/senior-citizen-id" },
        { title: "PWD ID", description: "Person with Disability ID", icon: Shield, link: "/services/pwd-id" },
        { title: "Solo Parent ID", description: "Solo Parent Identification Card", icon: Shield, link: "/services/solo-parent-id" },
        { title: "Police Clearance", description: "Police clearance certificate", icon: Shield, link: "/services/police-clearance" },
      ]
    },
    {
      category: "Assistance Programs",
      items: [
        { title: "Medical/Burial Assistance", description: "Medical or burial assistance benefits", icon: FileText, link: "/services/medical-burial-assistance" },
        { title: "4Ps Program", description: "Pantawid Pamilyong Pilipino Program", icon: FileText, link: "/services/4ps-program" },
        { title: "Financial Assistance", description: "Emergency financial assistance", icon: FileText, link: "/services/financial-assistance" },
      ]
    },
    {
      category: "Health, Agriculture & Sanitation",
      items: [
        { title: "Health & Sanitation Clearance", description: "Clearance for establishments", icon: Shield, link: "/services/health-sanitation-clearance" },
        { title: "Veterinary Certificate", description: "Certificate from Municipal Agriculture Office", icon: Shield, link: "/services/veterinary-certificate" },
      ]
    }
  ];

  const recentApplications = [
    {
      id: "BRG-2024-001",
      type: "Barangay Clearance",
      status: "processing",
      date: "2024-11-15",
    },
    {
      id: "BIZ-2024-045",
      type: "Business Permit",
      status: "approved",
      date: "2024-11-10",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      processing: { variant: "default" as const, icon: Clock, text: "Processing", className: "" },
      approved: { variant: "default" as const, icon: CheckCircle, text: "Approved", className: "bg-success text-success-foreground" },
      pending: { variant: "default" as const, icon: AlertCircle, text: "Pending", className: "bg-warning text-warning-foreground" },
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">CanConnect</span>
          </Link>
          <nav className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto py-1 px-2 text-xs"
                      onClick={markAllAsRead}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Mark all as read
                    </Button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const IconComponent = notif.icon;
                      return (
                        <div
                          key={notif.id}
                          className={`px-3 py-3 border-b last:border-b-0 cursor-pointer transition-colors hover:bg-muted/50 ${getNotificationColor(notif.type)} ${!notif.read ? "font-semibold" : ""}`}
                          onClick={() => markAsRead(notif.id)}
                        >
                          <div className="flex items-start gap-3">
                            <IconComponent className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{notif.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                              <p className="text-xs text-muted-foreground mt-1.5">{notif.timestamp}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-1 flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notif.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="px-4 py-3 border-t text-center">
                  <Button variant="link" size="sm">
                    View all notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-semibold">
                  Juan Dela Cruz
                </div>
                <div className="px-2 text-xs text-muted-foreground">
                  juan.delacruz@email.com
                </div>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Welcome back, Juan!</h1>
          <p className="text-muted-foreground">
            Access your government services and track your applications
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Successfully processed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Services Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Available Services</h2>
          {services.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8">
              <h3 className="mb-3 text-lg font-semibold text-muted-foreground">{category.category}</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {category.items.map((service, serviceIndex) => (
                  <Card key={serviceIndex} className="transition-shadow hover:shadow-lg">
                    <CardHeader>
                      <service.icon className="mb-4 h-12 w-12 text-primary" />
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to={service.link}>
                        <Button className="w-full">Apply Now</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Applications */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Applications</h2>
            <Link to="/tracking">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <p className="font-semibold">{app.type}</p>
                      <p className="text-sm text-muted-foreground">ID: {app.id}</p>
                      <p className="text-xs text-muted-foreground">Applied: {app.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(app.status)}
                      <Link to={`/tracking/${app.id}`}>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <AIChat />
    </div>
  );
};

export default Dashboard;
