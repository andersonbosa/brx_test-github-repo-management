import { GithubRESTAPIService } from '../../../adapters/services/github-rest-api-service'
import { GithubRepository } from '../../repositories/github.repository'
import { SearchGitHubUserUsecase } from './search-github-user.usecase'

describe(`${SearchGitHubUserUsecase.name}`, () => {
  let githubRepo = new GithubRepository(new GithubRESTAPIService())

  it('should return found user', async () => {
    const validUsername = 'andersonbosa'

    const usecase = new SearchGitHubUserUsecase(githubRepo)
    const result = await usecase.execute(validUsername)

    expect(result.data.items.length).toBeGreaterThan(0)
  })
})