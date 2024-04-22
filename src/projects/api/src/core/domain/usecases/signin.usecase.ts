import { IUserSessionsRepository } from '../../../ports/repositories.ports'
import { ISessionTokenGenerator } from '../../../ports/services.ports'
import { IUserRepository } from '../../repositories/user.repository'

export class SignInUseCase {
  private readonly userRepository: IUserRepository
  private readonly userSessionsRepository: IUserSessionsRepository
  private readonly tokenGeneratorService: ISessionTokenGenerator

  constructor(
    userRepository: IUserRepository,
    userSessionsRepository: IUserSessionsRepository,
    tokenGeneratorService: ISessionTokenGenerator,
  ) {
    this.userRepository = userRepository
    this.userSessionsRepository = userSessionsRepository
    this.tokenGeneratorService = tokenGeneratorService
  }

  public async execute (username: string): Promise<string | null> {
    const users = await this.userRepository.getByProp('username', username)

    if (!users) {
      return null
    }

    const token = this.tokenGeneratorService.generateToken(
      { id: users[0].id, username: users[0].username }
    )

    await this.userSessionsRepository.addSession({
      user_id: String(users[0].id),
      token
    })

    return token
  }
}
