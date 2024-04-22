import { InMemoryUserRepository } from '../../adapters/repositories/in-memory-user-repository'
import { UserEntity } from '../domain/entities/user.entity'
import { IUserRepository } from './user.repository'


describe(`IUserRepository`, () => {
  const entityMock: UserEntity[] = [
    {
      id: 1,
      username: 'virgie_russell',
      created_at: '2024-07-23T08:10:46-03:00',
      updated_at: null,
      deleted_at: null
    },
    {
      id: 2,
      username: 'stephen_powell',
      created_at: '2024-06-28T06:50:58-03:00',
      updated_at: '2024-06-29T21:36:36-03:00',
      deleted_at: null
    },
    {
      id: 3,
      username: 'barbara_black',
      created_at: new Date(),
      updated_at: null,
      deleted_at: '2024-06-29T21:36:36-03:00'
    }
  ].map((i: any) => UserEntity.NewWithInput(i))

  let repository: IUserRepository

  beforeEach(() => {
    // Inicializa o repositório em memória
    repository = new InMemoryUserRepository()
  })

  afterEach(() => {
    // Limpa os dados do repositório após cada teste
    repository.getAll()
      .then((all) => {
        all.forEach(i => repository.delete(i.id))
      })
  })

  it('should get user by ID', async () => {
    const createdEntity = await repository.create(entityMock[0])

    const foundEntity = await repository.getById(createdEntity.id)

    expect(foundEntity).toEqual(createdEntity)
  })

  it('should return null if user is not found by ID', async () => {
    const foundEntity = await repository.getById(999)

    expect(foundEntity).toBeNull()
  })

  it('should get all users', async () => {
    for (const user of entityMock) {
      await repository.create(user)
    }

    const allEntities = await repository.getAll()

    expect(allEntities.length).toEqual(entityMock.length)
  })

  it('should update user', async () => {
    const createdEntity = await repository.create({ ...entityMock[0] })

    const expectedUsername = 'bobtheconstructor'

    const updatedRequest = await repository.update(
      createdEntity.id, { username: expectedUsername }
    )

    expect(updatedRequest?.username).toBe(expectedUsername)
  })


  it('should delete user', async () => {
    const createdEntity = await repository.create({ ...entityMock[0] })

    await repository.delete(createdEntity.id)

    const foundRequest = await repository.getById(createdEntity.id)

    expect(foundRequest).toBeNull()
  })
})