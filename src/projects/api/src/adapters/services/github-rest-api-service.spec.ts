import { GithubRESTAPIService } from './github-rest-api-service'

describe('GithubRESTAPIService', () => {
  let githubService: GithubRESTAPIService
  const validUsername = 'andersonbosa'

  beforeEach(() => {
    // Use o serviço falso para os testes
    githubService = new GithubRESTAPIService()
  })


  describe('searchUser', () => {
    it('should return user data if user exists', async () => {
      const response = await githubService.searchUser(validUsername)
      expect(response.data.items.length).toBeGreaterThan(0)
      expect(response.data.items[0].login).toBe(validUsername)
    })

    it('should return empty data if user dont exists', async () => {
      const response = await githubService.searchUser('a9fbe63a-f1fb-5c3c-a8e8-fb684ace0a50')
      expect(response.data.items.length).toBe(0)
    })
  })

  describe('getUserRepositories', () => {
  //   it('should return user repositories if user exists', async () => {
  //     const userRepositories = await githubService.getUserRepositories('existingUser')
  //     expect(userRepositories.length).toBe(2)
  //     expect(userRepositories[0].name).toBe('repo1')
  //     expect(userRepositories[1].name).toBe('repo2')
  //   })

  //   it('should throw an error if user does not exist', async () => {
  //     await expect(githubService.getUserRepositories('nonExistingUser'))
  //       .rejects.toThrow('User nonExistingUser not found')
  //   })
  })
})