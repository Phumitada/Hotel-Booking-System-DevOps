export const getMinPrice = (rooms: { pricePerNight: number }[]) => {
    if (!rooms?.length) return null
    return Math.min(...rooms.map(r => r.pricePerNight))
  }