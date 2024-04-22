import { UserOrdersRepository } from '../../repositories/user-order.repository'
import { UserOrderEntity } from '../entities/user-order.entity'

export class GetUserOrderUseCase {
    constructor(private userOrdersRepository: UserOrdersRepository) {}

    async execute(orderId: number): Promise<UserOrderEntity | null> {
        return this.userOrdersRepository.findById(orderId);
    }
}
