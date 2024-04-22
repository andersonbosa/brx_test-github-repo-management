import { BaseEntity } from './base.entity'

export class UserEntity extends BaseEntity {
  constructor(
    public id: number,
    public username: string,
    public created_at: string | Date,
    public updated_at: string | Date | null,
    public deleted_at: string | Date | null,
  ) {
    super(created_at, updated_at, deleted_at)
  }

  static NewWithInput (input: UserEntity) {
    return new UserEntity(
      input.id,
      input.username,
      input.created_at,
      input.updated_at,
      input.deleted_at,
    )
  }
}
