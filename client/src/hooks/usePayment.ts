import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/api/services/omise.service";
import { toast } from "sonner";

export const useCreateCharge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => paymentService.createCharge(payload),
    onSuccess: (data, variables) => {
      if (data.authorize && data.url) {
        window.location.assign(data.url);
        return;
      }
      if (data.promptpay && data.qrImage) {
        window.location.href = `/payment-verify?bookingId=${data.bookingId}&chargeId=${data.chargeId}&qrImage=${encodeURIComponent(data.qrImage)}`;
        return;
      }
      if (data.success) {
        toast.success("ชำระเงินสำเร็จ!");
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
        window.location.href = `/payment-verify?bookingId=${variables.bookingId}&success=true`;
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to create payment";
      toast.error(message);
    },
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: (payload: { chargeId: string; bookingId: string; forceResult?: string }) =>
      paymentService.validateCharge(payload),
    onSuccess: () => {
      toast.success("ยืนยันการชำระเงินสำเร็จ!");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "การชำระเงินมีปัญหา กรุณาติดต่อเจ้าหน้าที่";
      toast.error(message);
    },
  });
};