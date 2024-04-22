import { DependencyContainer } from '../../configs/dependency.config'
import { UserOrderEntity } from '../../core/domain/entities/user-order.entity'

describe('MariaDBUserOrdersRepository', () => {
  const repo = DependencyContainer.repositories.userOrders

  it('should create and return order', async () => {
    const input = {
      type: 'export',
      data: [{}, { a: 1 }]
    }

    const result = await repo.create(input as any)

    expect(result).toBeInstanceOf(UserOrderEntity)
    expect(input.data).toStrictEqual(result?.data)
  })

  it('should find all orders', async () => {
    const result = await repo.findAll()
    expect(result[0]).toBeInstanceOf(UserOrderEntity)
  })

  it.skip('should update and return order', async () => {
    const toCreate = { type: 'export', data: '' }
    const toUpdate: Partial<UserOrderEntity> = {
      data: 'lorem',
      type: 'import',
      status: 'delivered',
      deleted_at: new Date().toISOString()
    }

    const created = await repo.create(toCreate as any)
    const updated = created && await repo.update(created.id, toUpdate)

    expect(updated).toBeInstanceOf(UserOrderEntity)
    expect(created?.data).toStrictEqual(updated?.data)
    expect(created?.deleted_at).toBeDefined()
  })
})

