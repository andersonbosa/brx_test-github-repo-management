# FOLDER STRUCTURE

Here you will find a brief explanation of the structure of folders and files.

#### Adapters

- **adapters**: Contains adapters for external integrations, such as controllers, handlers, and services.
- **adapters/services**: Stores services responsible for integrating with different external systems or services.
- **adapters/handlers**: Contains handlers for DTOs like HTTP requests to process requests and responses in a specific format.
- **adapters/controllers**: Includes controllers that handle the business logic of the application and interact with services to process requests.

#### Domain

- **core**: Encompasses the domain logic of the application, including entities and use cases representing the main functionalities.
- **ports**: Contains interfaces defining the contracts between different layers of the application, such as controllers, repositories, services, and use cases.

#### Infra

- **infrastructure**: Responsible for configuring and managing the application infrastructure, including the HTTP server and workers.
- **infrastructure/http**: Contains configurations and implementations related to the HTTP transport layer, such as routes, middlewares, and the express server.
- **infrastructure/worker**: Includes configurations and implementations related to workers, such as tasks and workers for asynchronous processing.