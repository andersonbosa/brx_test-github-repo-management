import { ZodError } from 'zod'
import { IndependentRequest, IndependentResponse } from '../../@types'
import { ICreateUserOrderInput } from '../../@types/inputs'
import { AppConfig } from '../../configs/app.config'
import { httpStatusCodes } from '../../constants'
import { CreateUserOrderInputSchema, FindByIdUserOrderInputSchema, createZodResponse, } from '../../core/domain/schemas'
import { CreateUserOrderUseCase } from '../../core/domain/usecases/create-user-order.usecase'
import { ProduceMessageToExchange, RabbitMQExchangeAdapter } from '../../core/repositories/queue.repository'
import { UserOrdersRepository } from '../../core/repositories/user-order.repository'


export class UserOrdersController {
  constructor(
    private userOrdersRepo: UserOrdersRepository
  ) { }

  async createOrder (iRequest: IndependentRequest): Promise<IndependentResponse> {
    try {
      const input = CreateUserOrderInputSchema.parse(iRequest.body)
      const createUserOrder = new CreateUserOrderUseCase(this.userOrdersRepo)
      const createdOrder = await createUserOrder.execute(input as ICreateUserOrderInput)
      if (!createdOrder) throw new Error('Can not create the order')
      delete createdOrder.data

      /* melhoria: injetar dependencia via DependencyContainer */
      new ProduceMessageToExchange(new RabbitMQExchangeAdapter(AppConfig.rabbitmq.connectionString, 'work.main.exchange', 'topic', { durable: true }))
        .execute(createdOrder, `task.${createdOrder.type}`)

      return {
        statusCode: httpStatusCodes.CREATED,
        body: { order: createdOrder, }
      }

    } catch (error) {
      const errMessage = 'Error creating order'
      console.error(`[${__filename}]`, errMessage, error)

      if (error instanceof ZodError) { return createZodResponse(errMessage, error) }

      return {
        statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
        body: { error: `${errMessage}. Our team has already been notified and is working on this incident.` }
      }
    }
  }

  async getOrder (iRequest: IndependentRequest): Promise<IndependentResponse> {
    try {
      const input = FindByIdUserOrderInputSchema.parse(iRequest.params)
      const order = await this.userOrdersRepo.findById(input.id)
      /* TODO usecase */
      
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
      const errMessage = 'Error getting order'
      console.error(`[${__filename}]`, errMessage, error)
      if (error instanceof ZodError) { return createZodResponse(errMessage, error) }
      return {
        statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
        body: { error: `${errMessage}. Our team has already been notified and is working on this incident.` }
      }
    }
  }

  async updateOrder (iRequest: IndependentRequest): Promise<IndependentResponse> {
    try {
      const { id } = FindByIdUserOrderInputSchema.parse(iRequest.params)
      const orderBody = CreateUserOrderInputSchema.parse(iRequest.body)
      const updatedOrder = await this.userOrdersRepo.update(id, orderBody)
      /* TODO usecase */

      if (!updatedOrder) {
        return {
          statusCode: httpStatusCodes.NOT_FOUND,
          body: { error: 'Order not found' }
        }
      }
      return {
        statusCode: httpStatusCodes.OK,
        body: {
          order: updatedOrder
        }
      }
    } catch (error) {
      const errMessage = 'Error updating order'
      console.error(`[${__filename}]`, errMessage, error)
      if (error instanceof ZodError) { return createZodResponse(errMessage, error) }
      return {
        statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
        body: { error: `${errMessage}. Our team has already been notified and is working on this incident.` }
      }
    }
  }

  async deleteOrder (iRequest: IndependentRequest): Promise<IndependentResponse> {
    try {
      const orderId = parseInt(iRequest.params?.id)
      const deletedOrder = await this.userOrdersRepo.delete(orderId)
      /* TODO usecase */
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
      const errMessage = 'Error deleting order'
      console.error(`[${__filename}]`, errMessage, error)
      if (error instanceof ZodError) { return createZodResponse(errMessage, error) }
      return {
        statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
        body: { error: `${errMessage}. Our team has already been notified and is working on this incident.` }
      }
    }
  }
}
