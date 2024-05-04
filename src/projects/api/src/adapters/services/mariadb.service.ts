import mariadb, { QueryOptions } from 'mariadb'
import { IDatabaseService } from '../../ports/services.ports'
import { logger } from './logger.service'
import { DatabaseConnectionError } from '../../core/errors'


export class MariaDBService implements IDatabaseService {
  public conn: mariadb.Connection | undefined
  constructor(private config: mariadb.PoolConfig) { }
  async query (sql: string | QueryOptions, values?: any[]): Promise<any[]> {
    try {
      this.conn = await mariadb.createConnection(this.config)
      const result = await this.conn.query(sql, values)
      return result
    } catch (err: any) {
      await this.conn?.rollback()
      if (err.code === 'ECONNREFUSED') {
        throw new DatabaseConnectionError(err)
      }
      console.error(`[${__filename}:MariaDBService]: `, err)
      throw err
    }
    finally {
      if (this.conn) {
        this.conn.end()
      }
    }
  }
}

// export interface MariaDBServiceQueryResult {
//   QueryResult: any
//   [key: string]: unknown
// }

// export class MariaDBService implements IDatabaseService {
//   public pool: mariadb.Pool

//   constructor(private config: mariadb.PoolConfig) {
//     this.pool = mariadb.createPool({
//       trace: true,
//       connectionLimit: 10,
//       insertIdAsNumber: true,
//       idleTimeout: 30,
//       ...config
//     })
//   }

//   /**
//    * @see {documentation} https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md#connectionquerysql-values---promise
//    */
//   async query (sql: string | mariadb.QueryOptions, values?: any): Promise<MariaDBServiceQueryResult> {
//     let conn: mariadb.PoolConnection | undefined
//     try {
//       conn = await this.pool.getConnection()
//       const result = await conn.query(sql, values)
//       return result
//     } catch (err) {
//       await conn?.rollback()
//       throw new Error(`[MariaDBService] Error executing query: ${err}`)
//     }
//     finally {
//       if (conn) {
//         conn.end()
//       }
//     }
//   }
// }



