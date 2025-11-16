import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! 👋 Welcome to CanConnect AI Assistant. How can I help you today? You can ask me about:\n• Application status\n• Required documents\n• Service information\n• How to submit applications",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Application Status
    if (message.includes("status") || message.includes("application")) {
      return "📋 To check your application status:\n\n1. Go to your Dashboard\n2. Click on 'My Applications' section\n3. Or navigate to the Tracking page\n\nYou can also check notifications for updates. Processing usually takes 2-5 business days depending on the service.";
    }

    // Documents
    if (message.includes("document") || message.includes("required")) {
      return "📄 Required documents vary by service type:\n\n• Most services require: Valid ID, Barangay Clearance\n• Specific services may need additional documents\n\nTo see exact requirements:\n1. Click on the service you're interested in\n2. Scroll to 'Required Documents' section\n3. All documents are listed with descriptions";
    }

    // How to apply
    if (message.includes("how to") || message.includes("apply") || message.includes("submit")) {
      return "✨ Steps to submit an application:\n\n1. Go to Dashboard\n2. Browse available services by category\n3. Click on the service you want\n4. Fill out the application form\n5. Review required documents\n6. Click 'Submit Application'\n7. You'll be redirected to Tracking page\n\nYou'll receive notifications about your application status!";
    }

    // Contact/Support
    if (message.includes("contact") || message.includes("support") || message.includes("help")) {
      return "📞 We're here to help!\n\nFor assistance:\n• Check FAQ in your Profile\n• Visit Help & Support section\n• Contact your Barangay Hall directly\n• Email: support@canconnect.gov.ph\n\nAverage response time: 24 hours";
    }

    // Services
    if (message.includes("service") || message.includes("what can")) {
      return "🏛️ CanConnect offers services in categories:\n\n• Civil Registry (Birth, Marriage, Death Certificates)\n• Residency Documents (Barangay Clearance, Residency)\n• Business & Permits (Business, Building, Occupancy Permits)\n• Special IDs (Senior Citizen, PWD, Solo Parent ID)\n• Assistance Programs (Medical, 4Ps, Financial)\n• Health & Agriculture (Health Clearance, Veterinary)\n\nVisit Dashboard to explore all services!";
    }

    // Fees
    if (message.includes("fee") || message.includes("cost") || message.includes("price")) {
      return "💰 Service Fees:\n\n• Most documents: ₱50-₱100 per copy\n• Permits: ₱300-₱1,000\n• Assistance programs: FREE\n• Some services vary by requirements\n\nExact fees are shown when you select a service. Payment methods will be confirmed during submission.";
    }

    // Processing time
    if (message.includes("time") || message.includes("how long") || message.includes("when")) {
      return "⏱️ Processing Times:\n\n• Most services: 2-5 business days\n• Some permits: 1-2 weeks\n• Assistance programs: 5-10 business days\n\nFactors that may affect timing:\n• Completeness of documents\n• Volume of requests\n• Additional verifications needed\n\nYou'll be notified of updates!";
    }

    // Troubleshooting
    if (message.includes("problem") || message.includes("issue") || message.includes("error")) {
      return "🔧 Having trouble?\n\nTry these steps:\n1. Clear browser cache\n2. Use latest browser version\n3. Check internet connection\n4. Try again in a few moments\n\nIf problem persists:\n• Screenshot the error\n• Contact support with error message\n• Provide your application number";
    }

    // Account/Profile
    if (message.includes("profile") || message.includes("account")) {
      return "👤 Profile Management:\n\n• Click your profile icon (top right)\n• View/Edit personal information\n• Check profile completion status\n• Change password\n• Update notification preferences\n• View application history\n\nKeep your profile updated for better service delivery!";
    }

    // Greeting
    if (message.includes("hi") || message.includes("hello") || message.includes("hey")) {
      return "👋 Hello! I'm your CanConnect AI Assistant. I'm here to help with:\n\n• Service information\n• Application guidance\n• Document requirements\n• Account help\n• General inquiries\n\nWhat can I help you with today?";
    }

    // Thank you
    if (message.includes("thank") || message.includes("thanks")) {
      return "😊 You're welcome! Is there anything else I can help you with? Feel free to ask any questions about our services!";
    }

    // Default response
    return "I'm here to help! 🤖\n\nYou can ask me about:\n• How to submit applications\n• Application status\n• Required documents\n• Service information\n• Fees and processing times\n• Account & profile help\n\nWhat would you like to know?";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputValue),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 z-40"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[500px] shadow-2xl flex flex-col z-50 animate-in fade-in slide-in-from-bottom-4">
          <CardHeader className="bg-primary text-white rounded-t-lg pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">CanConnect AI Assistant</CardTitle>
                <p className="text-xs text-primary-foreground/80 mt-1">
                  Always here to help 🤖
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                    message.sender === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          <div className="border-t p-4 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="text-sm"
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </Card>
      )}
    </>
  );
};

export default AIChat;
