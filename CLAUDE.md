# designduck registry

Public shadcn-style component registry. Consumers run `npx shadcn add @designduck/<item>` or `npx shadcn add https://<host>/r/<item>.json`. No auth in v1 (namespace `headers` config leaves room for it later). Plan: `~/.claude/plans/noble-soaring-sedgewick.md`.

## Git rules
- Never commit directly to `main`. Work on a branch (e.g. `feat/...`) and merge via PR.
- Never add a co-author line (`Co-Authored-By`) or any tool attribution to commit messages. Messages are plain, written as the user's own.

## Stack
Next.js App Router, TypeScript, Tailwind v4, Radix `new-york` style, **bun** (not pnpm), Node 22 (`.nvmrc`, `engines`). `shadcn` CLI pinned exactly in `package.json` (3.8.5); run it as `bunx --bun shadcn <cmd>`. Bump the pin deliberately and re-run the install test.

## Architecture
- Single root `registry.json` (`name: designduck`). Switch to `include` at roughly 25-30 items.
- Static output: `bun run registry:build` (`shadcn build`) writes `public/r/*.json`. `public/r` is gitignored and built at deploy time. Dynamic route handlers (`loadRegistry`) only when auth is needed.
- Source layout: `registry/new-york/<item>/{components,hooks,lib}/`. Blocks add a `page.tsx`. `registry/new-york/ui/{card,input,label}` are local mirrors of stock shadcn primitives, used only so blocks typecheck here. They are not distributed.
- Imports inside registry source: `@/registry/new-york/...` for registry files, `@/lib/utils` for `cn`. The CLI rewrites them to the consumer's aliases (verified, including custom item paths).
- Docs/preview site (`app/`, `components/`) is not distributed. Registry files must never import from it.

## Commands
- `bun dev` serves the site and `/r/*.json` (registry.json is at `/r/registry.json`)
- `bun run registry:build`, `bun run typecheck`, `bun run lint`
- `bun run registry:validate`, `bun run test:install` (run `registry:build` first)

## Verified CLI facts (shadcn 3.8.5)
- Namespace key keeps the `@`: `"registries": {"@designduck": "https://host/r/{name}.json"}`. `shadcn registry add "@ns=url"` writes it.
- `shadcn registry add` does not overwrite an existing namespace entry; edit `components.json` by hand to change a URL.
- `search` and `list` are the same command. `build` rejects invalid item types.
- `shadcn/schema` exports `registrySchema` and `registryItemSchema` for the validate script.
- `shadcn mcp init --client claude` writes `.mcp.json` with `npx shadcn@latest mcp`; the server reads namespaces from the consumer's `components.json`. We ship no MCP server.
- `acme/ui/button#v1.2.0` (seen in the item docs) looks like GitHub-registry syntax (`owner/repo/item#ref`), not namespace syntax. Not verified; don't use `#ref` on `@designduck/...` dependencies. The repo is a valid GitHub registry too (`registry.json` at root), so `shadcn add <owner>/<repo>/<item>` should work once it is public.
- Registry index (https://ui.shadcn.com/docs/registry/registry-index): open a PR to `shadcn-ui/ui` editing `apps/v4/registry/directory.json`, run `pnpm validate:registries` there. Requires: open source, public, valid schema, flat layout (`registry.json` and `<name>.json` at the registry root, i.e. `/r/`), no `content` in `registry.json` files. Only `@namespace` registries need listing.

## Conventions
- Own items in `registryDependencies` use `@designduck/<name>`; stock shadcn items use the bare name (`card`).
- Item names are kebab-case. Ours shadows stock `button` on install by design (`@designduck/button`).
- Theme via `registry:theme` (`cssVars` light/dark in oklch, `theme` for radius/fonts). Components use token classes only.
- Breaking changes: new item name or new path prefix, never silent in-place mutation. Deprecate with `docs` message plus `meta.deprecated`.
- Cache headers for `/r/*`: `public, max-age=0, s-maxage=300, stale-while-revalidate=86400` (set in `next.config.ts` at Phase 3).

## Authoring checklist
1. Kebab-case unique name; avoid unintended collisions with stock names.
2. Short `title`; `description` is one sentence saying what it is, when to use it, and key props/variants (this is what LLMs and the MCP server see).
3. Correct `type` per file; `target` for `registry:page` and `registry:file`.
4. Imports only via `@/registry/new-york/...` (and `@/lib/utils`); no relative cross-item imports.
5. `dependencies` lists every npm import; `registryDependencies` lists every other item.
6. Token classes only, no hex or ad-hoc palettes.
7. A11y: semantic elements, keyboard operable, visible focus, labels/aria on icon-only controls, contrast in light and dark, Radix where a pattern exists.
8. Forward `className` and props; `"use client"` only when needed.
9. Docs entry with one usage example, variants, and gotchas. Preview code stays out of distributed files.
10. The item installs alone into a fresh app and that app typechecks and builds.

## Status
- Phase 0 done: template converted to bun, build and serve loop works.
- Phase 1 done: `button` (ui), `use-debounce` (hook), `login-01` (block) install via namespace and direct URL into a scratch Next app, which typechecks and builds.
- Phase 2 done: home catalog (`app/page.tsx`) and `/docs/[slug]` with live preview, install tabs (bun/pnpm/npm/yarn x namespace/URL), dependencies, source. Docs read `registry.json` and the real source files via `lib/registry.ts`. Previews live in `components/previews/` (not distributed). Added `designduck-theme` (`registry:theme`).
- Theme gotcha: put `radius` in `cssVars.light`, not `cssVars.theme`. `theme` writes into `@theme inline`, which the consumer's `:root --radius` overrides at runtime.
- New item checklist addition: add a preview in `components/previews/index.tsx` (optional for themes).
- Phase 3 code done (not yet deployed): `bun run registry:validate` (`scripts/validate-registry.ts`: schema, kebab-case, description length, files exist, targets, no relative or docs-site imports, own-namespace deps exist, built output not stale), `bun run test:install` (`scripts/test-install.sh`: every item via namespace and URL into a fresh Next app, then tsc and next build), `/r/*` cache and CORS headers in `next.config.ts`, `.github/workflows/ci.yml` (PR, main, nightly).
- Next: Vercel deploy (needs Vercel CLI or dashboard import; set `NEXT_PUBLIC_REGISTRY_URL`, update `homepage`), then Phase 4 MCP and registry index.
- Placeholder: `homepage` is `https://designduck-ui.vercel.app`; live at that URL (production, Vercel project `designduck-ui`); override with `NEXT_PUBLIC_REGISTRY_URL`.
