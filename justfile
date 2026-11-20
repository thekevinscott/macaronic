set shell := ["bash", "-cu"]

default:
    @just --list

node-install:
    cd packages/node && pnpm install

node-lint:
    cd packages/node && pnpm run lint

node-typecheck:
    cd packages/node && pnpm run typecheck

node-build:
    cd packages/node && pnpm run build

node-test: node-build
    cd packages/node && pnpm run test

lint: node-lint
typecheck: node-typecheck
build: node-build
test: node-test

ci: lint typecheck test

clean:
    rm -rf packages/node/dist
