import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/api/services/review.service";
import type { ReviewQuery } from "@/types/review.type";
import { toast } from "sonner";

export const useReviews = (hotelId:string,query: ReviewQuery = {}) => {
  return useQuery({
    queryKey: ["reviews", hotelId,query,],
    queryFn: () => reviewService.getReviewsByHotelId(hotelId, query),
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewData: any) => reviewService.createReview(reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to submit review'
      toast.error(message)
    }
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reviewData }: { id: string; reviewData: any }) => 
      reviewService.updateReview(id, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
