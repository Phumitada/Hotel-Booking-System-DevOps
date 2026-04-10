import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyPayment } from "@/hooks/usePayment";
import { paymentService } from "@/api/services/omise.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, ArrowLeft, CreditCard, QrCode, RefreshCw } from "lucide-react";

export default function PaymentVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const chargeId = searchParams.get("chargeId") ?? searchParams.get("charge_id");
  const directSuccess = searchParams.get("success");
  const qrImage = searchParams.get("qrImage");

  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'qr' | 'success' | 'failed'>('loading');
  const [errorMessage, setErrorMessage] = useState("");
  const [forcing, setForcing] = useState(false);

  const verifyPaymentMutation = useVerifyPayment();

  useEffect(() => {
    if (!bookingId) {
      setVerificationStatus('failed');
      setErrorMessage("Booking ID not found");
      return;
    }
    if (qrImage) {
      setVerificationStatus('qr');
      return;
    }
    if (chargeId && !directSuccess) {
      verifyPaymentMutation.mutate(
        { chargeId, bookingId },
        {
          onSuccess: () => setVerificationStatus('success'),
          onError: (error: any) => {
            setVerificationStatus('failed');
            setErrorMessage(error?.response?.data?.message || "Payment verification failed");
          },
        }
      );
      return;
    }
    if (directSuccess === 'true') {
      setVerificationStatus('success');
      return;
    }
    setVerificationStatus('failed');
    setErrorMessage("Invalid payment session");
  }, []);

  const handleVerifyManually = () => {
    if (!chargeId || !bookingId) return;
    setVerificationStatus('loading');
    verifyPaymentMutation.mutate(
      { chargeId, bookingId },
      {
        onSuccess: () => setVerificationStatus('success'),
        onError: (error: any) => {
          setVerificationStatus('qr');
          setErrorMessage(error?.response?.data?.message || "Payment not confirmed yet");
        },
      }
    );
  };

  const handleForceResult = async (result: 'success' | 'failed') => {
    if (!chargeId || !bookingId) return;
    setForcing(true);
    try {
      await paymentService.validateCharge({ chargeId, bookingId, forceResult: result });
      setVerificationStatus('success');
    } catch {
      setVerificationStatus('failed');
      setErrorMessage("Payment failed");
    } finally {
      setForcing(false);
    }
  };

  if (verificationStatus === 'qr') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md w-full mx-4">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                <QrCode className="h-10 w-10 text-blue-600" />
              </div>
              <CardTitle>Scan to Pay</CardTitle>
              <CardDescription>
                Scan this QR code with your banking app to complete payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={decodeURIComponent(qrImage!)}
                  alt="PromptPay QR Code"
                  className="w-64 h-64 border border-gray-300 rounded-none"
                />
              </div>

              <div className="flex items-center justify-between text-sm px-1">
                <span className="text-gray-500">Booking ID</span>
                <span className="font-medium text-gray-700 truncate ml-4">{bookingId}</span>
              </div>

              {errorMessage && (
                <div className="border-l-4 border-amber-400 pl-3 py-2 text-xs text-gray-600">
                  {errorMessage}
                </div>
              )}

              <Button
                onClick={handleVerifyManually}
                disabled={verifyPaymentMutation.isPending || forcing}
                className="w-full"
              >
                {verifyPaymentMutation.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Checking...</>
                ) : (
                  <><RefreshCw className="h-4 w-4 mr-2" />I've Paid — Confirm</>
                )}
              </Button>

              <div className="border border-gray-300 rounded-none overflow-hidden">
                <div className="px-3 py-2 bg-gray-100 border-b border-gray-300">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Test Mode</p>
                </div>
                <div className="grid grid-cols-2 divide-x divide-gray-100">
                  <button
                    onClick={() => handleForceResult('success')}
                    disabled={forcing}
                    className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                  >
                    {forcing ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                    Force Success
                  </button>
                  <button
                    onClick={() => handleForceResult('failed')}
                    disabled={forcing}
                    className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {forcing ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                    Force Failed
                  </button>
                </div>
              </div>

              <Button variant="outline" onClick={() => navigate("/hotels")} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Hotels
              </Button>

              <p className="text-center text-xs text-gray-400">Secured by Omise · SSL encrypted</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {verificationStatus === 'loading' && <Loader2 className="h-16 w-16 animate-spin text-blue-600" />}
              {verificationStatus === 'success' && <CheckCircle className="h-16 w-16 text-green-600" />}
              {verificationStatus === 'failed' && <XCircle className="h-16 w-16 text-red-600" />}
            </div>
            <CardTitle className="text-2xl">
              {verificationStatus === 'loading' && "Verifying Payment"}
              {verificationStatus === 'success' && "Payment Successful!"}
              {verificationStatus === 'failed' && "Payment Failed"}
            </CardTitle>
            <CardDescription>
              {verificationStatus === 'loading' && "Please wait while we verify your payment..."}
              {verificationStatus === 'success' && "Your booking has been confirmed and payment processed successfully."}
              {verificationStatus === 'failed' && (errorMessage || "We couldn't process your payment. Please try again.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {verificationStatus === 'success' && (
              <div className="space-y-4">
                <div className="border-l-2 border-green-600 pl-3 py-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-gray-800">Booking Confirmed</p>
                      <p className="text-xs text-gray-600">
                        ID: {bookingId}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-l-2 border-blue-600 pl-3 py-2">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-gray-800">Payment Details</p>
                      <p className="text-xs text-gray-600">Processed via Omise</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {verificationStatus === 'failed' && (
              <div className="border-l-2 border-red-600 pl-3 py-2">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-gray-800">Transaction Failed</p>
                    <p className="text-xs text-gray-600">
                      {errorMessage || "Payment could not be processed"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 pt-4">
              {verificationStatus === 'success' && (
                <Button onClick={() => navigate("/bookings")} className="w-full">
                  View My Bookings
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate("/hotels")} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Hotels
              </Button>
            </div>

            {verificationStatus === 'loading' && (
              <p className="text-center text-sm text-gray-500">Please don't close this window...</p>
            )}

            <div className="text-center text-xs text-gray-400 pt-4 border-t">
              Secured by Omise Payment Gateway
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}