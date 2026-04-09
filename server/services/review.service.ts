import { prisma } from "../db/prisma";
import type {
  CreateReviewPayload,
  UpdateReviewPayload,
  ReviewQuery,
} from "../types/review.type";

export const reviewService = {
  createReview: async (userId: string, payload: CreateReviewPayload) => {
    const booking = await prisma.booking.findFirst({
      where: {
        id: payload.bookingId,
        userId,
        status: "COMPLETED",
      },
      include: {
        room: { select: { hotelId: true } },
      },
    });
    if (!booking) throw new Error("Booking not found or not completed");

    const existing = await prisma.review.findUnique({
      where: {
        userId_hotelId: {
          userId,
          hotelId: booking.room.hotelId,
        },
      },
    });
    if (existing) throw new Error("You have already reviewed this hotel");

    return await prisma.review.create({
      data: {
        userId,
        hotelId: booking.room.hotelId,
        rating: payload.rating,
        comment: payload.comment,
      },
      include: {
        user: { select: { name: true } },
      },
    });
  },
  getReviewsByHotelId: async (hotelId: string, query: ReviewQuery) => {
    const { rating, page = 1, limit = 10, sortOrder = "dsc" } = query;
    const whwereClause: any = {
      hotelId,
      rating: rating ? Number(rating) : undefined,
    };
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    if (rating) {
      if (Array.isArray(rating)) {
        whwereClause.rating = { in: rating.map(Number) };
      } else {
        whwereClause.rating = Number(rating);
      }
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: whwereClause,
        orderBy: {
          createdAt: sortOrder === "asc" ? "asc" : "desc",
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          user: {
            select: {
                id: true,
              name: true,
            },
          },
        },
      }),
      prisma.review.count({
        where: whwereClause,
      }),
    ]);
    return {
      data: reviews,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  },
  updateReview: async (
    userId: string,
    reviewId: string,
    payload: UpdateReviewPayload
  ) => {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review) throw new Error("Review not found");
    if (review.userId !== userId)
      throw new Error("You can only update your own reviews");
    return await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: payload.rating,
        comment: payload.comment,
      },
    });
  },
  deleteReview: async (userId: string, reviewId: string) => {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review) throw new Error("Review not found");
    if (review.userId !== userId)
      throw new Error("You can only delete your own reviews");
    await prisma.review.delete({
      where: { id: reviewId },
    });
  },
};
