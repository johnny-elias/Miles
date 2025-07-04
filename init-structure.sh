#!/bin/bash

# Create directories
mkdir -p .github/workflows
mkdir -p apps/web/{app,components,lib,public}
mkdir -p apps/api/{src/routes,src/loaders,prisma/migrations}
mkdir -p services/crawlers/lifemiles
mkdir -p services/crawlers/aeroplan
mkdir -p services/alerts
mkdir -p packages/core/src
mkdir -p packages/ui
mkdir -p packages/config
mkdir -p infra/terraform/{dev,prod}
mkdir -p infra/scripts
mkdir -p scripts
mkdir -p docs

# Create files
touch README.md .gitignore package.json pnpm-workspace.yaml turbo.json tsconfig.base.json .env.example
touch .github/workflows/ci.yml

# apps/web
touch apps/web/tailwind.config.ts apps/web/next.config.mjs

# apps/api
touch apps/api/src/index.ts
touch apps/api/prisma/schema.prisma
touch apps/api/Dockerfile
touch apps/api/tsconfig.json

# services/crawlers/lifemiles
touch services/crawlers/lifemiles/index.ts
touch services/crawlers/lifemiles/parser.ts

# services/crawlers/aeroplan
# (no files specified, just directory)

# packages/core
touch packages/core/src/award-types.ts
touch packages/core/src/conversion.ts
touch packages/core/tsconfig.json

# packages/ui
# (no files specified, just directory)

# packages/config
# (no files specified, just directory)

# infra/scripts
touch infra/scripts/prepare-state.sh

# scripts
touch scripts/dev.sh scripts/openapi-gen.ts

# docs
touch docs/0001-monorepo-choice.md docs/0002-award-data-schema.md

echo "Monorepo structure created!"