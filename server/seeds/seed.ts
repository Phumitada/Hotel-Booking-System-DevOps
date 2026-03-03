import 'dotenv/config'
import { PrismaClient } from '../generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding massive data...')

  const hashedPassword = await bcrypt.hash('password123', 10)

  // ==================== USERS ====================
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@hotel.com' },
      update: { password: hashedPassword },
      create: { email: 'admin@hotel.com', password: hashedPassword, name: 'Admin', role: 'ADMIN' },
    }),
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: { password: hashedPassword },
      create: { email: 'john@example.com', password: hashedPassword, name: 'John Doe', role: 'USER' },
    }),
    prisma.user.upsert({
      where: { email: 'sarah@example.com' },
      update: { password: hashedPassword },
      create: { email: 'sarah@example.com', password: hashedPassword, name: 'Sarah Johnson', role: 'USER' },
    }),
    prisma.user.upsert({
      where: { email: 'mike@example.com' },
      update: { password: hashedPassword },
      create: { email: 'mike@example.com', password: hashedPassword, name: 'Mike Chen', role: 'USER' },
    }),
    prisma.user.upsert({
      where: { email: 'emma@example.com' },
      update: { password: hashedPassword },
      create: { email: 'emma@example.com', password: hashedPassword, name: 'Emma Wilson', role: 'USER' },
    }),
    prisma.user.upsert({
      where: { email: 'lucas@example.com' },
      update: { password: hashedPassword },
      create: { email: 'lucas@example.com', password: hashedPassword, name: 'Lucas Martin', role: 'USER' },
    }),
  ])

  console.log(`✅ Created ${users.length} users`)

  // ==================== HOTELS ====================
  const hotelsData = [
    // ── BANGKOK ──
    {
      id: 'hotel-bkk-1',
      name: 'The Athenee Hotel Bangkok',
      description: 'A luxury hotel set in a heritage building in the heart of Bangkok\'s embassy district, offering refined elegance and world-class service.',
      address: '61 Wireless Road, Lumpini, Pathumwan, Bangkok',
      city: 'Bangkok',
      country: 'Thailand',
      starRating: 5,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      latitude: 13.7400,
      longitude: 100.5500,
      images: [
        { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80', isPrimary: false },
        { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80', isPrimary: false },
      ],
      amenities: ['wifi', 'pool', 'gym', 'spa', 'restaurant', 'bar', 'concierge', 'valet parking'],
      rooms: [
        { id: 'room-bkk-1-1', name: 'Superior Room', description: 'Elegant room with city views and premium bedding', type: 'STANDARD', capacity: 2, pricePerNight: 3200, totalRooms: 15 },
        { id: 'room-bkk-1-2', name: 'Deluxe Room', description: 'Spacious room with upgraded amenities and garden view', type: 'DELUXE', capacity: 2, pricePerNight: 4500, totalRooms: 10 },
        { id: 'room-bkk-1-3', name: 'Junior Suite', description: 'Separate living area with panoramic Bangkok skyline views', type: 'SUITE', capacity: 3, pricePerNight: 7500, totalRooms: 6 },
        { id: 'room-bkk-1-4', name: 'Grand Suite', description: 'Luxurious suite with butler service and private terrace', type: 'SUITE', capacity: 4, pricePerNight: 14000, totalRooms: 3 },
      ],
    },
    {
      id: 'hotel-bkk-2',
      name: 'Marriott Marquis Queen\'s Park',
      description: 'A stunning 5-star hotel towering above Sukhumvit, featuring Bangkok\'s largest hotel ballroom and exceptional dining experiences.',
      address: '199 Sukhumvit Soi 22, Khlong Toei, Bangkok',
      city: 'Bangkok',
      country: 'Thailand',
      starRating: 5,
      checkInTime: '15:00',
      checkOutTime: '12:00',
      latitude: 13.7270,
      longitude: 100.5690,
      images: [
        { url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80', isPrimary: false },
      ],
      amenities: ['wifi', 'pool', 'gym', 'spa', 'restaurant', 'bar', 'kids club', 'business center'],
      rooms: [
        { id: 'room-bkk-2-1', name: 'Deluxe King Room', description: 'Modern room with king-size bed and city view', type: 'DELUXE', capacity: 2, pricePerNight: 3800, totalRooms: 20 },
        { id: 'room-bkk-2-2', name: 'Executive Suite', description: 'Premium suite with executive lounge access', type: 'SUITE', capacity: 3, pricePerNight: 8500, totalRooms: 8 },
        { id: 'room-bkk-2-3', name: 'Presidential Suite', description: 'The pinnacle of luxury with panoramic views of Bangkok', type: 'SUITE', capacity: 6, pricePerNight: 35000, totalRooms: 1 },
      ],
    },
    {
      id: 'hotel-bkk-3',
      name: 'Novotel Bangkok Sukhumvit 20',
      description: 'Contemporary 4-star hotel in the vibrant Sukhumvit area, perfect for both business and leisure travelers.',
      address: '19/9 Sukhumvit Soi 20, Khlong Toei, Bangkok',
      city: 'Bangkok',
      country: 'Thailand',
      starRating: 4,
      checkInTime: '14:00',
      checkOutTime: '11:00',
      latitude: 13.7300,
      longitude: 100.5650,
      images: [
        { url: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&q=80', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80', isPrimary: false },
      ],
      amenities: ['wifi', 'pool', 'gym', 'restaurant', 'bar', 'business center'],
      rooms: [
        { id: 'room-bkk-3-1', name: 'Superior Room', description: 'Comfortable room with modern amenities', type: 'STANDARD', capacity: 2, pricePerNight: 1800, totalRooms: 25 },
        { id: 'room-bkk-3-2', name: 'Deluxe Room', description: 'Upgraded room with premium toiletries', type: 'DELUXE', capacity: 2, pricePerNight: 2400, totalRooms: 15 },
        { id: 'room-bkk-3-3', name: 'Suite', description: 'Spacious suite ideal for extended stays', type: 'SUITE', capacity: 4, pricePerNight: 5500, totalRooms: 5 },
      ],
    },
    {
      id: 'hotel-bkk-4',
      name: 'Ibis Bangkok Riverside',
      description: 'Budget-friendly hotel on the Chao Phraya riverside, offering comfortable rooms and easy access to Bangkok\'s top attractions.',
      address: '27 Charoen Nakhon Road, Khlong San, Bangkok',
      city: 'Bangkok',
      country: 'Thailand',
      starRating: 3,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      latitude: 13.7200,
      longitude: 100.5000,
      images: [
        { url: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80', isPrimary: true },
      ],
      amenities: ['wifi', 'restaurant', 'bar', 'laundry'],
      rooms: [
        { id: 'room-bkk-4-1', name: 'Standard Room', description: 'Cozy room with essential amenities', type: 'STANDARD', capacity: 2, pricePerNight: 900, totalRooms: 30 },
        { id: 'room-bkk-4-2', name: 'Family Room', description: 'Larger room perfect for families', type: 'DELUXE', capacity: 4, pricePerNight: 1400, totalRooms: 10 },
      ],
    },

    // ── PHUKET ──
    {
      id: 'hotel-pkt-1',
      name: 'Amanpuri Resort Phuket',
      description: 'Legendary ultra-luxury resort perched on a private headland with breathtaking Andaman Sea views and Thai pavilion villas.',
      address: 'Pansea Beach, Choeng Thale, Thalang, Phuket',
      city: 'Phuket',
      country: 'Thailand',
      starRating: 5,
      checkInTime: '15:00',
      checkOutTime: '12:00',
      latitude: 8.0300,
      longitude: 98.2800,
      images: [
        { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80', isPrimary: false },
        { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', isPrimary: false },
      ],
      amenities: ['wifi', 'private beach', 'pool', 'spa', 'restaurant', 'bar', 'water sports', 'yoga'],
      rooms: [
        { id: 'room-pkt-1-1', name: 'Thai Pavilion', description: 'Private pavilion surrounded by coconut palms with sea glimpses', type: 'VILLA', capacity: 2, pricePerNight: 25000, totalRooms: 10 },
        { id: 'room-pkt-1-2', name: 'Pool Pavilion', description: 'Private pavilion with personal infinity pool overlooking the Andaman', type: 'VILLA', capacity: 2, pricePerNight: 45000, totalRooms: 5 },
        { id: 'room-pkt-1-3', name: 'Ocean Villa', description: 'Dramatic clifftop villa with direct ocean views and private pool', type: 'VILLA', capacity: 4, pricePerNight: 85000, totalRooms: 3 },
      ],
    },
    {
      id: 'hotel-pkt-2',
      name: 'Patong Beach Hotel',
      description: 'Centrally located resort in the heart of Patong Beach, steps away from nightlife, shopping, and the beach.',
      address: '94 Thaweewong Road, Patong, Kathu, Phuket',
      city: 'Phuket',
      country: 'Thailand',
      starRating: 4,
      checkInTime: '14:00',
      checkOutTime: '11:00',
      latitude: 7.8950,
      longitude: 98.2970,
      images: [
        { url: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80', isPrimary: false },
      ],
      amenities: ['wifi', 'pool', 'beach access', 'restaurant', 'bar', 'gym'],
      rooms: [
        { id: 'room-pkt-2-1', name: 'Garden View Room', description: 'Comfortable room with tropical garden views', type: 'STANDARD', capacity: 2, pricePerNight: 1600, totalRooms: 20 },
        { id: 'room-pkt-2-2', name: 'Sea View Deluxe', description: 'Stunning room with direct Patong Bay views', type: 'DELUXE', capacity: 2, pricePerNight: 2800, totalRooms: 12 },
        { id: 'room-pkt-2-3', name: 'Beachfront Suite', description: 'Luxurious suite steps from the beach', type: 'SUITE', capacity: 4, pricePerNight: 6000, totalRooms: 4 },
      ],
    },
    {
      id: 'hotel-pkt-3',
      name: 'Kata Rocks Resort',
      description: 'Award-winning luxury clifftop resort above Kata Beach, combining contemporary Thai design with breathtaking panoramic views.',
      address: '186/22 Kok Tanod Road, Kata, Mueang, Phuket',
      city: 'Phuket',
      country: 'Thailand',
      starRating: 5,
      checkInTime: '15:00',
      checkOutTime: '12:00',
      latitude: 7.8200,
      longitude: 98.2980,
      images: [
        { url: 'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=800&q=80', isPrimary: true },
      ],
      amenities: ['wifi', 'infinity pool', 'spa', 'restaurant', 'bar', 'beach club', 'concierge'],
      rooms: [
        { id: 'room-pkt-3-1', name: 'Sky Villa', description: 'Modernist villa with private plunge pool and sea views', type: 'VILLA', capacity: 2, pricePerNight: 18000, totalRooms: 8 },
        { id: 'room-pkt-3-2', name: 'Grand Sky Villa', description: 'Expansive villa with two levels and panoramic Andaman views', type: 'VILLA', capacity: 4, pricePerNight: 32000, totalRooms: 4 },
      ],
    },

    // ── CHIANG MAI ──
    {
      id: 'hotel-cnx-1',
      name: 'Anantara Chiang Mai Resort',
      description: 'Riverside luxury resort set amidst lush tropical gardens, offering a serene retreat inspired by the ancient trading history of Chiang Mai.',
      address: '123-123/1 Charoen Prathet Road, Chang Klan, Chiang Mai',
      city: 'Chiang Mai',
      country: 'Thailand',
      starRating: 5,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      latitude: 18.7800,
      longitude: 99.0000,
      images: [
        { url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1508670072-85b40f55e53e?w=800&q=80', isPrimary: false },
      ],
      amenities: ['wifi', 'pool', 'spa', 'restaurant', 'bar', 'cooking class', 'cycling', 'concierge'],
      rooms: [
        { id: 'room-cnx-1-1', name: 'Deluxe Room', description: 'Garden or pool view room with Thai-inspired décor', type: 'DELUXE', capacity: 2, pricePerNight: 4200, totalRooms: 12 },
        { id: 'room-cnx-1-2', name: 'Lanna Suite', description: 'Spacious suite reflecting the Lanna Kingdom heritage', type: 'SUITE', capacity: 3, pricePerNight: 8000, totalRooms: 6 },
        { id: 'room-cnx-1-3', name: 'Riverside Villa', description: 'Private villa with direct Ping River access and plunge pool', type: 'VILLA', capacity: 4, pricePerNight: 18000, totalRooms: 3 },
      ],
    },
    {
      id: 'hotel-cnx-2',
      name: 'Ping Nakara Boutique Hotel',
      description: 'A charming colonial-style boutique hotel in the heart of Chiang Mai\'s Old City, blending Lanna heritage with contemporary luxury.',
      address: '135/9 Charoen Prathet Road, Chang Klan, Chiang Mai',
      city: 'Chiang Mai',
      country: 'Thailand',
      starRating: 4,
      checkInTime: '14:00',
      checkOutTime: '11:00',
      latitude: 18.7850,
      longitude: 98.9980,
      images: [
        { url: 'https://images.unsplash.com/photo-1587731556938-38755b4803a6?w=800&q=80', isPrimary: true },
      ],
      amenities: ['wifi', 'pool', 'restaurant', 'bar', 'bicycle rental', 'concierge'],
      rooms: [
        { id: 'room-cnx-2-1', name: 'Heritage Room', description: 'Elegant room with antique furnishings and garden view', type: 'STANDARD', capacity: 2, pricePerNight: 2200, totalRooms: 10 },
        { id: 'room-cnx-2-2', name: 'Deluxe Pool View', description: 'Room with private balcony overlooking the pool', type: 'DELUXE', capacity: 2, pricePerNight: 3200, totalRooms: 6 },
        { id: 'room-cnx-2-3', name: 'Nakara Suite', description: 'Grand suite with separate living room and claw-foot bathtub', type: 'SUITE', capacity: 3, pricePerNight: 6500, totalRooms: 3 },
      ],
    },
    {
      id: 'hotel-cnx-3',
      name: 'Green Valley Resort Chiang Mai',
      description: 'A peaceful resort surrounded by rice fields and mountains, offering authentic Northern Thai experiences.',
      address: '99 Mae Rim - Samoeng Road, Mae Rim, Chiang Mai',
      city: 'Chiang Mai',
      country: 'Thailand',
      starRating: 3,
      checkInTime: '13:00',
      checkOutTime: '11:00',
      latitude: 18.9100,
      longitude: 98.9600,
      images: [
        { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', isPrimary: true },
      ],
      amenities: ['wifi', 'pool', 'restaurant', 'cycling', 'trekking', 'yoga'],
      rooms: [
        { id: 'room-cnx-3-1', name: 'Garden Bungalow', description: 'Cozy bungalow with mountain views', type: 'STANDARD', capacity: 2, pricePerNight: 1200, totalRooms: 15 },
        { id: 'room-cnx-3-2', name: 'Family Bungalow', description: 'Larger bungalow perfect for families', type: 'DELUXE', capacity: 4, pricePerNight: 1900, totalRooms: 8 },
      ],
    },

    // ── PATTAYA ──
    {
      id: 'hotel-pty-1',
      name: 'Dusit Thani Pattaya',
      description: 'Iconic clifftop resort overlooking the Gulf of Thailand, offering exceptional Thai hospitality and stunning panoramic sea views.',
      address: '240/2 Pattaya Beach Road, Nong Prue, Bang Lamung, Pattaya',
      city: 'Pattaya',
      country: 'Thailand',
      starRating: 5,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      latitude: 12.9270,
      longitude: 100.8800,
      images: [
        { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=800&q=80', isPrimary: false },
      ],
      amenities: ['wifi', 'pool', 'gym', 'spa', 'restaurant', 'bar', 'beach access', 'tennis'],
      rooms: [
        { id: 'room-pty-1-1', name: 'Deluxe Sea View', description: 'Beautiful room with unobstructed Gulf of Thailand views', type: 'DELUXE', capacity: 2, pricePerNight: 3500, totalRooms: 15 },
        { id: 'room-pty-1-2', name: 'Club Suite', description: 'Elegant suite with club lounge access and sea panorama', type: 'SUITE', capacity: 3, pricePerNight: 7500, totalRooms: 8 },
        { id: 'room-pty-1-3', name: 'Royal Suite', description: 'Lavish suite fit for royalty with private pool', type: 'SUITE', capacity: 4, pricePerNight: 20000, totalRooms: 2 },
      ],
    },
    {
      id: 'hotel-pty-2',
      name: 'Hard Rock Hotel Pattaya',
      description: 'Rock-themed lifestyle hotel on Pattaya Beach with legendary entertainment, multiple pools, and vibrant atmosphere.',
      address: '429 Moo 9 Pattaya Beach Road, Nong Prue, Bang Lamung, Pattaya',
      city: 'Pattaya',
      country: 'Thailand',
      starRating: 4,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      latitude: 12.9200,
      longitude: 100.8750,
      images: [
        { url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80', isPrimary: true },
      ],
      amenities: ['wifi', 'pool', 'gym', 'restaurant', 'bar', 'beach access', 'live music'],
      rooms: [
        { id: 'room-pty-2-1', name: 'Rock Royalty Room', description: 'Stylish room with rock memorabilia and city view', type: 'STANDARD', capacity: 2, pricePerNight: 1800, totalRooms: 20 },
        { id: 'room-pty-2-2', name: 'Deluxe Sea View', description: 'Premium room with Pattaya Bay views', type: 'DELUXE', capacity: 2, pricePerNight: 2600, totalRooms: 12 },
        { id: 'room-pty-2-3', name: 'Rock Suite', description: 'Iconic suite with ultimate rock star experience', type: 'SUITE', capacity: 4, pricePerNight: 6500, totalRooms: 5 },
      ],
    },

    // ── KRABI ──
    {
      id: 'hotel-krb-1',
      name: 'Rayavadee Resort Krabi',
      description: 'Exceptional award-winning resort nestled among Krabi\'s dramatic limestone formations, with private beach access and stunning natural scenery.',
      address: '214 Moo 2, Ao Nang, Mueang Krabi, Krabi',
      city: 'Krabi',
      country: 'Thailand',
      starRating: 5,
      checkInTime: '15:00',
      checkOutTime: '12:00',
      latitude: 8.0150,
      longitude: 98.8300,
      images: [
        { url: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&q=80', isPrimary: true },
      ],
      amenities: ['wifi', 'private beach', 'pool', 'spa', 'restaurant', 'bar', 'kayaking', 'snorkeling'],
      rooms: [
        { id: 'room-krb-1-1', name: 'Garden Pavilion', description: 'Circular pavilion surrounded by lush tropical gardens', type: 'VILLA', capacity: 2, pricePerNight: 15000, totalRooms: 8 },
        { id: 'room-krb-1-2', name: 'Cliff Pavilion', description: 'Dramatic clifftop pavilion with Andaman Sea panoramas', type: 'VILLA', capacity: 2, pricePerNight: 22000, totalRooms: 5 },
        { id: 'room-krb-1-3', name: 'Beach Pavilion', description: 'Beachfront pavilion with direct access to private beach', type: 'VILLA', capacity: 4, pricePerNight: 38000, totalRooms: 3 },
      ],
    },
    {
      id: 'hotel-krb-2',
      name: 'Ao Nang Cliff Beach Resort',
      description: 'Cliff-side resort overlooking the Andaman Sea with stunning views of the iconic limestone islands.',
      address: '301 Moo 2, Ao Nang, Mueang Krabi, Krabi',
      city: 'Krabi',
      country: 'Thailand',
      starRating: 4,
      checkInTime: '14:00',
      checkOutTime: '11:00',
      latitude: 8.0300,
      longitude: 98.8330,
      images: [
        { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', isPrimary: true },
      ],
      amenities: ['wifi', 'infinity pool', 'restaurant', 'bar', 'snorkeling tours'],
      rooms: [
        { id: 'room-krb-2-1', name: 'Sea View Room', description: 'Room with spectacular views of Ao Nang Bay', type: 'STANDARD', capacity: 2, pricePerNight: 2200, totalRooms: 15 },
        { id: 'room-krb-2-2', name: 'Deluxe Sea View', description: 'Premium room with larger balcony and sea views', type: 'DELUXE', capacity: 2, pricePerNight: 3200, totalRooms: 10 },
        { id: 'room-krb-2-3', name: 'Cliff Suite', description: 'Stunning suite carved into the clifftop', type: 'SUITE', capacity: 3, pricePerNight: 7000, totalRooms: 4 },
      ],
    },

    // ── HUA HIN ──
    {
      id: 'hotel-hhn-1',
      name: 'Centara Grand Beach Resort Hua Hin',
      description: 'Thailand\'s most iconic resort, a historic colonial masterpiece sitting gracefully on Hua Hin\'s prime beachfront since 1923.',
      address: '1 Damnernkasem Road, Hua Hin, Prachuap Khiri Khan',
      city: 'Hua Hin',
      country: 'Thailand',
      starRating: 5,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      latitude: 12.5700,
      longitude: 99.9580,
      images: [
        { url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80', isPrimary: true },
      ],
      amenities: ['wifi', 'beach access', 'pool', 'spa', 'restaurant', 'bar', 'tennis', 'gym', 'kids club'],
      rooms: [
        { id: 'room-hhn-1-1', name: 'Classic Room', description: 'Historic room with colonial-era charm', type: 'STANDARD', capacity: 2, pricePerNight: 4500, totalRooms: 20 },
        { id: 'room-hhn-1-2', name: 'Deluxe Sea View', description: 'Elegant room with unobstructed Gulf of Thailand views', type: 'DELUXE', capacity: 2, pricePerNight: 6500, totalRooms: 12 },
        { id: 'room-hhn-1-3', name: 'Presidential Suite', description: 'The grandest suite in Hua Hin with private terrace', type: 'SUITE', capacity: 4, pricePerNight: 25000, totalRooms: 2 },
      ],
    },
    {
      id: 'hotel-hhn-2',
      name: 'Baan Bayan Beach Hotel',
      description: 'Charming boutique hotel in a restored colonial mansion on the beach, offering intimate luxury and personalized service.',
      address: '119 Petchkasem Road, Hua Hin, Prachuap Khiri Khan',
      city: 'Hua Hin',
      country: 'Thailand',
      starRating: 4,
      checkInTime: '14:00',
      checkOutTime: '11:00',
      latitude: 12.5600,
      longitude: 99.9580,
      images: [
        { url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80', isPrimary: true },
      ],
      amenities: ['wifi', 'beach access', 'pool', 'restaurant', 'bar', 'bicycle rental'],
      rooms: [
        { id: 'room-hhn-2-1', name: 'Colonial Room', description: 'Charming room with vintage furnishings', type: 'STANDARD', capacity: 2, pricePerNight: 2800, totalRooms: 12 },
        { id: 'room-hhn-2-2', name: 'Beachfront Suite', description: 'Suite with private terrace steps from the beach', type: 'SUITE', capacity: 3, pricePerNight: 7500, totalRooms: 4 },
      ],
    },
  ]

  // Create hotels
  for (const hotelData of hotelsData) {
    const { images, amenities, rooms, ...hotel } = hotelData

    await prisma.hotel.upsert({
      where: { id: hotel.id },
      update: {},
      create: {
        ...hotel,
        images: {
          create: images,
        },
        amenities: {
          create: amenities.map(name => ({ name })),
        },
        rooms: {
          create: rooms.map(({ id, ...room }) => ({
            id,
            ...room,
            images: {
              create: [
                { url: `https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80` },
              ],
            },
          })),
        },
      },
    })

    console.log(`✅ Created hotel: ${hotel.name}`)
  }

  console.log('\n🎉 Seed completed!')
  console.log('─────────────────────────────')
  console.log('👤 Admin:  admin@hotel.com / password123')
  console.log('👤 Users:  john@example.com / password123')
  console.log('           sarah@example.com / password123')
  console.log('           mike@example.com / password123')
  console.log(`🏨 Hotels: ${hotelsData.length} hotels created`)
  console.log(`🏙  Cities: Bangkok, Phuket, Chiang Mai, Pattaya, Krabi, Hua Hin`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())