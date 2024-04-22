import { IndependentRequest, IndependentResponse } from '../../@types'
import { httpStatusCodes } from '../../constants'
import { IAuthController } from '../../ports/controllers.ports'

class SignOutUseCase {
  execute () { }
}
class SignInUseCase {
  execute () { }
}
class SignUpUseCase {
  execute () { }
}

export class AuthController implements IAuthController {

  async logout (iRequest: IndependentRequest): Promise<IndependentResponse> {
    try {
      // const usecase = new SignOutUseCase()

      // const hasLogout = await usecase.execute()
      // if (hasLogout) {
      //   return { statusCode: httpStatusCodes.OK }
      // }

      return { statusCode: httpStatusCodes.UNPROCESSABLE_ENTITY }
    } catch (error) {
      console.error(error)
      return {
        statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          message: `${httpStatusCodes.getStatusText(httpStatusCodes.INTERNAL_SERVER_ERROR)}. Our team has already been notified and is working in a solution.`,
          when: new Date()
        }
      }
    }
  }

  async login (iRequest: IndependentRequest): Promise<IndependentResponse> {
    try {
      if (!iRequest.body?.username) {
        return { statusCode: httpStatusCodes.BAD_REQUEST   }
      }

      // const signInCase = new SignInUseCase()

      // const signInJWT = await signInCase.execute()
      // if (signInJWT) {
      //   return {
      //     statusCode: httpStatusCodes.OK,
      //     body: {
      //       token: signInJWT
      //     }
      //   }
      // }

      // const signUpCase = new SignUpUseCase()
      // const hasCreated = await signUpCase.execute()
      // if (hasCreated) {
      //   return this.login(iRequest)
      // }

      return { statusCode: httpStatusCodes.UNAUTHORIZED }
    } catch (error) {
      console.error(error)
      return {
        statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          message: `${httpStatusCodes.getStatusText(httpStatusCodes.INTERNAL_SERVER_ERROR)}. Our team has already been notified and is working in a solution.`,
          when: new Date()
        }
      }
    }
  }
}