import { IGithubService, PaginationMetadata } from '../../ports/services.ports'

export declare namespace IGitHubRepositoryReturns {
  type searchUser = {
    data: any
    metadata?: PaginationMetadata
  }
  type getUserRepositories = {
    data: any[]
    metadata?: PaginationMetadata
  }
}

export interface IGitHubRepository {
  searchUser (username: string): Promise<IGitHubRepositoryReturns.searchUser>
  getUserRepositories (username: string, page: number, perPage: number): Promise<IGitHubRepositoryReturns.getUserRepositories>
}

/**
 * #TODO melhoria
 * - aqui há um "overengineering sobre o repositório"
 * - repositório define um contrato e um "adaptador de repositório"
 * (ver ../adapters/repositories) implemente de forma concreta o repositório final (em memória, banco, sistema de arquivo, etc)
 */
export class GithubRepository implements IGitHubRepository {
  constructor(
    private githubService: IGithubService
  ) { }

  async searchUser (username: string) {
    return this.githubService.searchUser(username)
  }

  async getUserRepositories (
    username: string,
    page: number = 0,
    perPage: number = 100
  ) {
    return this.githubService.getUserRepositories(username, page, perPage)
  }
}