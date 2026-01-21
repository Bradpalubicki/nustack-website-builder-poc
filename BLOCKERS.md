# BLOCKERS.md - nustack-website-builder-poc

## Created: 2026-01-21

### 1. Next.js Security Vulnerability
- **Status**: Known issue
- **Impact**: High severity
- **Details**: Next.js 14.x has security vulnerabilities. Upgrading to 15.x requires React 19 migration.
- **Action**: Schedule upgrade sprint or accept risk for POC

### 2. Supabase Not Configured
- **Status**: Requires manual setup
- **Impact**: Core functionality blocked
- **Details**: No .env.local file, no Supabase project connected
- **Action**: Create Supabase project and apply migrations

### 3. ESLint Not Configured
- **Status**: Missing dev dependency
- **Impact**: Lint script will fail
- **Details**: `next lint` requires ESLint config
- **Action**: Run `npm install eslint eslint-config-next --save-dev`
