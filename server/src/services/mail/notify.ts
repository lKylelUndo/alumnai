import { renderTemplate } from "@/utils/template";
import { sendEmail } from "@/services/mail/mailer";

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
