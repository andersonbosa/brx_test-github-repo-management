import { NextFunction, Request, Response } from 'express'
import { httpStatusCodes } from '../../../../constants'

export const AuthenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token || (token && token !== 'faketoken')) {
      return res
        .status(httpStatusCodes.UNAUTHORIZED)
        .json({ error: httpStatusCodes.getStatusText(httpStatusCodes.UNAUTHORIZED) })
    }

    // Verificar se o token JWT é válido
    // const authService = new AuthenticationService(IndexConfig.security.jwtSecret, UserRepository)
    // const validToken = await authService.verifyToken(token)
    // if (!validToken) {
    //   return res
    //     .status(httpStatusCodes.UNAUTHORIZED)
    //     .json({ error: httpStatusCodes.getStatusText(httpStatusCodes.UNAUTHORIZED) })
    // }

    next()
  } catch (error) {
    console.error('authenticate.Error authenticating user:', error)
    return res
      .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: httpStatusCodes.getStatusText(httpStatusCodes.INTERNAL_SERVER_ERROR) })
  }
}
