.PHONY: dev test migrate seed lint format clean

dev:
	npm run dev

test:
	npm test

migrate:
	npm run migrate

seed:
	npm run seed

lint:
	npm run lint

format:
	npm run format

clean:
	rm -rf node_modules
	rm -rf .next
	rm -rf dist
