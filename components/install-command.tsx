"use client"

import * as React from "react"

import { Button } from "@/registry/new-york/button/components/button"

const managers = {
  bun: "bunx --bun shadcn@latest add",
  pnpm: "pnpm dlx shadcn@latest add",
  npm: "npx shadcn@latest add",
  yarn: "yarn dlx shadcn@latest add",
} as const

export function InstallCommand({
  namespaced,
  url,
}: {
  namespaced: string
  url: string
}) {
  const [pm, setPm] = React.useState<keyof typeof managers>("bun")
  const [mode, setMode] = React.useState<"namespace" | "url">("namespace")
  const [copied, setCopied] = React.useState(false)
  const command = `${managers[pm]} ${mode === "namespace" ? namespaced : url}`

  async function copy() {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div className="rounded-lg border">
      <div className="flex flex-wrap items-center gap-1 border-b p-2" role="tablist">
        {(Object.keys(managers) as (keyof typeof managers)[]).map((k) => (
          <Button
            key={k}
            role="tab"
            aria-selected={pm === k}
            size="sm"
            variant={pm === k ? "secondary" : "ghost"}
            onClick={() => setPm(k)}
          >
            {k}
          </Button>
        ))}
        <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
        {(["namespace", "url"] as const).map((m) => (
          <Button
            key={m}
            size="sm"
            aria-pressed={mode === m}
            variant={mode === m ? "secondary" : "ghost"}
            onClick={() => setMode(m)}
          >
            {m === "namespace" ? "@designduck" : "URL"}
          </Button>
        ))}
      </div>
      <div className="flex items-center justify-between gap-2 p-3">
        <code className="overflow-x-auto font-mono text-sm">{command}</code>
        <Button size="sm" variant="outline" onClick={copy} aria-live="polite">
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  )
}
