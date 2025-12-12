import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Send,
  ArrowRight,
  Wallet,
  Banknote,
  TrendingUp,
  BarChart3,
  Eye,
  RefreshCw,
  Lock,
  Shield,
} from "lucide-react";
import { CanConnectLogo } from "@/components/CanConnectLogo";
import { Link } from "react-router-dom";

type PaymentMethod = "e-wallet" | "cash" | null;
type PaymentStatus = "pending" | "processing" | "completed" | "failed";
type TransactionType = "service-fee" | "permit" | "certificate" | "other";

interface PaymentTransaction {
  id: string;
  transactionId: string;
  service: string;
  amount: number;
  method: "e-wallet" | "cash";
  status: PaymentStatus;
  date: string;
  time: string;
  reference: string;
  description: string;
}

interface EWalletAccount {
  balance: number;
  lastTopup: string;
  totalSpent: number;
  transactionCount: number;
  status: "active" | "inactive" | "blocked";
}

interface CashPayment {
  amount: number;
  receivedBy: string;
  location: string;
  timestamp: string;
  receiptNumber: string;
}

const mockEWalletAccount: EWalletAccount = {
  balance: 5250.50,
  lastTopup: "2025-12-08",
  totalSpent: 12450.75,
  transactionCount: 28,
  status: "active",
};

const mockPaymentTransactions: PaymentTransaction[] = [
  {
    id: "1",
    transactionId: "TXN-2025-12-001",
    service: "Birth Certificate",
    amount: 250,
    method: "e-wallet",
    status: "completed",
    date: "2025-12-10",
    time: "10:30 AM",
    reference: "BC-2025-001",
    description: "Birth Certificate Application Fee",
  },
  {
    id: "2",
    transactionId: "TXN-2025-12-002",
    service: "Business Permit Renewal",
    amount: 500,
    method: "cash",
    status: "completed",
    date: "2025-12-09",
    time: "2:15 PM",
    reference: "BP-2025-001",
    description: "Business Permit Renewal Payment",
  },
  {
    id: "3",
    transactionId: "TXN-2025-12-003",
    service: "Marriage Certificate",
    amount: 300,
    method: "e-wallet",
    status: "completed",
    date: "2025-12-08",
    time: "9:45 AM",
    reference: "MC-2025-001",
    description: "Marriage Certificate Verification",
  },
  {
    id: "4",
    transactionId: "TXN-2025-12-004",
    service: "Barangay Clearance",
    amount: 100,
    method: "cash",
    status: "completed",
    date: "2025-12-07",
    time: "11:20 AM",
    reference: "BC-2025-002",
    description: "Barangay Clearance Issuance",
  },
  {
    id: "5",
    transactionId: "TXN-2025-12-005",
    service: "Police Clearance",
    amount: 350,
    method: "e-wallet",
    status: "processing",
    date: "2025-12-11",
    time: "3:50 PM",
    reference: "PC-2025-001",
    description: "Police Clearance Application",
  },
];

const servicesFeeList = [
  { name: "Birth Certificate", baseFee: 250, description: "1st copy" },
  { name: "Marriage Certificate", baseFee: 300, description: "1st copy" },
  { name: "Death Certificate", baseFee: 250, description: "1st copy" },
  { name: "CENOMAR", baseFee: 100, description: "Certificate of No Marriage Record" },
  { name: "Barangay Clearance", baseFee: 100, description: "Single copy" },
  { name: "Police Clearance", baseFee: 350, description: "Local verification" },
  { name: "Business Permit", baseFee: 500, description: "Annual renewal" },
  { name: "Building Permit", baseFee: 1000, description: "Construction permit" },
  { name: "Health Clearance", baseFee: 200, description: "Health certificate" },
  { name: "Community Tax Certificate", baseFee: 150, description: "Cedula" },
];

const eWalletProviders = [
  { id: "gcash", name: "GCash", icon: "📱", minAmount: 50, maxAmount: 20000 },
  { id: "paymaya", name: "PayMaya", icon: "🏧", minAmount: 100, maxAmount: 25000 },
  { id: "grabpay", name: "GrabPay", icon: "🚗", minAmount: 50, maxAmount: 15000 },
  { id: "coins", name: "Coins.ph", icon: "💳", minAmount: 50, maxAmount: 20000 },
];

