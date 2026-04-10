import Omise from "omise"
import dotenv from 'dotenv'

dotenv.config();

const omise = Omise({
  publicKey: process.env.OMISE_PUBLIC_KEY!,
  secretKey: process.env.OMISE_SECRET_KEY!,
});

export const Payment = {
  createCharge: async (payload: {
    amount: number
    return_uri: string
    token?: string      
    source?: string   
    type?: string      
  }) => {
    let chargePayload: any = {
      amount: payload.amount,
      currency: 'thb',
      return_uri: payload.return_uri,
    }

    if (payload.token) {
      chargePayload.card = payload.token
    } else if (payload.source && payload.type === 'promptpay') {
      const source = await omise.sources.create({
        type: 'promptpay',
        amount: payload.amount,
        currency: 'thb',
      })
      chargePayload.source = source.id
    } else if (payload.source && payload.type === 'internet_banking') {
      const source = await omise.sources.create({
        type: `internet_banking_${payload.source}` as any, 
        amount: payload.amount,
        currency: 'thb',
      })
      chargePayload.source = source.id
    }

    const charge = await omise.charges.create(chargePayload)

    if (charge.status === "failed") {
      throw new Error(charge.failure_message || "Payment Failed")
    }

    return charge
  },

  getCharge: async (chargeId: string) => {
    return await omise.charges.retrieve(chargeId)
  }
}