import { IRepository } from '../../ports/repositories.ports'
import { RequestEntity, RequestEntityData, RequestEntityTypes } from '../domain/entities/request.entity'

export type CreateRequestInput = {
  user_id: number,
  type: RequestEntityTypes
  data: RequestEntityData
}

export type UpdateRequestInput = {
  user_id?: number
  type?: RequestEntityTypes
  data?: RequestEntityData
}

export interface IRequestRepository extends IRepository<RequestEntity> {
  getAll (): Promise<RequestEntity[]>
  getById (id: number): Promise<RequestEntity | null>
  getByProp (prop: keyof RequestEntity, value: any): Promise<RequestEntity[] | null>
  delete (id: number): Promise<void>
  create (input: CreateRequestInput): Promise<RequestEntity>
  update (id: number, input: UpdateRequestInput): Promise<RequestEntity | null>
}
