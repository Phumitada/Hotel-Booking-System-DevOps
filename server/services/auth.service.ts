import bcrypt from 'bcryptjs'
import { prisma } from '../db/prisma'
import redis from '../db/redis'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../lib/token'
import type { LoginPayload, RegisterPayload } from '../types/auth.type'

export const authService = {
  register: async (payload: RegisterPayload) => {
    const existing = await prisma.user.findUnique({
      where: { email: payload.email },
    })

    if (existing) {
      throw new Error('Email already in use')
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10)

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return { user, accessToken, refreshToken }
  },

  login: async (payload: LoginPayload) => {
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    })

    if (!user) {
      throw new Error('Username not existed')
    }

    const isMatch = await bcrypt.compare(payload.password, user.password)

    if (!isMatch) {
      throw new Error('Incorrect password')
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const { password: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword, accessToken, refreshToken }
  },

  refresh: async (refreshToken: string) => {
    const isBlacklisted = await redis.get(`blacklist:${refreshToken}`)
    if (isBlacklisted) {
      throw new Error('Token has been revoked')
    }

    const payload = verifyRefreshToken(refreshToken)

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      throw new Error('User not found')
    }
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const newRefreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
    await redis.setex(`blacklist:${refreshToken}`, 60 * 60 * 24 * 7, 'true')

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  },

  logout: async (refreshToken: string) => {
    await redis.setex(`blacklist:${refreshToken}`, 60 * 60 * 24 * 7, 'true')
  },
}