import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

type ProfileCardHeaderProps = {
  icon: LucideIcon
  title: string
  description?: string
  badge?: ReactNode
  action?: ReactNode
}

const ProfileCardHeader = ({ icon: Icon, title, description, badge, action }: ProfileCardHeaderProps) => {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-foreground">{title}</h2>
          {badge}
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="ml-auto shrink-0">{action}</div>}
    </div>
  )
}

export default ProfileCardHeader
