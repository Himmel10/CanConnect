// Payment Service - Handles payment processing with Stripe
// In production, use a real Stripe API endpoint

export interface PaymentDetails {
  amount: number;
  currency: string;
  paymentMethod: "e-wallet" | "cash";
  serviceType: string;
  applicationId: string;
  status: "pending" | "processing" | "completed" | "failed";
  transactionId?: string;
  timestamp?: string;
}

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_demo";

// Service fees by document type
export const SERVICE_FEES: Record<string, number> = {
  "Barangay Clearance": 50,
  "Birth Certificate": 150,
  "Marriage Certificate": 200,
  "Police Clearance": 50,
  "Business Permit": 500,
  "Death Certificate": 150,
  "CENOMAR": 150,
  "Certificate of Residency": 30,
  "Senior Citizen ID": 0,
  "PWD ID": 0,
  "Solo Parent ID": 0,
  "Certificate of Indigency": 0,
  "Community Tax Certificate": 75,
  "Building Permit": 1000,
  "Tricycle Franchise": 2000,
};

// Generate a mock transaction ID
export const generateTransactionId = (): string => {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Process payment (simulated for now, replace with real Stripe API call)
export const processPayment = async (
  paymentDetails: PaymentDetails
): Promise<{ success: boolean; transactionId: string; error?: string }> => {
  try {
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In production, this would call your backend which communicates with Stripe
    // For now, we'll simulate a successful payment 95% of the time
    const isSuccessful = Math.random() > 0.05;

    if (!isSuccessful) {
      throw new Error("Payment declined. Please try again or use a different method.");
    }

    const transactionId = generateTransactionId();

    // Store payment confirmation in localStorage
    const paymentRecord = {
      ...paymentDetails,
      transactionId,
      status: "completed",
      timestamp: new Date().toISOString(),
    };

    const payments = JSON.parse(localStorage.getItem("payments") || "[]");
    payments.push(paymentRecord);
    localStorage.setItem("payments", JSON.stringify(payments));

    return { success: true, transactionId };
  } catch (error) {
    return {
      success: false,
      transactionId: "",
      error: error instanceof Error ? error.message : "Payment processing failed",
    };
  }
};

// Get payment details from localStorage
export const getPaymentRecord = (transactionId: string): PaymentDetails | null => {
  const payments = JSON.parse(localStorage.getItem("payments") || "[]");
  return payments.find((p: PaymentDetails) => p.transactionId === transactionId) || null;
};

// Get all payments for an application
export const getApplicationPayments = (applicationId: string): PaymentDetails[] => {
  const payments = JSON.parse(localStorage.getItem("payments") || "[]");
  return payments.filter((p: PaymentDetails) => p.applicationId === applicationId);
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return `₱${amount.toFixed(2)}`;
};

// Generate receipt
export const generateReceipt = (paymentDetails: PaymentDetails): string => {
  const {
    transactionId,
    serviceType,
    amount,
    paymentMethod,
    timestamp,
  } = paymentDetails;

  return `
RECEIPT
====================
Service: ${serviceType}
Amount: ${formatCurrency(amount)}
Payment Method: ${paymentMethod === "e-wallet" ? "E-Wallet" : "Cash Payment"}
Transaction ID: ${transactionId}
Date: ${timestamp ? new Date(timestamp).toLocaleString() : "N/A"}
Status: COMPLETED
====================
  `.trim();
};
