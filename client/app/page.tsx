"use client"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { io } from "socket.io-client"

export default function Page() {
  useEffect(() => {
    const socket = io("http://localhost:8000")

    socket.on("connect", () => {
      console.log("Connected", socket.id)

      socket.emit("request", "Test Chat")
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2">Button</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
