"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Loader2 } from "lucide-react"

interface InviteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isStudent: boolean
  fullName?: string
  inviteMessage: string
  onMessageChange: (message: string) => void
  sendingInvite: boolean
  inviteSuccess: boolean
  inviteError: string | null
  onSendInvite: () => void
}

export default function InviteDialog({
  open,
  onOpenChange,
  isStudent,
  fullName,
  inviteMessage,
  onMessageChange,
  sendingInvite,
  inviteSuccess,
  inviteError,
  onSendInvite,
}: InviteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            {isStudent ? "Send Collaboration Invite" : "Apply for Mentorship"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Send an invitation message to{" "}
            <span className="font-semibold text-foreground">
              {fullName || "User"}
            </span>
          </DialogDescription>
        </DialogHeader>

        {inviteSuccess ? (
          <div className="flex flex-col items-center justify-center gap-2 py-6">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            <p className="font-semibold text-emerald-600">
              {isStudent ? "Collaboration Invite Sent!" : "Mentorship Request Sent!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Write a message..."
              value={inviteMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              rows={4}
              className="w-full text-sm"
            />

            {inviteError && (
              <p className="text-xs font-medium text-destructive">{inviteError}</p>
            )}

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={sendingInvite}
                className="h-11 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={onSendInvite}
                disabled={sendingInvite}
                className="h-11 w-full bg-primary text-white hover:bg-primary/90 sm:w-auto"
              >
                {sendingInvite ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : isStudent ? (
                  "Send Collaboration Invite"
                ) : (
                  "Apply for Mentorship"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}