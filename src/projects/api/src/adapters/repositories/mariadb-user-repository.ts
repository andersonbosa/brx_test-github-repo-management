// import { UserEntity } from '../../core/domain/entities/user.entity'
// import { IUserRepository, UserEntityCreateInput, UserEntityUpdateInput } from '../../core/repositories/user.repository'
// import { IDatabaseService } from '../../ports/services.ports'


// export class MariaDBUserRepository implements IUserRepository {
//   constructor(private databaseService: IDatabaseService) { }

//   async create (input: UserEntityCreateInput): Promise<UserEntity> {
//     const sql = 'INSERT INTO users (username) VALUES (:username) RETURNING *'
//     const [result] = await this.databaseService.query(
//       { namedPlaceholders: true, sql },
//       { username: input.username }
//     )
//     return UserEntity.NewWithInput(result)
//   }

//   async update (input: UserEntityUpdateInput): Promise<UserEntity> {
//     const sql = 'UPDATE users SET username = :username WHERE id = :id RETURNING *'
//     const [result] = await this.databaseService.query(
//       { namedPlaceholders: true, sql },
//       { username: input.username, id: input.id }
//     )
//     return UserEntity.NewWithInput(result)
//   }

//   async delete (id: number): Promise<void> {
//     const sql = 'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?'
//     await this.databaseService.query(sql, [id])
//   }

//   async getAll (): Promise<UserEntity[]> {
//     const results = await this.databaseService.query('SELECT * FROM users ')
//     return results.map((item: UserEntity) => UserEntity.NewWithInput(item))
//   }

//   async getById (id: number): Promise<UserEntity | null> {
//     const sql = 'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL'
//     const result = await this.databaseService.query(sql, [id])
//     if (result.length > 0) {
//       const input = result[0]
//       return UserEntity.NewWithInput(input)
//     }
//     return null
//   }

//   async getByProp (_prop: keyof UserEntity, _value: any): Promise<UserEntity[] | null> {
//     throw new Error('Method not implemented.')
//   }
// }