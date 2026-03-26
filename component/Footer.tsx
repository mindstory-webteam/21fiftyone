"use client";

const NAV_LINKS = {
  Services: ["Branding", "Web Design", "Development", "Strategy"],
  Resources: ["Privacy", "Terms", "Careers", "Instagram"],
};

const SOCIAL_ICONS = [
  {
    label: "Share",
    path: "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z",
  },
  {
    label: "Website",
    path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  },
];

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Barlow:wght@300;400;500;600&display=swap');

        /* ── CSS Variables ── */
        .footer {
          --color-bg: #f8f7f5;
          --color-border: #e2e0dc;
          --color-ink: #0d0d0d;
          --color-muted: #888;
          --color-faint: #b0aba4;
          --color-accent: #d42b2b;
          --font-serif: 'Cormorant Garamond', Georgia, serif;
          --font-sans: 'Barlow', sans-serif;

          width: 100%;
          background: var(--color-bg);
          border-top: 1px solid var(--color-border);
          font-family: var(--font-sans);
        }

        /* ── Main Grid ── */
        .footer-main {
          max-width: 1180px;
          margin: 0 auto;
          padding: 72px 64px 60px;
          display: grid;
          grid-template-columns: 260px 1fr 1fr 1fr;
          gap: 48px;
          align-items: start;
        }

        /* ── Brand Column ── */
        .footer-brand-logo {
          font-family: var(--font-serif);
          font-size: 22px;
          font-weight: 600;
          color: var(--color-ink);
          letter-spacing: -0.02em;
          margin-bottom: 18px;
          display: block;
          text-decoration: none;
        }
        .footer-brand-logo:hover {
          opacity: 0.8;
        }

        .footer-brand-tagline {
          font-size: 12.5px;
          color: var(--color-muted);
          line-height: 1.65;
          max-width: 200px;
          margin: 0 0 28px;
        }

        .footer-socials {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .footer-social-btn {
          width: 32px;
          height: 32px;
          border: 1px solid var(--color-border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-muted);
          text-decoration: none;
          transition: border-color 0.2s ease, color 0.2s ease;
          flex-shrink: 0;
          cursor: pointer;
        }
        .footer-social-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }
        .footer-social-btn svg {
          width: 13px;
          height: 13px;
          fill: currentColor;
          display: block;
        }

        /* ── Nav Columns ── */
        .footer-col-label {
          font-size: 8.5px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-ink);
          margin: 0 0 22px;
        }

        .footer-col-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .footer-col-links a {
          font-size: 11.5px;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-muted);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-col-links a:hover {
          color: var(--color-accent);
        }

        /* ── Contact Column ── */
        .footer-contact-address {
          font-size: 12.5px;
          color: var(--color-muted);
          line-height: 1.7;
          margin: 0 0 14px;
        }

        .footer-contact-email {
          font-size: 12.5px;
          font-weight: 500;
          color: var(--color-accent);
          text-decoration: none;
          transition: opacity 0.2s ease;
        }
        .footer-contact-email:hover {
          opacity: 0.75;
        }

        /* ── Bottom Bar ── */
        .footer-bottom {
          max-width: 1180px;
          margin: 0 auto;
          padding: 20px 64px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--color-border);
        }

        .footer-copyright {
          font-size: 9.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-faint);
        }

        .footer-badge {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footer-badge-box {
          width: 28px;
          height: 20px;
          background: #c8c4bc;
          border-radius: 2px;
        }

        .footer-badge-text {
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-faint);
        }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 48px 40px;
            padding: 56px 32px 48px;
          }
          .footer-bottom {
            padding: 18px 32px 24px;
          }
        }

        @media (max-width: 560px) {
          .footer-main {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 48px 24px 40px;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
            padding: 18px 24px 24px;
          }
        }
      `}</style>

      <footer className="footer">

        {/* ── Main Grid ── */}
        <div className="footer-main">

          {/* Brand */}
          <div className="footer-brand">
            <a href="/app/page.tsx" className="footer-brand-logo">21FiftyOne</a>
            <p className="footer-brand-tagline">
              Elevating brands through the art of digital alchemy and technical precision.
            </p>
            <div className="footer-socials">
              {SOCIAL_ICONS.map(({ label, path }) => (
                <a key={label} href="#" className="footer-social-btn" aria-label={label}>
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Nav Columns */}
          {Object.entries(NAV_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="footer-col-label">{heading}</p>
              <ul className="footer-col-links">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <p className="footer-col-label">Contact</p>
            <p className="footer-contact-address">
              Studio 2151, Creative District<br />
              New York, NY 10001
            </p>
            <a href="mailto:hello@21fiftyone.com" className="footer-contact-email">
              hello@21fiftyone.com
            </a>
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div className="footer-bottom">
          <span className="footer-copyright">
            © {new Date().getFullYear()} 21FiftyOne. All rights reserved.
          </span>
          <div className="footer-badge">
            <div className="footer-badge-box" aria-hidden="true" />
            <span className="footer-badge-text">The White Alchemist</span>
          </div>
        </div>

      </footer>
    </>
  );
}