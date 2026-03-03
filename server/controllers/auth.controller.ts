import { Request, Response } from 'express'
import { authService } from '../services/auth.service'
import { AuthRequest } from '../middleware/auth.middleware'

const REFRESH_TOKEN_COOKIE = 'refreshToken'

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 24 * 7 * 1000,
}

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { user, accessToken, refreshToken } = await authService.register(req.body)

      res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions)

      res.status(201).json({
        success: true,
        data: { user, accessToken },
      })
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message })
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { user, accessToken, refreshToken } = await authService.login(req.body)

      res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions)

      res.status(200).json({
        success: true,
        data: { user, accessToken },
      })
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message })
    }
  },

  refresh: async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE]

      if (!refreshToken) {
        res.status(401).json({ success: false, message: 'No refresh token' })
        return
      }

      const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken)

      res.cookie(REFRESH_TOKEN_COOKIE, newRefreshToken, cookieOptions)

      res.status(200).json({
        success: true,
        data: { accessToken },
      })
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message })
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE]

      if (refreshToken) {
        await authService.logout(refreshToken)
      }

      res.clearCookie(REFRESH_TOKEN_COOKIE)

      res.status(200).json({ success: true, message: 'Logged out' })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  me: async (req: Request, res: Response) => {
    const user = (req as AuthRequest).user
    if (!user) {
      res.status(200).json({ success: true, data: null })
      return
    }
    res.status(200).json({ success: true, data: user })
  }
}