export default function PaymentProcessing() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    message: string;
    transactionId?: string;
  } | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>("");

  const selectedServiceData = servicesFeeList.find((s) => s.name === selectedService);
  const estimatedFee = selectedServiceData?.baseFee || 0;

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    const fee = servicesFeeList.find((s) => s.name === service)?.baseFee || 0;
    setPaymentAmount(fee);
    setPaymentResult(null);
  };

  const handleEWalletPayment = async () => {
    if (!selectedService || !selectedProvider || paymentAmount <= 0) {
      alert("Please select a service and e-wallet provider");
      return;
    }

    setPaymentInProgress(true);
    setPaymentResult(null);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock success rate: 90% success
    const isSuccess = Math.random() < 0.9;

    if (isSuccess) {
      const provider = eWalletProviders.find((p) => p.id === selectedProvider);
      const transactionId = `TXN-${Date.now()}`;
      setPaymentResult({
        success: true,
        message: `Payment of ₱${paymentAmount.toFixed(2)} successfully processed via ${provider?.name}!`,
        transactionId,
      });
    } else {
      setPaymentResult({
        success: false,
        message: "Payment failed. Please try again or use another payment method.",
      });
    }

    setPaymentInProgress(false);
  };

  const handleCashPayment = async () => {
    if (!selectedService || paymentAmount <= 0) {
      alert("Please select a service");
      return;
    }

    setPaymentInProgress(true);
    setPaymentResult(null);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const receiptNumber = `CASH-${Date.now()}`;
    setPaymentResult({
      success: true,
      message: `Cash payment of ₱${paymentAmount.toFixed(2)} recorded. Please proceed to payment counter with Reference ID.`,
      transactionId: receiptNumber,
    });

    setPaymentInProgress(false);
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200 text-green-700";
      case "processing":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "pending":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "failed":
        return "bg-red-50 border-red-200 text-red-700";
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "failed":
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const walletStats = {
    balance: mockEWalletAccount.balance,
    totalSpent: mockEWalletAccount.totalSpent,
    transactions: mockEWalletAccount.transactionCount,
    status: mockEWalletAccount.status,
  };

  const completedTransactions = mockPaymentTransactions.filter(
    (t) => t.status === "completed"
  ).length;
  const successRate = Math.round((completedTransactions / mockPaymentTransactions.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <CanConnectLogo size="md" />
            <span className="text-xl font-bold text-primary">CanConnect</span>
            <span className="ml-4 text-sm text-muted-foreground">| Payment Processing</span>
          </Link>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Payment Methods Selection */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* E-Wallet Payment */}
          <Card className="border-2 border-transparent hover:border-primary/50 transition-all cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-blue-600" />
                <CardTitle>E-Wallet Payment</CardTitle>
              </div>
              <CardDescription>Fast & secure digital payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-muted-foreground mb-2">Available Providers:</p>
                <div className="flex flex-wrap gap-2">
                  {eWalletProviders.map((provider) => (
                    <Badge key={provider.id} variant="outline" className="bg-white">
                      {provider.icon} {provider.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => setSelectedMethod("e-wallet")}
                variant={selectedMethod === "e-wallet" ? "default" : "outline"}
                className="w-full"
              >
                {selectedMethod === "e-wallet" ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Selected
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Select E-Wallet
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Cash Payment */}
          <Card className="border-2 border-transparent hover:border-primary/50 transition-all cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-emerald-600" />
                <CardTitle>Cash Payment</CardTitle>
              </div>
              <CardDescription>Pay at designated counter</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <p className="text-sm text-muted-foreground mb-2">Payment Locations:</p>
                <div className="space-y-1 text-sm">
                  <p>✓ Main Treasury Office</p>
                  <p>✓ Barangay Hall (Cantilan)</p>
                  <p>✓ Municipal Building</p>
                </div>
              </div>
              <Button
                onClick={() => setSelectedMethod("cash")}
                variant={selectedMethod === "cash" ? "default" : "outline"}
                className="w-full"
              >
                {selectedMethod === "cash" ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Selected
                  </>
                ) : (
                  <>
                    <Banknote className="mr-2 h-4 w-4" />
                    Select Cash
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Service Selection & Payment Form */}
        {selectedMethod && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>
                {selectedMethod === "e-wallet" ? "E-Wallet Payment Details" : "Cash Payment Details"}
              </CardTitle>
              <CardDescription>Select a service and proceed with payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Selection */}
              <div className="space-y-2">
                <Label htmlFor="service-select" className="text-base font-semibold">
                  Service Type
                </Label>
                <Select value={selectedService} onValueChange={handleServiceSelect}>
                  <SelectTrigger id="service-select" className="bg-white">
                    <SelectValue placeholder="Choose a service..." />
                  </SelectTrigger>
                  <SelectContent>
                    {servicesFeeList.map((service) => (
                      <SelectItem key={service.name} value={service.name}>
                        <div className="flex items-center gap-2">
                          <span>{service.name}</span>
                          <span className="text-muted-foreground text-sm">
                            (₱{service.baseFee})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Service Details */}
              {selectedServiceData && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-lg">{selectedService}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedServiceData.description}
                      </p>
                    </div>
                    <Badge className="bg-primary">OFFICIAL RATE</Badge>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="font-medium">Base Fee:</span>
                    <span className="text-2xl font-bold text-primary">
                      ₱{estimatedFee.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* E-Wallet Provider Selection */}
              {selectedMethod === "e-wallet" && (
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Select E-Wallet Provider</Label>
                  <div className="grid gap-3 md:grid-cols-2">
                    {eWalletProviders.map((provider) => (
                      <Card
                        key={provider.id}
                        className={`cursor-pointer transition-all ${
                          selectedProvider === provider.id
                            ? "border-2 border-primary ring-2 ring-primary/20"
                            : "border-2 border-gray-200 hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedProvider(provider.id)}
                      >
                        <CardContent className="pt-4">
                          <div className="text-center space-y-2">
                            <div className="text-4xl">{provider.icon}</div>
                            <p className="font-semibold">{provider.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ₱{provider.minAmount} - ₱{provider.maxAmount.toLocaleString()}
                            </p>
                            {selectedProvider === provider.id && (
                              <Badge className="bg-primary mt-2">Selected</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              {selectedService && (
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Service Fee:</span>
                    <span className="font-semibold">₱{paymentAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Processing:</span>
                    <span className="font-semibold">FREE</span>
                  </div>
                  <div className="border-t pt-3 flex items-center justify-between">
                    <span className="font-bold text-lg">Total Amount:</span>
                    <span className="text-3xl font-bold text-primary">
                      ₱{paymentAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Security Info */}
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  All transactions are encrypted and secured. Your payment information is protected.
                </AlertDescription>
              </Alert>

              {/* Payment Result */}
              {paymentResult && (
                <Alert
                  className={`${
                    paymentResult.success
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="ml-2">
                    <div>
                      <p className="font-semibold">{paymentResult.message}</p>
                      {paymentResult.transactionId && (
                        <p className="text-sm mt-2">
                          Reference ID: <code className="bg-white/50 px-2 py-1 rounded">{paymentResult.transactionId}</code>
                        </p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {selectedMethod === "e-wallet" ? (
                  <Button
                    onClick={handleEWalletPayment}
                    disabled={!selectedService || !selectedProvider || paymentInProgress}
                    className="flex-1"
                    size="lg"
                  >
                    {paymentInProgress ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Pay with {eWalletProviders.find((p) => p.id === selectedProvider)?.name}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleCashPayment}
                    disabled={!selectedService || paymentInProgress}
                    className="flex-1"
                    size="lg"
                  >
                    {paymentInProgress ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Generating Reference...
                      </>
                    ) : (
                      <>
                        <Banknote className="mr-2 h-4 w-4" />
                        Generate Payment Reference
                      </>
                    )}
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setSelectedMethod(null);
                    setSelectedService("");
                    setPaymentResult(null);
                  }}
                  variant="outline"
                  size="lg"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* E-Wallet Account Status */}
        {selectedMethod === "e-wallet" && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-blue-600" />
                  <CardTitle>My E-Wallet Account</CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className={
                    walletStats.status === "active"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }
                >
                  {walletStats.status.toUpperCase()}
                </Badge>
              </div>
              <CardDescription>Your digital wallet balance and transaction history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Balance Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
                    <p className="text-3xl font-bold text-blue-600">₱{walletStats.balance.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last topup: {mockEWalletAccount.lastTopup}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Total Spent</p>
                    <p className="text-3xl font-bold text-purple-600">
                      ₱{walletStats.totalSpent.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">All-time expenses</p>
                  </CardContent>
                </Card>

                <Card className="border-emerald-200 bg-emerald-50">
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Transactions</p>
                    <p className="text-3xl font-bold text-emerald-600">{walletStats.transactions}</p>
                    <p className="text-xs text-muted-foreground mt-2">Total completed</p>
                  </CardContent>
                </Card>
              </div>

              {/* Add Funds Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Funds to Wallet
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Top Up Your E-Wallet</DialogTitle>
                    <DialogDescription>
                      Add funds to your CanConnect e-wallet account
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="topup-amount">Amount to Add</Label>
                      <div className="flex gap-2">
                        <Input id="topup-amount" type="number" placeholder="Enter amount" />
                        <Button variant="outline">PHP</Button>
                      </div>
                    </div>
                    <div>
                      <Label>Quick Topup</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[500, 1000, 2000].map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            className="text-sm"
                            onClick={() => {
                              const input = document.getElementById(
                                "topup-amount"
                              ) as HTMLInputElement;
                              if (input) input.value = amount.toString();
                            }}
                          >
                            ₱{amount}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">Proceed to Topup</Button>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}

        {/* Payment Statistics & Reports */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle>Payment Statistics</CardTitle>
            </div>
            <CardDescription>Your payment activity overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Successful Payments</p>
                  <p className="text-3xl font-bold text-green-600">{completedTransactions}</p>
                  <Progress value={successRate} className="mt-3" />
                  <p className="text-xs text-muted-foreground mt-1">Success Rate: {successRate}%</p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">E-Wallet Payments</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {mockPaymentTransactions.filter((t) => t.method === "e-wallet").length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Digital transactions</p>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 bg-emerald-50">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Cash Payments</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {mockPaymentTransactions.filter((t) => t.method === "cash").length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">In-person payments</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>Transaction History</CardTitle>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Export Transactions</DialogTitle>
                    <DialogDescription>
                      Choose export format for your transaction history
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      📄 PDF Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      📊 Excel Spreadsheet
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      📋 CSV File
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription>Recent payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPaymentTransactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-mono text-sm">{txn.transactionId}</TableCell>
                      <TableCell className="font-medium">{txn.service}</TableCell>
                      <TableCell className="font-bold text-primary">
                        ₱{txn.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            txn.method === "e-wallet"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }
                        >
                          {txn.method === "e-wallet" ? "💳 E-Wallet" : "💵 Cash"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {txn.date} <br /> {txn.time}
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded text-sm ${getStatusColor(txn.status)}`}>
                          {getStatusIcon(txn.status)}
                          <span className="capitalize">{txn.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Transaction Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">Transaction ID</p>
                                  <p className="font-mono text-sm font-bold">{txn.transactionId}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Reference</p>
                                  <p className="font-mono text-sm font-bold">{txn.reference}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Service</p>
                                <p className="font-semibold">{txn.service}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Description</p>
                                <p className="text-sm">{txn.description}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">Amount</p>
                                  <p className="text-xl font-bold text-primary">₱{txn.amount.toFixed(2)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Method</p>
                                  <p className="font-semibold">{txn.method === "e-wallet" ? "E-Wallet" : "Cash"}</p>
                                </div>
                              </div>
                              <div className="bg-primary/10 p-3 rounded border border-primary/20">
                                <p className="text-xs text-muted-foreground mb-1">Status</p>
                                <div
                                  className={`flex items-center gap-1 px-2 py-1 rounded text-sm w-fit ${getStatusColor(
                                    txn.status
                                  )}`}
                                >
                                  {getStatusIcon(txn.status)}
                                  <span className="capitalize">{txn.status}</span>
                                </div>
                              </div>
                              <div className="pt-2 border-t flex gap-2">
                                <Button className="flex-1" size="sm">
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Receipt
                                </Button>
                                <DialogClose asChild>
                                  <Button variant="outline" size="sm">
                                    Close
                                  </Button>
                                </DialogClose>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// Icon placeholder for missing Plus icon
function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
