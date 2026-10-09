import { renderTemplate } from "@/utils/template";
import { sendEmail } from "@/services/mail/mailer";
import { prisma } from "@/lib/prisma";
import { isUserOnline, notifyUser } from "@/lib/socket";

type NotificationEmail = {
  /** Service name, used as the log prefix so Render logs stay greppable. */
  service: string;
  to: string | null | undefined;
  template: string;
  data: Record<string, string>;
  subject: string;
};

/**
 * Best-effort notification email.
 *
 * A failed notification must never fail the business operation that
 * triggered it — the mutation already succeeded, so log the failure
 * (skipping blank recipients loudly) and let the caller return success.
 */
export async function sendNotificationEmail({ service, to, template, data, subject }: NotificationEmail) {
  try {
    if (!to) {
      console.warn(`[${service}] Skipping "${template}" email: recipient address is missing`);
      return;
    }
    const html = renderTemplate(template, data);
    await sendEmail({ to, subject, html });
  } catch (error) {
    console.error(`[${service}] Notification email "${template}" failed:`, error);
  }
}

type NotifyPeerParams = {
  /** Service name for log prefixes. */
  service: string;
  /** Recipient user id (the non-acting party). */
  userId: string;
  /** Recipient email; supply when known, otherwise the helper looks it up. */
  to?: string | null;
  /** Realtime event, used ONLY when the recipient is online. */
  event: string;
  /** Realtime targets, used ONLY when the recipient is online. */
  targets: string[];
  /** Realtime message, used ONLY when the recipient is online. */
  message: string;
  /** Offline-only email content. */
  template: string;
  emailData: Record<string, string>;
  subject: string;
};

/**
 * Route one peer-to-peer notification by the recipient's presence:
 * a live socket gets the realtime event ONLY, an offline recipient gets the
 * email ONLY — never both — so Resend quota is only spent on offline users.
 *
 * Deliberately no retry on either branch: the mutation that triggered this has
 * already succeeded, so a failed lookup or a failed send is logged (with the
 * service prefix) and swallowed rather than failing the enclosing operation.
 */
export async function notifyPeer({
  service,
  userId,
  to,
  event,
  targets,
  message,
  template,
  emailData,
  subject,
}: NotifyPeerParams) {
  try {
    if (isUserOnline(userId)) {
      notifyUser(userId, event, { targets, message });
      return;
    }

    let address = to?.trim() || null;

    if (!address) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { email: true },
        });
        address = user?.email?.trim() || null;
      } catch (error) {
        console.error(`[${service}] Email lookup failed for user ${userId}:`, error);
        return;
      }
    }

    if (!address) {
      console.warn(`[${service}] Skipping "${template}" email for user ${userId}: recipient address is missing`);
      return;
    }

    await sendNotificationEmail({ service, to: address, template, data: emailData, subject });
  } catch (error) {
    console.error(`[${service}] Peer notification for user ${userId} failed:`, error);
  }
}
