import { QueryOptions } from 'mariadb'
import { UserOrderEntity } from '../../core/domain/entities/user-order.entity'
import { UserOrdersRepository } from '../../core/repositories/user-order.repository'
import { IDatabaseService } from '../../ports/services.ports'
import { ICreateUserOrderInput } from '../controllers/user-orders.controller'


export class MariaDBUserOrdersRepository implements UserOrdersRepository {
  constructor(
    private mariadbService: IDatabaseService
  ) { }

  async findById (id: number): Promise<UserOrderEntity | null> {
    const sql = `SELECT * FROM user_orders WHERE id = ?`
    const result = await this.executeSql(sql, [id])
    return result.length > 0 ? UserOrderEntity.NewWithInput(result[0]) : null
  }

  async findAll (): Promise<UserOrderEntity[]> {
    const sql = `SELECT * FROM user_orders`
    const result = await this.executeSql(sql)
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
    const result = await this.executeSql(sql, [type, JSON.stringify(data)])
    return UserOrderEntity.NewWithInput(result[0] as any)
  }

  async update (id: number, order: Partial<UserOrderEntity>): Promise<UserOrderEntity | null> {
    // TODO 
    return null
  }

  async delete (id: number): Promise<boolean> {
    const sql = `UPDATE user_orders SET deleted_at = ? WHERE id = ? RETURNING *`
    const deletedItem = await this.executeSql(sql, ['CURRENT_TIME', id])
    return Boolean(deletedItem)
  }

  private async executeSql (sql: string | QueryOptions, values?: any[]): Promise<any[]> {
    try {
      const result: any = await this.mariadbService.query(sql, values)
      return result
    } catch (error) {
      console.error('[MariaDBUserOrdersRepository] Error executing SQL:', error)
      throw new Error(`Error executing SQL: ${error}`)
    }
  }
}
