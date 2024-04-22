import { UserEntity } from '../../core/domain/entities/user.entity'
import { UserEntityCreateInput, IUserRepository, UserEntityUpdateInput } from '../../core/repositories/user.repository'


export class InMemoryUserRepository implements IUserRepository {
  private __users: UserEntity[] = [];

  async create (input: UserEntityCreateInput): Promise<UserEntity> {
    const entity = UserEntity.NewWithInput(
      {
        ...input,
        id: this.__users.length + 1,
        created_at: new Date(),
        deleted_at: null,
        updated_at: null,
      } as UserEntity
    )
    this.__users.push(entity)
    return entity
  }

  async update (id: number, input: UserEntityUpdateInput): Promise<UserEntity | null> {
    const searchIndex = this.__users.findIndex(user => user.id === id)
    const hasFound = searchIndex !== -1
    if (hasFound) {
      const currentOccourrence = this.__users[searchIndex]
      const updatedOccurrence = UserEntity.NewWithInput(
        Object.assign(
          currentOccourrence,
          input,
          { updated_at: new Date() },
        )
      )
      this.__users[searchIndex] = updatedOccurrence
      return this.__users[searchIndex]
    }
    return null
  }

  async delete (id: number): Promise<void> {
    this.__users = this.__users.filter(user => user.id !== id)
  }

  async getAll (): Promise<UserEntity[]> {
    return this.__users
  }

  async getById (id: number): Promise<UserEntity | null> {
    return this.__users.find(user => user.id === id) || null
  }

  async getByProp (prop: keyof UserEntity, value: any): Promise<UserEntity[] | null> {
    return this.__users.filter(user => user[prop] === value) || null
  }
}



