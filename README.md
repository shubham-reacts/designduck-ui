# designduck

A public shadcn-style component registry. Components are distributed as source through the shadcn CLI.

## Use it

Add the namespace to your project's `components.json`:

```json
"registries": {
  "@designduck": "https://designduck.vercel.app/r/{name}.json"
}
```

Then install any item:

```bash
npx shadcn@latest add @designduck/button
# or directly by URL
npx shadcn@latest add https://designduck.vercel.app/r/button.json
```

Browse items and previews on the site, or run `npx shadcn@latest search @designduck`.

## Develop

Uses bun.

```bash
bun install
bun dev                   # site and /r/*.json
bun run registry:build    # writes public/r
bun run registry:validate
bun run test:install      # installs every item into a scratch app
```

See `CLAUDE.md` for architecture, conventions and the authoring checklist.
