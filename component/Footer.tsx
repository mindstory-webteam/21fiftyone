"use client";

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Barlow:wght@300;400;500;600&display=swap');

        .footer {
          width: 100%;
          background: #f8f7f5;
          border-top: 1px solid #e2e0dc;
          font-family: 'Barlow', sans-serif;
        }

        /* ── Main grid ── */
        .footer-main {
          max-width: 1180px;
          margin: 0 auto;
          padding: 72px 64px 60px;
          display: grid;
          grid-template-columns: 260px 1fr 1fr 1fr;
          gap: 48px;
          align-items: start;
        }

        /* ── Brand col ── */
        .footer-brand-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: #0d0d0d;
          letter-spacing: -0.02em;
          margin-bottom: 18px;
          display: block;
          text-decoration: none;
        }

        .footer-brand-tagline {
          font-size: 12.5px;
          font-weight: 400;
          color: #888;
          line-height: 1.65;
          max-width: 200px;
          margin-bottom: 28px;
        }

        .footer-socials {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .footer-social-btn {
          width: 32px;
          height: 32px;
          border: 1px solid #d8d5d0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
          flex-shrink: 0;
        }
        .footer-social-btn:hover {
          border-color: red;
          color: red;
        }
        .footer-social-btn svg {
          width: 13px;
          height: 13px;
          fill: currentColor;
        }

        /* ── Nav cols ── */
        .footer-col-label {
          font-size: 8.5px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #0d0d0d;
          margin-bottom: 22px;
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
          color: #888;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-col-links a:hover { color: red; }

        /* ── Contact col ── */
        .footer-contact-address {
          font-size: 12.5px;
          font-weight: 400;
          color: #888;
          line-height: 1.7;
          margin-bottom: 14px;
        }

        .footer-contact-email {
          font-size: 12.5px;
          font-weight: 500;
          color: #d42b2b;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .footer-contact-email:hover { opacity: 0.75; }

        /* ── Bottom bar ── */
        .footer-bottom {
          max-width: 1180px;
          margin: 0 auto;
          padding: 20px 64px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #e2e0dc;
        }

        .footer-copyright {
          font-size: 9.5px;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #b0aba4;
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
          color: #b0aba4;
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
        <div className="footer-main">

          {/* ── Brand ── */}
          <div className="footer-brand">
           <a href="/" className="footer-brand-logo">21FiftyOne</a>
            <p className="footer-brand-tagline">
              Elevating brands through the art of digital alchemy and technical precision.
            </p>
            <div className="footer-socials">
              {/* Share icon */}
              <a href="#" className="footer-social-btn" aria-label="Share">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
              </a>
              {/* Globe / web icon */}
              <a href="#" className="footer-social-btn" aria-label="Website">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* ── Services ── */}
          <div>
            <p className="footer-col-label">Services</p>
            <ul className="footer-col-links">
              <li><a href="#">Branding</a></li>
              <li><a href="#">Web Design</a></li>
              <li><a href="#">Development</a></li>
              <li><a href="#">Strategy</a></li>
            </ul>
          </div>

          {/* ── Resources ── */}
          <div>
            <p className="footer-col-label">Resources</p>
            <ul className="footer-col-links">
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Instagram</a></li>
            </ul>
          </div>

          {/* ── Contact ── */}
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

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <span className="footer-copyright">
            © 2024 21FiftyOne. All rights reserved.
          </span>
          <div className="footer-badge">
            <div className="footer-badge-box" />
            <span className="footer-badge-text">The White Alchemist</span>
          </div>
        </div>
      </footer>
    </>
  );
}