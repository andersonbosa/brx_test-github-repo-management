# HACK: Load .env file environment variables. Useful to reuse env vars from
# services (backend_deployment, extraction-cronjob, etc)
# include ./.env
# export


up:
	docker compose up --build --force-recreate --remove-orphans


down:
	docker compose down
	docker compose rm --volumes --force


connect-mariadb:
	docker run --rm -it --network=voting-app-nt bitnami/postgresql psql -h $(MARIADB_HOST) -U $(MARIADB_USERNAME) -d $(MARIADB_DATABASE)


# https://stackoverflow.com/questions/2145590/what-is-the-purpose-of-phony-in-a-makefile
.PHONY: up down connect-mariadb