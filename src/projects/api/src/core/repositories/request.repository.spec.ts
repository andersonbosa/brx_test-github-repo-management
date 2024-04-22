import { InMemoryRequestRepository } from '../../adapters/repositories/in-memory-request-repository'
import { RequestEntity } from '../domain/entities/request.entity'
import { IRequestRepository } from './request.repository'


describe(`IRequestRepository`, () => {
  const entityMock: RequestEntity[] = [
    {
      id: 1,
      user_id: 0,
      type: 'export',
      data: { subdata: { subsubdata: ['', {}] } },
      created_at: new Date(),
      updated_at: null,
      deleted_at: null
    },
    {
      id: 2,
      user_id: 0,
      type: 'import',
      data: JSON.stringify({ subdata: { subsubdata: ['', {}] } }),
      created_at: new Date(),
      updated_at: null,
      deleted_at: null
    }
  ].map((i: any) => RequestEntity.NewWithInput(i))

  let repository: IRequestRepository

  beforeEach(() => {
    repository = new InMemoryRequestRepository()
  })

  afterEach(() => {
    repository.getAll()
      .then((all) => {
        all.forEach(i => repository.delete(i.id))
      })
  })

  it('should get entity by ID', async () => {
    const createdEntity = await repository.create(entityMock[0])

    const foundEntity = await repository.getById(createdEntity.id)

    expect(foundEntity).toEqual(createdEntity)
  })

  it('should return null if entity is not found by ID', async () => {
    const foundEntity = await repository.getById(999)

    expect(foundEntity).toBeNull()
  })

  it('should get entities by specic prop', async () => {
    const createdEntity = await repository.create(entityMock[0])

    const foundEntity = await repository.getByProp('id', createdEntity.id)

    expect(foundEntity?.at(0)).toBe(createdEntity)
  })

  it('shoushould return empty array if entity is not found by specic prop', async () => {
    const foundEntity = await repository.getByProp('type', 'lorem ipsum')

    expect(foundEntity).toEqual([])
  })

  it('should get all entities', async () => {
    for (const entity of entityMock) {
      await repository.create(entity)
    }

    const allEntities = await repository.getAll()

    expect(allEntities.length).toEqual(entityMock.length)
  })

  it('should update entity', async () => {
    const createdEntity = await repository.create({ ...entityMock[0] })

    const expectedData = { data: 'Moldova' }

    const updatedEntity = await repository.update(
      createdEntity.id, { data: expectedData }
    )

    expect(updatedEntity?.data).toBe(expectedData)
  })

  it('should delete entity', async () => {
    const createdEntity = await repository.create({ ...entityMock[0] })

    await repository.delete(createdEntity.id)

    const foundEntity = await repository.getById(createdEntity.id)

    expect(foundEntity).toBeNull()
  })

  // it('should get entity by ID', async () => {
  //   await repository.create(entityMock[1])

  //   const foundEntity = await repository.getById(1)

  //   expect(foundEntity).toEqual(entityMock[1])
  // })

  // it('should return null if entity is not found by ID (getById)', async () => {
  //   const foundEntity = await repository.create(entityMock[0])

  //   expect(foundEntity).toEqual(entityMock[0])

  //   expect(foundEntity).toBeNull()
  // })

  // it('should throw an error for unimplemented method getByProp', async () => {
  //   await expect(repository.getByProp('type', 'test'))
  //     .rejects.toThrow('Method not implemented.')
  // })
})