# designduck

A public shadcn-style component registry. Components are distributed as source through the shadcn CLI.

## Use it

Add the namespace to your project's `components.json`:

```json
"registries": {
  "@designduck": "https://designduck-ui.vercel.app/r/{name}.json"
}
```

Then install any item:

```bash
npx shadcn@latest add @designduck/button
# or directly by URL
npx shadcn@latest add https://designduck-ui.vercel.app/r/button.json
```

Browse items and previews on the site, or run `npx shadcn@latest search @designduck`.

## Use with an AI agent (MCP)

After adding the namespace, run `npx shadcn@latest mcp init --client claude` in your project. This writes a `.mcp.json` entry for the shadcn MCP server, which can then browse and install `@designduck` items.

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
