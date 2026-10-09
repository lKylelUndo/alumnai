"use client"

import { Loader2 } from "lucide-react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmEndDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel: string
  pendingLabel?: string
  isPending?: boolean
}

export default function ConfirmEndDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel,
  pendingLabel = "Ending...",
  isPending = false,
}: ConfirmEndDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 p-0" showCloseButton={true}>
        <DialogHeader className="border-b px-6 pt-6 pb-5">
          <DialogTitle className="text-xl font-bold text-primary">{title}</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 border-t px-6 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1"
              disabled={isPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            className="h-11 flex-1"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {pendingLabel}
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
