import { IDatabaseService } from '../../ports/services.ports'

export class InMemoryDatabaseService implements IDatabaseService {
  transaction (): Promise<void> {
    throw new Error('Method not implemented.')
  }
  private data: any[] = [];
  private idCounter: number = 1;

  async query (sql: string, values?: any[]): Promise<any> {
    // Esta implementação de exemplo não usa SQL, pois estamos trabalhando em memória
    // Aqui você pode adicionar lógica para operações como filtrar, ordenar, etc., se necessário
    return this.data
  }

  async rollback (): Promise<void> {
    // Não há necessidade de rollback em um banco de dados em memória
    return
  }

  async commit (): Promise<void> {
    // Não há necessidade de commit em um banco de dados em memória
    return
  }

  async create (entity: any): Promise<any> {
    const newEntity = { ...entity, id: this.idCounter++ }
    this.data.push(newEntity)
    return newEntity
  }

  async update (entity: any): Promise<any> {
    const index = this.data.findIndex((item: any) => item.id === entity.id)
    if (index !== -1) {
      this.data[index] = { ...entity }
      return this.data[index]
    }
    throw new Error('Entidade não encontrada para atualização')
  }

  async delete (id: number): Promise<void> {
    const index = this.data.findIndex((item: any) => item.id === id)
    if (index !== -1) {
      this.data.splice(index, 1)
    } else {
      throw new Error('Entidade não encontrada para exclusão')
    }
  }

  async getById (id: number): Promise<any | undefined> {
    return this.data.find((item: any) => item.id === id)
  }
}
