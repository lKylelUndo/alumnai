import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-3">
          {/* Logo Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo/logoalumnai.png"
                width={250}
                height={200}
                alt="Logo"
              />
            </div>
            <p className="max-w-xs text-sm text-slate-500">
              AI-powered institutional platform that connects computing students
              with alumni.
            </p>
          </div>

          {/* Pages Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-semibold text-slate-900">Pages</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-sm text-slate-600 transition hover:text-[#2D7EE2]"
                >
                  Find Collaborators
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-slate-600 transition hover:text-[#2D7EE2]"
                >
                  Find Mentors
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-slate-600 transition hover:text-[#2D7EE2]"
                >
                  Skill Analysis
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-slate-600 transition hover:text-[#2D7EE2]"
                >
                  Curriculum Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-semibold text-slate-900">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:info@alumnai.com"
                  className="text-sm text-slate-600 transition hover:text-[#2D7EE2]"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-600 transition hover:text-[#2D7EE2]"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-600 transition hover:text-[#2D7EE2]"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-100 pt-6 text-center text-sm text-[#636669]">
          © {new Date().getFullYear()} <span className="font-bold">alumnAI</span>. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
