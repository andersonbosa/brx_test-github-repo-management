import { BaseEntity } from './base.entity'

export type UserOrderEntityStatus = 'waiting' | 'preparing' | 'ready' | 'delivered'

export type UserOrderEntityTypes = 'import' | 'export'

export type UserOrderEntityData = any

export class UserOrderEntity extends BaseEntity {
  constructor(
    public id: number,
    public type: UserOrderEntityTypes,
    public status: UserOrderEntityStatus,
    public data: UserOrderEntityData,
    public created_at: string | Date,
    public updated_at: string | Date | null,
    public deleted_at: string | Date | null,
  ) {
    super(created_at, updated_at, deleted_at)
  }

  static NewWithInput (input: UserOrderEntity) {
    return new UserOrderEntity(
      input.id,
      input.type,
      input.status,
      input.data,
      input.created_at,
      input.updated_at,
      input.deleted_at,
    )
  }
}
