import { prisma } from "../db/prisma";
import type { BookingQuery, CreateBookingPayload } from "../types/booking.type";

export const bookingService = {
  createBooking: async (payload:CreateBookingPayload) => {
    return await prisma.$transaction(async (tx) => {
      const room = await tx.room.findUnique({
        where: { id: payload.roomId },
      });
      if (!room) throw new Error("Room not found");
      if (payload.guests > room.capacity)
        throw new Error("Number of guests exceeds room capacity");
      const checkInTime = new Date(payload.checkIn);
      const checkOutTime = new Date(payload.checkOut);
      if (checkInTime < new Date())
        throw new Error("Check-in date must be in the future");
      if (checkInTime >= checkOutTime)
        throw new Error("Check-out date must be after check-in date");
      const overlappingCounts = await tx.booking.count({
        where: {
          roomId: payload.roomId,
          status: { not: "CANCELLED" },
          NOT: [
            {
              checkOut: { lte: checkInTime },
            },
            {
              checkIn: { gte: checkOutTime },
            },
          ],
        },
      });
      if (overlappingCounts >= room.totalRooms)
        throw new Error("Room is not available for the selected dates");
      const totalPrice =
        room.pricePerNight *
        Math.ceil(
          (checkOutTime.getTime() - checkInTime.getTime()) /
            (1000 * 60 * 60 * 24)
        );
      const booking = await tx.booking.create({
        data: {
          userId: payload.userId,
          roomId: payload.roomId,
          checkIn: checkInTime,
          checkOut: checkOutTime,
          guests: payload.guests,
          totalPrice,
          specialRequest: payload.specialRequest,
          status: "PENDING",
        },
      });
      return booking;
    });
  },
  getBookingsByUserId: async (userId: string, query: BookingQuery) => {
    const { status, page = 1, limit = 10 } = query;
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: { userId: userId, status: status ? status : undefined },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
          room: {
            include: {
              hotel: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
              images: {
                take: 1,
              },
            },
          },
        },
      }),
      prisma.booking.count({
        where: { userId: userId, status: status ? status : undefined },
      }),
    ]);
    return {
      data: bookings,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  },
  getBookingById: async (id:string) => {
    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            room: {
            include: {
                hotel: {
                include: {
                    images: {
                    where: { isPrimary: true },
                    take: 1,
                    },
                },
                },
                images: {
                take: 1,
                },
            },
            },
        },
    })
    if (!booking) throw new Error("Booking not found")
    return booking
  },
  cancelBooking: async (id:string, userId:string) => {
    const booking = await prisma.booking.findUnique({ where: { id } })
    if (!booking) throw new Error("Booking not found")
    if (booking.userId !== userId) throw new Error('Unauthorized')
    if (booking.status === "CANCELLED")
      throw new Error("Booking is already cancelled")
    if (booking.status === "COMPLETED")
        throw new Error("Completed bookings cannot be cancelled")
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    })
    return updatedBooking
  }
};
