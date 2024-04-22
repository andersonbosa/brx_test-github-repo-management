import { ICreateUserOrderInput } from '../../../adapters/controllers/user-orders.controller'
import { UserOrdersRepository } from '../../repositories/user-order.repository'
import { UserOrderEntity } from '../entities/user-order.entity'


export class CreateUserOrderUseCase {
  constructor(private userOrdersRepository: UserOrdersRepository) { }

  async execute (input: ICreateUserOrderInput): Promise<UserOrderEntity | null> {
    const order = await this.userOrdersRepository.create(input)
    return order
  }
}
