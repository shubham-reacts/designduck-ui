import Link from "next/link"

import { REGISTRY_NAME, REGISTRY_URL, getItems } from "@/lib/registry"

export default function Home() {
  const items = getItems()
  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{REGISTRY_NAME}</h1>
        <p className="text-muted-foreground">
          A shadcn-style component registry. Install any item with{" "}
          <code className="font-mono">npx shadcn@latest add @{REGISTRY_NAME}/&lt;item&gt;</code>.
        </p>
      </header>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Setup</h2>
        <p className="text-sm text-muted-foreground">
          Add the namespace once to your project&apos;s <code>components.json</code>:
        </p>
        <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-xs">
          <code>{`"registries": {\n  "@${REGISTRY_NAME}": "${REGISTRY_URL}/r/{name}.json"\n}`}</code>
        </pre>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Items</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.name}>
              <Link
                href={`/docs/${item.name}`}
                className="flex h-full flex-col gap-1 rounded-lg border p-4 hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none"
              >
                <span className="font-medium">{item.title}</span>
                <span className="font-mono text-xs text-muted-foreground">{item.type}</span>
                <span className="text-sm text-muted-foreground">{item.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
