import { IRepository } from '../../ports/repositories.ports'
import { UserEntity } from '../domain/entities/user.entity'


export type UserEntityCreateInput = {
  username: string
}

export type UserEntityUpdateInput = {
  username?: string
}

export interface IUserRepository extends IRepository<UserEntity> {
  create (input: UserEntityCreateInput): Promise<UserEntity>
  update (id: number, input: UserEntityUpdateInput): Promise<UserEntity | null>
  delete (id: number): Promise<void>
  getAll (): Promise<UserEntity[]>
  getById (id: number): Promise<UserEntity | null>
  getByProp (prop: keyof UserEntity, value: any): Promise<UserEntity[] | null>
}
