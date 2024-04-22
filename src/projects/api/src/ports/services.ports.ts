import { RequestEntity } from '../core/domain/entities/request.entity'
import { IGitHubRepositoryReturns } from '../core/repositories/github.repository'

export interface IAuthenticationService {
  signUp (username: string): Promise<boolean>
  signIn (username: string): Promise<string | null>
}

export interface JWTObject {
  id: string
  iat: number
  exp: number
  [key: string]: any
}

export interface IUserSession {
  user_id: string
  token: string
}

export interface IUserSessionAddSessionInput {
  user_id: string
  token: string
}

export interface ISessionTokenGenerator {
  generateToken (payload: object): string
  verifyToken (token: string, secret?: string): JWTObject | null
}

export interface IRedisService {
  get (key: string): Promise<string | null>
  set (key: string, value: string, expireSeconds?: number): Promise<void>
  del (key: string): Promise<boolean>
  getClient (): any
}


export interface IQueueService {
  connect (): Promise<void>
  getConnection (): any | null
  closeConnection (): Promise<void>
}

export interface IMessageProducer {
  queueService: IQueueService
  sendMessage (queueName: string, message: string, callback?: () => any, TTL?: number): Promise<any>
}

export interface IMessageConsumer {
  queueService: IQueueService
  consumeMessages (queueName: string, callback?: (message: any) => any): Promise<void>
}


// Interface do Serviço de Banco de Dados
export interface IDatabaseService {
  query (sql: string | unknown, values?: any[] | unknown): Promise<any>
}

export interface PaginationMetadata {
  prevPage?: number
  firstPage?: number
  nextPage?: number
  lastPage?: number
}

export interface IGithubService {
  searchUser (username: string): Promise<IGitHubRepositoryReturns.searchUser>
  getUserRepositories (username: string, page: number, perPage: number): Promise<IGitHubRepositoryReturns.getUserRepositories>
}

export interface UserOrdersService {
  createOrder (user_id: number, type: string, data: any): Promise<RequestEntity>
  getOrder (orderId: number): Promise<RequestEntity | null>
  updateOrder (orderId: number, user_id: number, type: string, data: any): Promise<RequestEntity | null>
  deleteOrder (orderId: number): Promise<boolean>
}