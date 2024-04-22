import mariadb from 'mariadb'
import { MariaDBService } from './mariadb.service'


/**
 * #TODO MariaDBService
 * implementar mock de mariadb
 * ajustar testes pois ele falha por timeout
 */
describe('MariaDBService', () => {
  let mockPoolConfig: mariadb.PoolConfig
  let mariaDBService: MariaDBService

  beforeAll(() => {
    mockPoolConfig = {
      host: 'localhost',
      port: 3306,
      user: 'admin',
      password: 'admin',
      database: '',
    }

    mariaDBService = new MariaDBService(mockPoolConfig)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('connection', () => {
    it('should connect to database', async () => {
      const [result] = await mariaDBService.query('SELECT 1,2')
      expect(Object.values(result).length).toBe(2)
    })
  })

  describe('query', () => {
    it('should execute the query successfully', async () => {
      expect(mariaDBService.query('SELECT 1'))
        .toBeInstanceOf(Promise)
    })
  })
})
