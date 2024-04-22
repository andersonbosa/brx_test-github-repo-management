import { RequestEntity } from '../../core/domain/entities/request.entity'
import { CreateRequestInput, IRequestRepository, UpdateRequestInput } from '../../core/repositories/request.repository'


export class InMemoryRequestRepository implements IRequestRepository {
  private __requests: RequestEntity[] = [];

  async create (input: CreateRequestInput): Promise<RequestEntity> {
    const entity = RequestEntity.NewWithInput(
      {
        ...input,
        id: this.__requests.length + 1,
        created_at: new Date(),
        deleted_at: null,
        updated_at: null,
      } as RequestEntity
    )
    this.__requests.push(entity)
    return entity
  }

  async update (id: number, input: UpdateRequestInput): Promise<RequestEntity | null> {
    const searchIndex = this.__requests.findIndex(item => item.id === id)
    const hasFound = searchIndex !== -1
    if (hasFound) {
      const currentOccourrence = this.__requests[searchIndex]
      const updatedOccurrence = RequestEntity.NewWithInput(
        Object.assign(
          currentOccourrence,
          input,
          { updated_at: new Date() },
        )
      )
      this.__requests[searchIndex] = updatedOccurrence
      return this.__requests[searchIndex]
    }
    return null
  }

  async delete (id: number): Promise<void> {
    this.__requests = this.__requests.filter(item => item.id !== id)
  }

  async getAll (): Promise<RequestEntity[]> {
    return this.__requests
  }

  async getById (id: number): Promise<RequestEntity | null> {
    return this.__requests.find(item => item.id === id) ?? null
  }

  async getByProp (prop: keyof RequestEntity, value: any): Promise<RequestEntity[] | null> {
    return this.__requests.filter(item => item[prop] === value) || null
  }
}
