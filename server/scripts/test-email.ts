import { sendEmail } from "@/services/mail/mailer";

// Usage: npx tsx scripts/test-email.ts [recipient]
// Defaults to the maintainer inbox. Never commit a real API key here —
// it is read from server/.env via src/config/env.ts
const to = process.argv[2] ?? "ando.kyle44@gmail.com";

async function main() {
  await sendEmail({
    to,
    subject: "AlumnAI Resend test",
    html: "<p>Resend is wired up. If you are reading this, transactional email works.</p>",
  });
  console.log(`Test email sent to ${to}`);
}

main().catch((err) => {
  console.error("Test email failed:", err);
  process.exit(1);
});
