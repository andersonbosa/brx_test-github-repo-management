import { BaseEntity } from './base.entity'

export type RequestEntityTypes = 'import' | 'export'

export type RequestEntityData = any

export class RequestEntity extends BaseEntity {
  constructor(
    public id: number,
    public user_id: number,
    public type: RequestEntityTypes,
    public data: RequestEntityData,
    public created_at: string | Date,
    public updated_at: string | Date | null,
    public deleted_at: string | Date | null,
  ) {
    super(created_at, updated_at, deleted_at)
  }

  static NewWithInput (input: RequestEntity) {
    return new RequestEntity(
      input.id,
      input.user_id,
      input.type,
      input.data,
      input.created_at,
      input.updated_at,
      input.deleted_at,
    )
  }
}
