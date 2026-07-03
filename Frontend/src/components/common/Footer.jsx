import { Link } from "react-router-dom";
import { FaGithub, FaXTwitter, FaLinkedin } from 'react-icons/fa6'
import logo from "../../assets/logos/logo.png";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Pricing", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socials = [
  {
    icon: FaGithub,
    href: "#",
    label: "GitHub",
  },
  {
    icon: FaXTwitter,
    href: "#",
    label: "Twitter",
  },
  {
    icon: FaLinkedin,
    href: "#",
    label: "LinkedIn",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="SkillSyncAI"
                className="h-10 w-10"
              />

              <span className="text-xl font-bold text-slate-900">
                SkillSyncAI
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-slate-500">
              AI-powered career matching that connects
              your skills with opportunities tailored
              specifically for you.
            </p>

            <div className="mt-6 flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 transition hover:border-violet-600 hover:text-violet-600"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 font-semibold text-slate-900">
                {title}
              </h4>

              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-slate-500 transition hover:text-violet-600"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} SkillSyncAI. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
