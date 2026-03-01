import 'dotenv/config'
import { PrismaClient } from '../generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding...')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hotel.com' },
    update: {},
    create: {
      email: 'admin@hotel.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
      name: 'Admin',
      role: 'ADMIN',
    },
  })
  const hotel1 = await prisma.hotel.upsert({
    where: { id: 'hotel-1' },
    update: {},
    create: {
      id: 'hotel-1',
      name: 'Marriott Bangkok',
      description: 'Luxury hotel in the heart of Bangkok',
      address: '4 Sukhumvit Soi 2, Bangkok',
      city: 'Bangkok',
      country: 'Thailand',
      starRating: 5,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      latitude: 13.7398,
      longitude: 100.5596,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            isPrimary: true,
          },
          {
            url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
            isPrimary: false,
          },
        ],
      },
      amenities: {
        create: [
          { name: 'wifi' },
          { name: 'pool' },
          { name: 'gym' },
          { name: 'parking' },
          { name: 'restaurant' },
        ],
      },
      rooms: {
        create: [
          {
            name: 'Deluxe Room',
            description: 'Spacious room with city view',
            type: 'DELUXE',
            capacity: 2,
            pricePerNight: 3500,
            totalRooms: 10,
            images: {
              create: [
                {
                  url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304',
                },
              ],
            },
          },
          {
            name: 'Suite Room',
            description: 'Luxury suite with panoramic view',
            type: 'SUITE',
            capacity: 4,
            pricePerNight: 8000,
            totalRooms: 5,
            images: {
              create: [
                {
                  url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39',
                },
              ],
            },
          },
        ],
      },
    },
  })

  const hotel2 = await prisma.hotel.upsert({
    where: { id: 'hotel-2' },
    update: {},
    create: {
      id: 'hotel-2',
      name: 'Phuket Beach Resort',
      description: 'Beautiful beachfront resort in Phuket',
      address: '123 Patong Beach, Phuket',
      city: 'Phuket',
      country: 'Thailand',
      starRating: 4,
      checkInTime: '15:00',
      checkOutTime: '11:00',
      latitude: 7.8804,
      longitude: 98.2953,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
            isPrimary: true,
          },
        ],
      },
      amenities: {
        create: [
          { name: 'wifi' },
          { name: 'pool' },
          { name: 'beach access' },
          { name: 'spa' },
        ],
      },
      rooms: {
        create: [
          {
            name: 'Standard Room',
            description: 'Comfortable room with garden view',
            type: 'STANDARD',
            capacity: 2,
            pricePerNight: 1800,
            totalRooms: 20,
            images: {
              create: [
                {
                  url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf',
                },
              ],
            },
          },
          {
            name: 'Beach Villa',
            description: 'Private villa with direct beach access',
            type: 'VILLA',
            capacity: 6,
            pricePerNight: 15000,
            totalRooms: 3,
            images: {
              create: [
                {
                  url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6',
                },
              ],
            },
          },
        ],
      },
    },
  })

  console.log('✅ Seeded successfully')
  console.log(`Admin: admin@hotel.com / password`)
  console.log(`Hotels: ${hotel1.name}, ${hotel2.name}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())