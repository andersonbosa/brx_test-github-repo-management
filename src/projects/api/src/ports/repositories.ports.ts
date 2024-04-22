import { UserEntity } from '../core/domain/entities/user.entity'
import { IUserSession, IUserSessionAddSessionInput } from './services.ports'

export interface ICounterRepository {
  incrementCount: () => Promise<boolean>
  getCount: () => Promise<number>
}


export interface IDatabaseRepository {
  connect (): Promise<void>
  disconnect (): Promise<void>
  healthCheck (): Promise<boolean>
  query (queryText: string, values?: any[]): Promise<any>
  transaction (queryText: string, values?: any[]): Promise<any>
}

export interface IUserSessionsRepository {
  getSession (user_id: string): Promise<IUserSession | null>
  addSession (sessionPayload: IUserSessionAddSessionInput): Promise<void>
  destroySession (user_id: string): Promise<boolean>
}


/* geral */
export interface IRepository<T> {
  create (entity: T): Promise<T>
  update (id: number, entity: T): Promise<T | null>
  delete (id: number): Promise<void>
  getAll (): Promise<T[]>
  getById (id: number): Promise<T | null>
  getByProp (prop: keyof T, value: any): Promise<T[] | null>
}

export interface IQueueRepository {
  consume (queue: string, options: Record<string, unknown>): Promise<unknown>
  produce (queue: string, payload: string, options: Record<string, unknown>): Promise<unknown>
}

/* user */

/* request */