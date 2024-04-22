import { GithubRESTAPIService } from '../../../adapters/services/github-rest-api-service'
import { GithubRepository } from '../../repositories/github.repository'
import { GetUserRepositoriesUseCase } from './get-github-user-repositories.usecase'

describe(`${GetUserRepositoriesUseCase.name}`, () => {
  let githubRepo = new GithubRepository(new GithubRESTAPIService())

  it('should return user repositories', async () => {
    const validUsername = 'andersonbosa'

    const usecase = new GetUserRepositoriesUseCase(githubRepo)
    const result = await usecase.execute(validUsername)

    expect(result.data.length).toBeGreaterThan(0)
  })
})