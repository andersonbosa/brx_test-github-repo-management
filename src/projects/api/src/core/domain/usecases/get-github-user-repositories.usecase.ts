import { IGitHubRepository } from '../../repositories/github.repository'

export class GetUserRepositoriesUseCase {
  constructor(private githubRepository: IGitHubRepository) { }
  
  async execute (username: string, perPage: number = 100, page: number = 0) {
    return this.githubRepository.getUserRepositories(username, page, perPage)
  }
}
