import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, Bell, Smartphone, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { CanConnectLogo } from "@/components/CanConnectLogo";

const Landing = () => {
  const services = [
    {
      title: "Barangay Clearance",
      description: "Apply for barangay clearance online",
      icon: FileText,
    },
    {
      title: "Business Permit",
      description: "Register and renew business permits",
      icon: FileText,
    },
    {
      title: "Police Clearance",
      description: "Request police clearance certificates",
      icon: FileText,
    },
  ];

  const features = [
    {
      title: "Real-Time Tracking",
      description: "Monitor your application status in real-time",
      icon: Clock,
    },
    {
      title: "Instant Notifications",
      description: "Get updates via SMS and email",
      icon: Bell,
    },
    {
      title: "Mobile Accessible",
      description: "Access services anywhere, anytime",
      icon: Smartphone,
    },
    {
      title: "Secure & Reliable",
      description: "Your data is protected and encrypted",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <CanConnectLogo size="md" />
            <span className="text-xl font-bold text-primary">CanConnect</span>
          </div>
          <nav className="flex gap-4">
            <Link to="/auth">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          Welcome to <span className="text-primary">CanConnect</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Municipality of Cantilan's Unified Digital Government Service Platform. 
          Access government services from anywhere, anytime.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/auth">
            <Button size="lg" className="gap-2">
              <FileText className="h-5 w-5" />
              Apply for Services
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" variant="outline" className="gap-2">
              <Clock className="h-5 w-5" />
              Track Application
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Available Services</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service, index) => (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <service.icon className="mb-4 h-12 w-12 text-primary" />
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/auth">
                    <Button className="w-full">Apply Now</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">Why Choose CanConnect?</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
            Join thousands of Cantilan residents already using CanConnect for faster, more convenient government services.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Municipality of Cantilan. All rights reserved.</p>
          <p className="mt-2">CanConnect - Unified Digital Government Service System</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
