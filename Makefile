.DEFAULT_GOAL := help

SHELL := /bin/bash

CMS_PORT ?= 3000
FRONTEND_PORT ?= 3001
FRONTEND_DIR ?= ../tu-media
CMS_HEALTH_URL ?= http://127.0.0.1:$(CMS_PORT)/auth/login
STARTUP_TIMEOUT ?= 60
INFRA_TIMEOUT ?= 60

.PHONY: \
	help \
	install \
	install-frontend \
	start \
	stop \
	clean \
	restart \
	status \
	docker-logs \
	docker-logs-mongodb \
	docker-logs-redis \
	ensure-infra \
	db-reset \
	dev \
	dev-frontend \
	dev-all \
	build \
	build-frontend \
	start \
	lint \
	typecheck \
	check

help: ## List available development commands.
	@awk 'BEGIN {FS = ":.*##"; printf "\nTU Media CMS development commands\n\nUsage: make <target>\n\n"} /^[a-zA-Z0-9_-]+:.*?##/ {printf "  %-22s %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@printf "\nConfiguration overrides:\n  CMS_PORT=%s FRONTEND_PORT=%s FRONTEND_DIR=%s\n\n" "$(CMS_PORT)" "$(FRONTEND_PORT)" "$(FRONTEND_DIR)"

install: ## Install CMS dependencies.
	pnpm install

install-frontend: ## Install frontend dependencies from the sibling project.
	@test -d "$(FRONTEND_DIR)" || (echo "Frontend directory not found: $(FRONTEND_DIR)" && exit 1)
	cd "$(FRONTEND_DIR)" && pnpm install

start: ## Start local MongoDB and Redis in the background.
	docker compose up -d

stop: ## Stop local MongoDB and Redis, preserving data volumes.
	docker compose down

clean: ## Stop local infrastructure and remove Docker volumes (destructive).
	docker compose down -v

restart: ## Restart local MongoDB and Redis.
	docker compose restart

status: ## Show local infrastructure status.
	docker compose ps

docker-logs: ## Follow local infrastructure logs.
	docker compose logs -f

docker-logs-mongodb: ## Follow MongoDB logs.
	docker compose logs -f mongodb mongo-init

docker-logs-redis: ## Follow Redis logs.
	docker compose logs -f redis

ensure-infra: ## Start missing local services and wait for MongoDB/Redis readiness.
	@set -e; \
		running_services="$$(docker compose ps --status running --services)"; \
		if printf '%s\n' "$$running_services" | grep -qx "mongodb" && \
			printf '%s\n' "$$running_services" | grep -qx "redis"; then \
			echo "Local MongoDB and Redis are already running."; \
		else \
			echo "Starting missing local infrastructure..."; \
			docker compose up -d mongodb redis mongo-init; \
		fi; \
		printf "Waiting for MongoDB replica set and Redis...\n"; \
		for attempt in $$(seq 1 $(INFRA_TIMEOUT)); do \
			mongo_ready="$$(docker compose exec -T mongodb mongosh --quiet --eval 'try { print(rs.status().ok) } catch (error) { print(0) }' 2>/dev/null || true)"; \
			redis_ready="$$(docker compose exec -T redis redis-cli ping 2>/dev/null || true)"; \
			if printf '%s' "$$mongo_ready" | grep -qx "1" && printf '%s' "$$redis_ready" | grep -qx "PONG"; then \
				echo "Local infrastructure is ready."; \
				exit 0; \
			fi; \
			sleep 1; \
		done; \
		echo "Local infrastructure did not become ready within $(INFRA_TIMEOUT) seconds."; \
		exit 1

db-reset: ## Drop the configured MongoDB database (destructive).
	pnpm db:reset

dev: ensure-infra ## Ensure local infrastructure is ready, then start the CMS development server.
	pnpm dev --port $(CMS_PORT)

dev-frontend: ## Start the sibling TU Media frontend development server.
	@test -d "$(FRONTEND_DIR)" || (echo "Frontend directory not found: $(FRONTEND_DIR)" && exit 1)
	cd "$(FRONTEND_DIR)" && pnpm dev --port $(FRONTEND_PORT)

dev-all: ensure-infra ## Start CMS, wait until ready, then start the frontend.
	@test -d "$(FRONTEND_DIR)" || (echo "Frontend directory not found: $(FRONTEND_DIR)" && exit 1)
	@set -e; \
		cms_pid=""; \
		cleanup() { test -z "$$cms_pid" || kill "$$cms_pid" 2>/dev/null || true; }; \
		trap cleanup EXIT INT TERM; \
		pnpm dev -- --port $(CMS_PORT) & cms_pid=$$!; \
		printf "Waiting for CMS at %s...\n" "$(CMS_HEALTH_URL)"; \
		for attempt in $$(seq 1 $(STARTUP_TIMEOUT)); do \
			if curl --silent --fail --output /dev/null "$(CMS_HEALTH_URL)"; then \
				echo "CMS is ready. Starting frontend on port $(FRONTEND_PORT)."; \
				cd "$(FRONTEND_DIR)" && pnpm dev -- --port $(FRONTEND_PORT); \
				exit $$?; \
			fi; \
			if ! kill -0 "$$cms_pid" 2>/dev/null; then \
				echo "CMS exited before it became ready."; \
				exit 1; \
			fi; \
			sleep 1; \
		done; \
		echo "CMS did not become ready within $(STARTUP_TIMEOUT) seconds."; \
		exit 1

build: ## Create an optimized CMS production build.
	pnpm build

build-frontend: ## Create an optimized frontend production build.
	@test -d "$(FRONTEND_DIR)" || (echo "Frontend directory not found: $(FRONTEND_DIR)" && exit 1)
	cd "$(FRONTEND_DIR)" && pnpm build

start: ## Start the CMS production server after building it.
	pnpm start -- --port $(CMS_PORT)

lint: ## Run CMS lint checks.
	pnpm lint

typecheck: ## Run CMS TypeScript checks.
	pnpm typecheck

check: lint typecheck build ## Run CMS lint, typecheck, and production build.
