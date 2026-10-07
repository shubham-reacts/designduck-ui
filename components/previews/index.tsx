import * as React from "react"

import { Button } from "@/registry/new-york/button/components/button"
import { LoginForm } from "@/registry/new-york/login-01/components/login-form"
import { UseDebounceDemo } from "@/components/previews/use-debounce-demo"

export const previews: Record<string, React.ReactNode> = {
  button: (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
      <Button loading>Saving</Button>
    </div>
  ),
  "use-debounce": <UseDebounceDemo />,
  "login-01": <LoginForm />,
}
