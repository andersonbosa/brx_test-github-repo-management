# HACK: Load .env file environment variables. Useful to reuse env vars from
# services (backend_deployment, extraction-cronjob, etc)
# include ./.env
# export

up:
	docker compose up --build --force-recreate --remove-orphans --watch

up-infra:
	docker compose -f  compose.infra.yml up --build --force-recreate --remove-orphans --watch

up-apps:
	docker compose -f  compose.apps.yml up --build --force-recreate --remove-orphans --watch

down:
	docker compose down
	docker compose rm --volumes --force

# https://stackoverflow.com/questions/2145590/what-is-the-purpose-of-phony-in-a-makefile
.PHONY: up down connect-mariadb