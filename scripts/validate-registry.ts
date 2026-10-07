import fs from "node:fs"
import path from "node:path"

import { registryItemSchema, registrySchema } from "shadcn/schema"

const root = process.cwd()
const errors: string[] = []

const registry = registrySchema.safeParse(
  JSON.parse(fs.readFileSync(path.join(root, "registry.json"), "utf8"))
)
if (!registry.success) {
  console.error("registry.json invalid:", registry.error.format())
  process.exit(1)
}

const names = new Set<string>()
for (const item of registry.data.items) {
  if (names.has(item.name)) errors.push(`duplicate item name: ${item.name}`)
  names.add(item.name)
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.name))
    errors.push(`${item.name}: name must be kebab-case`)
  if (!item.title) errors.push(`${item.name}: missing title`)
  if (!item.description || item.description.length < 20)
    errors.push(`${item.name}: description missing or too short for LLM discovery`)

  for (const file of item.files ?? []) {
    const full = path.join(root, file.path)
    if (!fs.existsSync(full)) {
      errors.push(`${item.name}: file not found: ${file.path}`)
      continue
    }
    if ((file.type === "registry:page" || file.type === "registry:file") && !file.target)
      errors.push(`${item.name}: ${file.path} needs a target`)
    const src = fs.readFileSync(full, "utf8")
    if (/from\s+["']\.\.?\//.test(src))
      errors.push(`${item.name}: ${file.path} uses a relative import; use @/registry/...`)
    if (/from\s+["']@\/(components|app)\//.test(src))
      errors.push(`${item.name}: ${file.path} imports docs-site code (@/components or @/app)`)
  }
}

// Own-namespace registry dependencies must exist in this registry.
for (const item of registry.data.items) {
  for (const dep of item.registryDependencies ?? []) {
    const m = dep.match(/^@designduck\/([^#]+)/)
    if (m && !names.has(m[1])) errors.push(`${item.name}: unknown registry dependency ${dep}`)
  }
}

// Built output, if present, must also validate.
const outDir = path.join(root, "public/r")
if (fs.existsSync(outDir)) {
  for (const f of fs.readdirSync(outDir)) {
    if (f === "registry.json" || !f.endsWith(".json")) continue
    const built = registryItemSchema.safeParse(
      JSON.parse(fs.readFileSync(path.join(outDir, f), "utf8"))
    )
    if (!built.success) errors.push(`public/r/${f} invalid`)
    else if (!names.has(built.data.name)) errors.push(`public/r/${f}: stale, not in registry.json`)
  }
}

if (errors.length) {
  console.error(errors.map((e) => `- ${e}`).join("\n"))
  process.exit(1)
}
console.log(`registry ok: ${names.size} items`)
