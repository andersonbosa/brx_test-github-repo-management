import { IndependentRequest, IndependentResponse } from '../@types'

export interface IAuthController {
  login (iRequest: IndependentRequest): Promise<IndependentResponse>
  logout (iRequest: IndependentRequest): Promise<IndependentResponse>
}