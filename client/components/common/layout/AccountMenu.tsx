"use client"

import type { ReactNode } from "react"
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

type AccountMenuProps = {
  avatar: ReactNode
  name: string
  email?: string | null
  roleLabel: string
  children: ReactNode
}

const AccountMenu = ({ avatar, name, email, roleLabel, children }: AccountMenuProps) => {
  return (
    <DropdownMenuContent
      align="end"
      sideOffset={8}
      className="w-56 rounded-xl border border-border bg-card p-1.5 shadow-md data-open:animate-none data-closed:animate-none"
    >
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
          {avatar}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{name}</p>
          {email ? (
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          ) : null}
        </div>
        <span className="shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
          {roleLabel}
        </span>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>{children}</DropdownMenuGroup>
    </DropdownMenuContent>
  )
}

export default AccountMenu
