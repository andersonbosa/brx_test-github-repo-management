// import { RequestEntity } from '../../core/domain/entities/request.entity'
// import { CreateRequestInput, IRequestRepository, UpdateRequestInput } from '../../core/repositories/request.repository'
// import { IDatabaseService } from '../../ports/services.ports'

// export class MariaDBRequestsRepository implements IRequestRepository {
//   constructor(private databaseService: IDatabaseService) { }

//   async create (input: CreateRequestInput): Promise<RequestEntity> {
//     const sql = 'INSERT INTO requests (user_id, type, data) VALUES (?, ?, ?) RETURNING *'
//     const [result] = await this.databaseService.query(
//       sql,
//       [input.user_id, input.type, input.data]
//     )
//     return RequestEntity.NewWithInput(result)
//   }

//   async update (input: UpdateRequestInput): Promise<RequestEntity> {
//     const sql = 'UPDATE requests SET type = :type, data = :data WHERE id = :id RETURNING *'
//     const [result] = await this.databaseService.query(
//       { namedPlaceholders: true, sql },
//       { type: input.type, data: input.data, id: input.id }
//     )
//     return RequestEntity.NewWithInput(result)
//   }

//   async delete (id: number): Promise<void> {
//     const sql = 'UPDATE requests SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?'
//     // await this.databaseService.query(sql, [id])
//   }

//   async getAll (): Promise<RequestEntity[]> {
//     const results = await this.databaseService.query('SELECT * FROM requests')
//     return results.map((item: RequestEntity) => RequestEntity.NewWithInput(item))
//   }

//   async getById (id: number): Promise<RequestEntity | null> {
//     const sql = 'SELECT * FROM requests WHERE id = ? AND deleted_at IS NULL'
//     const result = await this.databaseService.query(sql, [id])
//     if (result.length > 0) {
//       const input = result[0]
//       return RequestEntity.NewWithInput(input)
//     }
//     return null
//   }

//   async getByProp (_prop: keyof RequestEntity, _value: any): Promise<RequestEntity[] | null> {
//     throw new Error('Method not implemented.')
//   }
// }