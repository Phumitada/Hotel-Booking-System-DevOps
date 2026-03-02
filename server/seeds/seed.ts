import "dotenv/config";
import { PrismaClient } from "../generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "admin@hotel.com" },
    update: {},
    create: {
      email: "admin@hotel.com",
      password: hashedPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@hotel.com" },
    update: {},
    create: {
      email: "user@hotel.com",
      password: hashedPassword,
      name: "John Doe",
      role: "USER",
    },
  });

  await prisma.hotel.upsert({
    where: { id: "hotel-bkk-1" },
    update: {},
    create: {
      id: "hotel-bkk-1",
      name: "Marriott Bangkok Sukhumvit",
      description:
        "Luxury hotel in the heart of Bangkok with stunning city views.",
      address: "4 Sukhumvit Soi 2, Klongtoey, Bangkok",
      city: "Bangkok",
      country: "Thailand",
      starRating: 5,
      checkInTime: "14:00",
      checkOutTime: "12:00",
      latitude: 13.7398,
      longitude: 100.5596,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
            isPrimary: true,
          },
          {
            url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
            isPrimary: false,
          },
        ],
      },
      amenities: {
        create: [
          { name: "wifi" },
          { name: "pool" },
          { name: "gym" },
          { name: "parking" },
          { name: "restaurant" },
          { name: "spa" },
        ],
      },
      rooms: {
        create: [
          {
            id: "room-bkk-1",
            name: "Deluxe Room",
            description: "Spacious room with city view and king-size bed",
            type: "DELUXE",
            capacity: 2,
            pricePerNight: 3500,
            totalRooms: 3,
            images: {
              create: [
                {
                  url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
                },
              ],
            },
          },
          {
            id: "room-bkk-2",
            name: "Superior Suite",
            description: "Luxury suite with separate living area",
            type: "SUITE",
            capacity: 3,
            pricePerNight: 6500,
            totalRooms: 2,
            images: {
              create: [
                {
                  url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.hotel.upsert({
    where: { id: "hotel-pkt-1" },
    update: {},
    create: {
      id: "hotel-pkt-1",
      name: "Phuket Beach Resort & Spa",
      description: "Beachfront resort with stunning Andaman Sea views.",
      address: "123 Patong Beach Road, Kathu, Phuket",
      city: "Phuket",
      country: "Thailand",
      starRating: 4,
      checkInTime: "15:00",
      checkOutTime: "11:00",
      latitude: 7.8804,
      longitude: 98.2953,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
            isPrimary: true,
          },
        ],
      },
      amenities: {
        create: [
          { name: "wifi" },
          { name: "pool" },
          { name: "beach access" },
          { name: "spa" },
        ],
      },
      rooms: {
        create: [
          {
            id: "room-pkt-1",
            name: "Standard Garden Room",
            description: "Comfortable room with garden view",
            type: "STANDARD",
            capacity: 2,
            pricePerNight: 1800,
            totalRooms: 5,
            images: {
              create: [
                {
                  url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
                },
              ],
            },
          },
          {
            id: "room-pkt-2",
            name: "Beach Villa",
            description: "Private villa with direct beach access",
            type: "VILLA",
            capacity: 6,
            pricePerNight: 15000,
            totalRooms: 2,
            images: {
              create: [
                {
                  url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800",
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.hotel.upsert({
    where: { id: "hotel-cnx-1" },
    update: {},
    create: {
      id: "hotel-cnx-1",
      name: "Chiang Mai Boutique Hotel",
      description: "Charming boutique hotel in the old city.",
      address: "88 Ratchadamnoen Road, Phra Singh, Chiang Mai",
      city: "Chiang Mai",
      country: "Thailand",
      starRating: 3,
      checkInTime: "13:00",
      checkOutTime: "11:00",
      latitude: 18.7883,
      longitude: 98.9853,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
            isPrimary: true,
          },
        ],
      },
      amenities: {
        create: [
          { name: "wifi" },
          { name: "pool" },
          { name: "restaurant" },
          { name: "bicycle rental" },
        ],
      },
      rooms: {
        create: [
          {
            id: "room-cnx-1",
            name: "Standard Room",
            description: "Cozy room with traditional Thai decor",
            type: "STANDARD",
            capacity: 2,
            pricePerNight: 900,
            totalRooms: 5,
            images: {
              create: [
                {
                  url: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Seed completed!");
  console.log("Admin: admin@hotel.com / password123");
  console.log("User: user@hotel.com / password123");
  console.log("Hotels: hotel-bkk-1, hotel-pkt-1, hotel-cnx-1");
  console.log(
    "Rooms: room-bkk-1, room-bkk-2, room-pkt-1, room-pkt-2, room-cnx-1"
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
