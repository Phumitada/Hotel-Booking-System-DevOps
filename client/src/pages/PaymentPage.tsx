import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateCharge } from "@/hooks/usePayment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Lock, Loader2, QrCode, Building2 } from "lucide-react";

declare global {
  interface Window { Omise: any }
}

type PaymentMethod = 'card' | 'promptpay' 
export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const amount = Number(searchParams.get("amount") || 0);

  const [method, setMethod] = useState<PaymentMethod>('card')
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [tokenizing, setTokenizing] = useState(false);
  const [omiseLoaded, setOmiseLoaded] = useState(false);

  const createChargeMutation = useCreateCharge();

  useEffect(() => {
    if (!bookingId) { navigate("/bookings"); return; }
    const script = document.createElement("script");
    script.src = "https://cdn.omise.co/omise.js";
    script.async = true;
    script.onload = () => setOmiseLoaded(true);
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const formatCardNumber = (value: string) =>
    value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const isCardReady =
    cardNumber.replace(/\s/g, "").length === 16 &&
    cardName.trim().length > 0 &&
    expiry.length === 5 &&
    cvv.length >= 3 &&
    omiseLoaded;

  const isFormReady =
    method === 'card' ? isCardReady :
    method === 'promptpay' ? true :
    !!selectedBank

  const handleCardPayment = () => {
    if (!isCardReady || !bookingId) return;
    setTokenizing(true);
    const [expMonth, expYear] = expiry.split("/");
    window.Omise.setPublicKey(import.meta.env.VITE_OMISE_PUBLIC_KEY);
    window.Omise.createToken(
      "card",
      {
        name: cardName,
        number: cardNumber.replace(/\s/g, ""),
        expiration_month: parseInt(expMonth),
        expiration_year: parseInt(`20${expYear}`),
        security_code: cvv,
      },
      (_: number, response: any) => {
        setTokenizing(false);
        if (response.object === "error") return;
        createChargeMutation.mutate({ bookingId, amount: amount * 100, token: response.id });
      }
    );
  };

  const handleSourcePayment = () => {
    if (!bookingId) return;
    createChargeMutation.mutate({
      bookingId,
      amount: amount * 100,
      source: method === 'promptpay' ? 'promptpay' : selectedBank,
      type: method === 'promptpay' ? 'promptpay' : 'internet_banking',
    });
  };

  const handlePay = () => {
    if (method === 'card') handleCardPayment();
    else handleSourcePayment();
  };

  const tabs: { id: PaymentMethod; label: string; icon: any }[] = [
    { id: 'card',      label: 'Card',            icon: CreditCard },
    { id: 'promptpay', label: 'PromptPay',        icon: QrCode     },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-lg mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate("/bookings")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bookings
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Complete Payment</CardTitle>
            <CardDescription>Choose a payment method to confirm your booking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex justify-between text-sm px-1">
              <span className="text-gray-500">Booking ID</span>
              <span className="font-medium text-gray-700 truncate ml-4">{bookingId}</span>
            </div>
            <div className="flex justify-between text-sm px-1">
              <span className="text-gray-500">Total Amount</span>
              <span className="font-semibold text-gray-900">฿{amount.toLocaleString()}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex rounded-md border border-gray-200 overflow-hidden">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setMethod(tab.id)}
                      className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors border-r last:border-r-0 border-gray-200 ${
                        method === tab.id
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>
            {method === 'card' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    className="font-mono tracking-widest"
                  />
                </div>
                <div>
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    placeholder="JOHN DOE"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength={4}
                      className="font-mono"
                    />
                  </div>
                </div>
                <div className="border border-gray-100 rounded-md overflow-hidden">
                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Test Cards</p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {[
                      { number: '4242 4242 4242 4242', label: 'Visa — Success',   color: 'text-green-600' },
                      { number: '4111 1111 1111 1111', label: 'Visa — 3D Secure', color: 'text-blue-600'  },
                      { number: '4000 0000 0000 0002', label: 'Visa — Declined',  color: 'text-red-500'   },
                    ].map((card) => (
                      <button
                        key={card.number}
                        type="button"
                        onClick={() => { setCardNumber(card.number); setExpiry('12/30'); setCvv('123'); setCardName('TEST USER') }}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                      >
                        <span className="font-mono text-xs text-gray-600">{card.number}</span>
                        <span className={`text-xs font-medium ${card.color}`}>{card.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {method === 'promptpay' && (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-800">Pay via PromptPay</p>
                <p className="text-xs text-gray-400 max-w-xs">
                  Click Pay to generate a QR code. Scan with your banking app to complete payment.
                </p>
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded text-xs text-amber-600 w-full">
                  <QrCode className="w-3 h-3 shrink-0" />
                  Test mode — real QR generated, no actual charge
                </div>
              </div>
            )}
            <Button
              onClick={handlePay}
              disabled={!isFormReady || tokenizing || createChargeMutation.isPending}
              className="w-full"
            >
              {tokenizing || createChargeMutation.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing...</>
              ) : (
                <><Lock className="h-4 w-4 mr-2" />Pay ฿{amount.toLocaleString()}</>
              )}
            </Button>

            <p className="text-xs text-gray-400 text-center">Secured by Omise · SSL encrypted</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}