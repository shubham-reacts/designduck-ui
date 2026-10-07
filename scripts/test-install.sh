#!/usr/bin/env bash
# Install every item into a fresh scratch Next app, then typecheck and build it.
# Usage: scripts/test-install.sh   (run `bun run registry:build` first)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-4010}"
SHADCN="shadcn@$(node -p "require('$ROOT/package.json').dependencies.shadcn")"
WORK="$(mktemp -d)"
trap 'kill $SERVER_PID 2>/dev/null || true; rm -rf "$WORK"' EXIT

[ -d "$ROOT/public/r" ] || { echo "public/r missing; run bun run registry:build" >&2; exit 1; }

python3 -m http.server "$PORT" --directory "$ROOT/public/r" >/dev/null 2>&1 &
SERVER_PID=$!
disown
sleep 1

cd "$WORK"
echo consumer | bunx --bun "$SHADCN" init -d -t next -c "$WORK" >/dev/null
cd consumer
bunx --bun "$SHADCN" registry add "@designduck=http://localhost:$PORT/{name}.json" >/dev/null

ITEMS=$(node -e "console.log(require('$ROOT/registry.json').items.map(i=>i.name).join(' '))")
for item in $ITEMS; do
  echo "namespace add: $item"
  bunx --bun "$SHADCN" add "@designduck/$item" -y -o >/dev/null
done
for item in $ITEMS; do
  echo "url add: $item"
  bunx --bun "$SHADCN" add "http://localhost:$PORT/$item.json" -y -o >/dev/null
done

bunx tsc --noEmit
bun run build >/dev/null
echo "install test ok: $ITEMS"
