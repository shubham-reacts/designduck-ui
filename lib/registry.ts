import "server-only"
import fs from "node:fs/promises"
import path from "node:path"

import registry from "@/registry.json"

export type RegistryItem = {
  name: string
  type: string
  title: string
  description: string
  cssVars?: unknown
  dependencies?: string[]
  registryDependencies?: string[]
  files?: { path: string; type: string; target?: string }[]
}

export const REGISTRY_NAME = registry.name
export const REGISTRY_URL = (
  process.env.NEXT_PUBLIC_REGISTRY_URL ?? registry.homepage
).replace(/\/$/, "")

export function getItems(): RegistryItem[] {
  return registry.items as unknown as RegistryItem[]
}

export function getItem(slug: string) {
  return getItems().find((i) => i.name === slug)
}

export async function getItemSources(item: RegistryItem) {
  return Promise.all(
    (item.files ?? []).map(async (f) => ({
      path: f.path,
      type: f.type,
      target: f.target,
      content: await fs.readFile(path.join(process.cwd(), f.path), "utf8"),
    }))
  )
}
