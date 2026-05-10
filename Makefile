.PHONY: dev build web git-service

dev:
	npm run dev

build:
	npm run build

web-dev:
	npm run dev --workspace=apps/web

git-dev:
	cd apps/git-service && go run main.go
