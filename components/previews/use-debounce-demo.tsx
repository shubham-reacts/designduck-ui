"use client"

import * as React from "react"

import { useDebounce } from "@/registry/new-york/use-debounce/hooks/use-debounce"
import { Input } from "@/registry/new-york/ui/input"

export function UseDebounceDemo() {
  const [value, setValue] = React.useState("")
  const debounced = useDebounce(value, 500)
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Input
        aria-label="Type to see the debounced value"
        placeholder="Type something"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p className="text-sm text-muted-foreground">
        Debounced (500ms): <span className="font-mono">{debounced || "-"}</span>
      </p>
    </div>
  )
}
