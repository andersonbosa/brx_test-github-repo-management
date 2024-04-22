import { IndependentResponse } from '../../../@types'
import { httpStatusCodes } from '../../../constants'

interface HealthCheckResponse extends IndependentResponse {
  body: {
    status: boolean
    when: Date
  }
}

export class HealthCheckUsecase {
  async execute (): Promise<HealthCheckResponse> {
    return {
      statusCode: httpStatusCodes.OK,
      body: {
        status: true,
        when: new Date()
      }
    }
  }
}
