import { ICreateUserOrderInput } from '../../@types/inputs'
import { UserOrderEntity } from '../domain/entities/user-order.entity'

export interface UserOrdersRepository {
  findAll (): Promise<UserOrderEntity[]>
  findById (id: number): Promise<UserOrderEntity | null>
  create (order: ICreateUserOrderInput): Promise<UserOrderEntity | null>
  update (id: number, order: Partial<UserOrderEntity>): Promise<UserOrderEntity | null>
  delete (id: number): Promise<boolean>
}
