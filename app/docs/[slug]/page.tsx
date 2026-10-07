import Link from "next/link"
import { notFound } from "next/navigation"

import { InstallCommand } from "@/components/install-command"
import { previews } from "@/components/previews"
import {
  REGISTRY_NAME,
  REGISTRY_URL,
  getItem,
  getItems,
  getItemSources,
} from "@/lib/registry"

export function generateStaticParams() {
  return getItems().map((i) => ({ slug: i.name }))
}

export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = getItem(slug)
  if (!item) notFound()
  const sources = await getItemSources(item)
  const preview = previews[slug]

  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 px-4 py-8">
      <nav aria-label="Breadcrumb">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← {REGISTRY_NAME}
        </Link>
      </nav>
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{item.title}</h1>
        <p className="text-muted-foreground">{item.description}</p>
        <p className="font-mono text-xs text-muted-foreground">{item.type}</p>
      </header>

      {preview ? (
        <section aria-label="Preview" className="flex min-h-[240px] items-center justify-center rounded-lg border p-6">
          {preview}
        </section>
      ) : null}

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Install</h2>
        <InstallCommand
          namespaced={`@${REGISTRY_NAME}/${item.name}`}
          url={`${REGISTRY_URL}/r/${item.name}.json`}
        />
      </section>

      {item.dependencies?.length || item.registryDependencies?.length ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Dependencies</h2>
          <ul className="flex flex-col gap-1 text-sm">
            {item.dependencies?.map((d) => (
              <li key={d}>
                npm: <code className="font-mono">{d}</code>
              </li>
            ))}
            {item.registryDependencies?.map((d) => (
              <li key={d}>
                registry: <code className="font-mono">{d}</code>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {item.cssVars ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">CSS variables</h2>
          <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-xs">
            <code>{JSON.stringify(item.cssVars, null, 2)}</code>
          </pre>
        </section>
      ) : null}

      {sources.length ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Source</h2>
          {sources.map((s) => (
            <figure key={s.path} className="flex flex-col gap-1">
              <figcaption className="font-mono text-xs text-muted-foreground">
                {s.target ?? s.path}
              </figcaption>
              <pre className="max-h-[480px] overflow-auto rounded-lg border bg-muted/40 p-4 text-xs">
                <code>{s.content}</code>
              </pre>
            </figure>
          ))}
        </section>
      ) : null}
    </div>
  )
}
