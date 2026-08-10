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
          <DialogTitle className="text-xl font-bold text-[#1A216D]">
            {isStudent ? "Send Collaboration Invite" : "Apply for Mentorship"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Send an invitation message to{" "}
            <span className="font-semibold text-gray-700">
              {fullName || "User"}
            </span>
          </DialogDescription>
        </DialogHeader>

        {inviteSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            <p className="font-semibold text-emerald-700">
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
              className="w-full text-sm border-gray-300 focus:border-[#1877F2]"
            />

            {inviteError && (
              <p className="text-xs text-red-600 font-medium">{inviteError}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={sendingInvite}
              >
                Cancel
              </Button>
              <Button
                onClick={onSendInvite}
                disabled={sendingInvite}
                className="bg-[#1877F2] hover:bg-[#1565C0] text-white"
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