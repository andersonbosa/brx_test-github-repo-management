import { IUserSessionsRepository } from '../../../ports/repositories.ports'
import { ISessionTokenGenerator } from '../../../ports/services.ports'

export class SignOutUseCase {
  private readonly userSessionsRepository: IUserSessionsRepository
  private readonly tokenGeneratorService: ISessionTokenGenerator

  constructor(
    userSessionsRepository: IUserSessionsRepository,
    tokenGeneratorService: ISessionTokenGenerator,
  ) {
    this.userSessionsRepository = userSessionsRepository
    this.tokenGeneratorService = tokenGeneratorService
  }

  public async execute (jwtToken: string): Promise<boolean> {
    const userObj = this.tokenGeneratorService.verifyToken(jwtToken)

    if (userObj && userObj?.id) {
      const hasDestroyed = await this.userSessionsRepository.destroySession(userObj.id)

      return hasDestroyed
    }

    return false
  }
}
