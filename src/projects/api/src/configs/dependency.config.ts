import { MariaDBUserOrdersRepository } from '../adapters/repositories/maria-db-user-orders.repository'
import { MariaDBService } from '../adapters/services/mariadb.service'
import { UserOrdersRepository } from '../core/repositories/user-order.repository'
import { IDatabaseService } from '../ports/services.ports'
import { AppConfig, AppConfigType } from './app.config'

export interface IDependencyContainer {
  config: AppConfigType
  services: {
    database: {
      mariadb: IDatabaseService
    }
    queue: {

    }
  },
  repositories: {
    userOrders: UserOrdersRepository
  }
}

const CreateDependencyContainer = (config: AppConfigType): IDependencyContainer => {
  const services = {
    database: {
      mariadb: new MariaDBService({ trace: true, ...AppConfig.mariadb.connectionObject })
    },
    queue: {

    },
  }

  const repositories = {
    userOrders: new MariaDBUserOrdersRepository(services.database.mariadb)
  }

  return {
    config,
    services,
    repositories,
  }
}

const DependencyContainer: IDependencyContainer = CreateDependencyContainer(AppConfig)

export { DependencyContainer }
