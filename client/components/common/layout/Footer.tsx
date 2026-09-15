import Image from "next/image"
import Link from "next/link"

const footerLinks = {
  platform: [
    { label: "Find Mentors", href: "/login" },
    { label: "Find Collaborators", href: "/login" },
    { label: "Skill Analysis", href: "/login" },
    { label: "Curriculum Insights", href: "/login" },
  ],
  connect: [
    { label: "Email", href: "mailto:info@alumnai.com" },
    { label: "LinkedIn", href: "https://linkedin.com", external: true },
    { label: "Facebook", href: "https://facebook.com", external: true },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <Image
              src="/logo/logoalumnai.png"
              width={140}
              height={76}
              alt="alumnAI"
              loading="lazy"
              sizes="140px"
              className="h-10 w-auto"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#434657]">
              AI-powered platform connecting CPC computing students and alumni
              through verified, evidence-based skill profiles.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#131b2e]">Platform</h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#434657] transition-colors hover:text-[#1A216D]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#131b2e]">Connect</h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.connect.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-sm text-[#434657] transition-colors hover:text-[#1A216D]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#E2E8F0] pt-6 text-center text-sm text-[#434657]">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-[#131b2e]">alumnAI</span>. All
          rights reserved.
        </div>
      </div>
    </footer>
  )
}
