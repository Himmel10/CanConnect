import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Home, ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApplication } from "@/lib/applicationStorage";
import { getPaymentRecord, formatCurrency, generateReceipt } from "@/lib/paymentService";
import { Logo } from "@/components/Logo";

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const { appId, transactionId } = useParams<{ appId: string; transactionId: string }>();
  const [application, setApplication] = useState<any>(null);
  const [paymentRecord, setPaymentRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (appId && transactionId) {
      const app = getApplication(appId);
      const payment = getPaymentRecord(transactionId);

      setApplication(app);
      setPaymentRecord(payment);
      setIsLoading(false);
    }
  }, [appId, transactionId]);

  const downloadReceipt = () => {
    if (!paymentRecord) return;

    const receipt = generateReceipt(paymentRecord);
    const element = document.createElement("a");
    const file = new Blob([receipt], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `receipt-${transactionId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!application || !paymentRecord) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto flex h-20 items-center justify-between px-4">
            <Logo />
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl">
            <CardContent className="pt-6">
              <p className="text-red-600">Payment record not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Logo />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div>
                  <h2 className="text-2xl font-bold text-green-900 dark:text-green-100">
                    Payment Successful!
                  </h2>
                  <p className="text-green-800 dark:text-green-200">
                    Your payment has been processed and confirmed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Receipt Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment Receipt</CardTitle>
              <CardDescription>Keep this for your records</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-6 rounded-lg space-y-3 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-semibold">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Type:</span>
                  <span className="font-semibold">{application.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Application ID:</span>
                  <span className="font-semibold">{appId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(paymentRecord.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-semibold capitalize">
                    {paymentRecord.paymentMethod === "e-wallet" ? "E-Wallet" : "Cash Payment"}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-semibold">
                    {paymentRecord.timestamp
                      ? new Date(paymentRecord.timestamp).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {paymentRecord.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={downloadReceipt}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
            </CardContent>
          </Card>

          {/* Application Status Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Payment Confirmed</p>
                    <p className="text-sm text-muted-foreground">Your payment has been securely processed.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Application Under Review</p>
                    <p className="text-sm text-muted-foreground">Your document request is being processed by our team.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Ready for Pickup</p>
                    <p className="text-sm text-muted-foreground">You'll be notified when your document is ready.</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded text-sm text-blue-900 dark:text-blue-100">
                <p className="font-semibold mb-1">📝 Note:</p>
                <p>You can track your application status using your Application ID: <strong>{appId}</strong></p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate(`/tracking/${appId}`)}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              View Application Status
            </Button>
            <Button
              className="flex-1"
              onClick={() => navigate("/dashboard")}
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
