import { IGitHubRepository } from '../../repositories/github.repository'

export class SearchGitHubUserUsecase {
    constructor(private githubRepository: IGitHubRepository) {}

    async execute(username: string): Promise<any> {
        return this.githubRepository.searchUser(username);
    }
}