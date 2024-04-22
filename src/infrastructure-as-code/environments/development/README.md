# README

This is a guide to run the project in a development environment.

## Prerequisites
Make sure you have Docker installed on your machine.

## Execution Steps

### 1. Clone the Repository
Clone this repository to your local machine.

```bash
git clone https://github.com/andersonbosa/brx_test-github-repo-management
```

### 2. Environment Configuration

#### 2.1 .env File (Optional)
If you wish to set environment variables, create a `.env` file in the project root and add your variables as needed.

### 3. Running the Platform

#### 3.1 Start Services
Run the following command to start the necessary services:

```bash
make up
```

This command will build Docker images, start containers, and create the necessary network. Project volumes are shared to support application 'hot-reload' functionality.

#### 3.2 Access MariaDB Database (Optional)
If you need to access the MariaDB database, run the following command:

```bash
make connect-mariadb
```

This command will open a terminal for MariaDB access.

#### 3.3 Stop Services
To stop the services and remove the containers, run:

```bash
make down
```

This command will stop the containers and remove any associated volumes.

## Additional Notes
- Make sure to adjust the settings as necessary in the `docker-compose.yml` and `.env` files.
- RabbitMQ and Redis services are included in the `docker-compose.yml` file but can be commented or uncommented as needed for the project.