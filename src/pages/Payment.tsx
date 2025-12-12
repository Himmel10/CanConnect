import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { getApplication, updateApplication } from "@/lib/applicationStorage";
import { processPayment, SERVICE_FEES, formatCurrency } from "@/lib/paymentService";
import { Logo } from "@/components/Logo";

const Payment = () => {
  const navigate = useNavigate();
  const { appId } = useParams<{ appId: string }>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  useEffect(() => {
    if (appId) {
      const app = getApplication(appId);
      if (app) {
        setApplication(app);
      } else {
        toast.error("Application not found");
        navigate("/dashboard");
      }
    }
  }, [appId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCardData((prev) => ({ ...prev, [id]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardData((prev) => ({ ...prev, cardNumber: formatted }));
  };

  const amount = application ? (SERVICE_FEES[application.type as keyof typeof SERVICE_FEES] || 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Validate card data
      if (!cardData.cardNumber || !cardData.cardHolder || !cardData.cvv) {
        toast.error("Please fill in all card details");
        setIsProcessing(false);
        return;
      }

      // Process payment
      const result = await processPayment({
        amount,
        currency: "PHP",
        paymentMethod: application.formData.paymentMethod || "e-wallet",
        serviceType: application.type,
        applicationId: appId!,
        status: "processing",
      });

      if (result.success) {
        // Update application with payment info
        updateApplication(appId!, {
          paymentStatus: "completed",
          transactionId: result.transactionId,
          paymentAmount: amount,
        });

        toast.success("Payment successful!");
        navigate(`/payment-confirmation/${appId}/${result.transactionId}`);
      } else {
        toast.error(result.error || "Payment failed. Please try again.");
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error("Payment processing error");
      setIsProcessing(false);
    }
  };

  if (!application) {
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Logo />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <CreditCard className="h-10 w-10 text-primary" />
                  <div>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>Enter your card information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength="19"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardHolder">Cardholder Name</Label>
                    <Input
                      id="cardHolder"
                      placeholder="Juan Dela Cruz"
                      value={cardData.cardHolder}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="expiryMonth">Month</Label>
                      <Input
                        id="expiryMonth"
                        placeholder="MM"
                        value={cardData.expiryMonth}
                        onChange={handleInputChange}
                        maxLength="2"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryYear">Year</Label>
                      <Input
                        id="expiryYear"
                        placeholder="YY"
                        value={cardData.expiryYear}
                        onChange={handleInputChange}
                        maxLength="2"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={handleInputChange}
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded text-sm text-blue-900 dark:text-blue-100">
                    <strong>Test Card Numbers:</strong>
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>Success: 4242 4242 4242 4242</li>
                      <li>Decline: 4000 0000 0000 0002</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isProcessing}
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      `Pay ${formatCurrency(amount)}`
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-semibold">{application.type}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Application ID</p>
                  <p className="font-mono text-sm">{appId}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-semibold capitalize">
                    {application.formData.paymentMethod === "e-wallet"
                      ? "E-Wallet"
                      : "Cash Payment"}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span className="font-semibold">{formatCurrency(amount)}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold">Total Amount</span>
                    <span className="text-primary font-bold">{formatCurrency(amount)}</span>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950 p-3 rounded text-sm text-green-900 dark:text-green-100">
                  ✓ Secure payment processing
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
