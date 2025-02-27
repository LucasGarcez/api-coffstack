// app/Shared/Middleware/RefreshTokenMiddleware.ts

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { DateTime } from 'luxon'
import { randomBytes } from 'crypto'

export default class RefreshTokenMiddleware {
  public async handle({ auth, request, response }: HttpContextContract, next: () => Promise<void>) {
    try {
      await next()
    } catch (error) {
      if (error.code === 'E_INVALID_API_TOKEN') {
        const refreshToken = request.input('refresh_token')

        if (!refreshToken) {
          return response.unauthorized({ message: 'Token inválido ou expirado' })
        }

        try {
          const user = await User.findByValidRefreshToken(refreshToken)

          if (!user) {
            return response.unauthorized({ message: 'Token inválido ou expirado' })
          }

          // Gere um novo refresh token e armazene no banco de dados
          const newRefreshToken = randomBytes(32).toString('hex')
          user.remember_me_token = newRefreshToken
          user.remember_me_token_created_at = DateTime.local()
          await user.save()

          const newToken = await auth.use('api').generate(user)

          response.ok({
            access_token: newToken.token,
            refresh_token: newRefreshToken,
          })
        } catch (error) {
          response.unauthorized({ message: 'Token inválido ou expirado' })
        }
      } else {
        throw error
      }
    }
  }
}
