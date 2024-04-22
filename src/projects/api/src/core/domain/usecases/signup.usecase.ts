import { IUserRepository } from '../../repositories/user.repository'
import { UserEntity } from '../entities/user.entity'

export class SignUpUseCase {
  private readonly userRepository: IUserRepository

  constructor(userRepository: IUserRepository,) {
    this.userRepository = userRepository
  }

  public async execute (username: string): Promise<UserEntity | null> {
    const user = await this.userRepository.create({username})
    return user
  }
}
