import { IndependentRequest, IndependentResponse } from '../../@types'
import { httpStatusCodes } from '../../constants'
import { HealthCheckUsecase } from '../../core/domain/usecases/healthcheck.usecase'

export class HealthCheckController {
  async execute (_: IndependentRequest): Promise<IndependentResponse> {
    try {
      const independentResponse = await new HealthCheckUsecase().execute()

      return independentResponse
    } catch (error) {
      console.error(error)

      return {
        statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          status: true,
          message: `${httpStatusCodes.getStatusText(httpStatusCodes.INTERNAL_SERVER_ERROR)}. Our team has already been notified and is working in a solution.`,
          when: new Date()
        }
      }
    }
  }
}