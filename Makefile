#!make
include .env

up:
	docker compose up -d

down:
	docker compose down

.PHONY: build
build:
	docker compose up -d --build

deploy:
	make build
	make up
