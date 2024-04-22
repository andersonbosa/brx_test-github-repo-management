import { IndependentRequest, IndependentResponse } from '../../@types'
import { DependencyContainer } from '../../configs/dependency.config'
import { httpStatusCodes } from '../../constants'
import { CreateUserOrderUseCase } from '../../core/domain/usecases/create-user-order.usecase'
import { UserOrdersRepository } from '../../core/repositories/user-order.repository'
import { UserOrdersService } from '../../ports/services.ports'


export interface ICreateUserOrderInput {
  type: 'import' | 'export'
  data: any
}
export class UserOrdersController {
  constructor(
    private userOrdersRepo: UserOrdersRepository
  ) { }

  async createOrder (iRequest: IndependentRequest): Promise<IndependentResponse> {
    try {
      const { body } = iRequest
      if (!body) {
        return {
          statusCode: httpStatusCodes.NOT_FOUND,
          body: { error: 'Missing parameters to ICreateUserOrderInput' }
        }
      }
      const usecase = new CreateUserOrderUseCase(this.userOrdersRepo)
      const createdOrder = await usecase.execute(body as ICreateUserOrderInput)
      /* TODO Sent to queue to be processed */

      if (createdOrder) createdOrder.data = 'obfuscated'

      return {
        statusCode: httpStatusCodes.CREATED,
        body: { order: createdOrder }
      }
    } catch (error) {
      console.error('[UserOrdersController] Error creating order:', error)
      return {
        statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
        body: { error: 'Error creating order' }
      }
    }
  }

  async getOrder (iRequest: IndependentRequest): Promise<IndependentResponse> {
    try {
      const orderId = parseInt(iRequest.params?.id)
      const order = await this.userOrdersRepo.findById(orderId)
      if (!order) {
        return {
          statusCode: httpStatusCodes.NOT_FOUND,
          body: { error: 'Order not found' }
        }
      }
      return {
        statusCode: httpStatusCodes.OK,
        body: { order }
      }
    } catch (error) {
      console.error('[UserOrdersController] Error getting order:', error)
      return {
        statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
        body: { error: 'Error getting order' }
      }
    }
  }

  async updateOrder (iRequest: IndependentRequest): Promise<IndependentResponse> {
    try {
      const orderId = parseInt(iRequest.params?.id)
      const { type, data } = iRequest.body || {}
      const updatedOrder = await this.userOrdersRepo.update(orderId, { type, data })
      if (!updatedOrder) {
        return {
          statusCode: httpStatusCodes.NOT_FOUND,
          body: { error: 'Order not found' }
        }
      }
      return {
        statusCode: httpStatusCodes.OK,
        body: { order: updatedOrder }
      }
    } catch (error) {
      console.error('[UserOrdersController] Error updating order:', error)
      return {
        statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
        body: { error: 'Error updating order' }
      }
    }
  }

  async deleteOrder (iRequest: IndependentRequest): Promise<IndependentResponse> {
    try {
      const orderId = parseInt(iRequest.params?.id)
      const deletedOrder = await this.userOrdersRepo.delete(orderId)
      if (!deletedOrder) {
        return {
          statusCode: httpStatusCodes.NOT_FOUND,
          body: { error: 'Order not found' }
        }
      }
      return {
        statusCode: httpStatusCodes.OK,
        body: { message: 'Order deleted successfully' }
      }
    } catch (error) {
      console.error('[UserOrdersController] Error deleting order:', error)
      return {
        statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
        body: { error: 'Error deleting order' }
      }
    }
  }
}
