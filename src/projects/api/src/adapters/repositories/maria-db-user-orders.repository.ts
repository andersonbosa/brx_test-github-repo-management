import { QueryOptions } from 'mariadb'
import { ICreateUserOrderInput } from '../../@types/inputs'
import { UserOrderEntity } from '../../core/domain/entities/user-order.entity'
import { UserOrdersRepository } from '../../core/repositories/user-order.repository'
import { IDatabaseService } from '../../ports/services.ports'


export class MariaDBUserOrdersRepository implements UserOrdersRepository {
  constructor(private mariadbService: IDatabaseService) { }

  async findById (id: number): Promise<UserOrderEntity | null> {
    const sql = /* SQL */`
      SELECT *
      FROM user_orders
      WHERE id = ? AND deleted_at IS NULL
    `
    const result = await this.__executeSql<any[]>(sql, [id])
    return result.length > 0 ? UserOrderEntity.NewWithInput(result[0]) : null
  }

  async findAll (): Promise<UserOrderEntity[]> {
    const sql = /* SQL */`
      SELECT *
      FROM user_orders AND deleted_at IS NULL
    `
    const result = await this.__executeSql<any[]>(sql)
    return result.map(row => UserOrderEntity.NewWithInput(row))
  }

  async create (order: ICreateUserOrderInput): Promise<UserOrderEntity | null> {
    const { type, data } = order
    const sql = /* SQL */`
      INSERT INTO
        user_orders (type, data)
      VALUES
        (?, ?)
      RETURNING *
    `
    const result = await this.__executeSql<any[]>(sql, [type, JSON.stringify(data)])
    return UserOrderEntity.NewWithInput(result[0])
  }

  async update (id: number, order: Partial<UserOrderEntity>): Promise<UserOrderEntity | null> {
    try {
      if (Object.keys(order).length <= 0) {
        return null
      }

      const params: any[] = []
      let sql = ' UPDATE user_orders SET '

      Object.keys(order).forEach(
        (key, index) => {
          const conditionalComma = (Object.keys(order).length - 1) === index ? '' : ','
          const k = key as keyof Partial<UserOrderEntity>
          sql += ` ${k} = ? ${conditionalComma}`
          params.push(
            k === 'data' ? JSON.stringify(order[k]) : order[k]
          )
        }
      )

      sql += ' WHERE `id` = ?  AND deleted_at IS NULL '
      params.push(id)

      const result = await this.__executeSql<{ affectedRows: number }>(sql, params)
      if (result.affectedRows > 0) {
        return this.findById(id)
      } else {
        return null
      }

    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async delete (id: number): Promise<boolean> {
    const sql = /* SQL */`
      UPDATE user_orders
      SET deleted_at = CURRENT_TIME
      WHERE id = ? AND deleted_at IS NULL
    `
    const result = await this.__executeSql<{ affectedRows: number }>(sql, [id])
    return Boolean(result.affectedRows)
  }

  private async __executeSql<T> (sql: string | QueryOptions, values?: any[]): Promise<T> {
    try {
      const result: any = await this.mariadbService.query(sql, values)
      return result
    } catch (error) {
      // if (error instanceof DatabaseConnectionError) {
      //   ...q
      // }
      console.error(`[${__filename}] Unknown error:`, error)
      throw error
    }
  }
}
