"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "COLLECTIONS", href: "/collections" },
  { label: "EDITORIAL", href: "/editorial" },
  { label: "ARCHIVE", href: "/archive" },
  { label: "STUDIO", href: "/studio" },
];

export default function FloatingNavbar() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("EDITORIAL");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setScrolled(currentScrollY > 20);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Montserrat:wght@400;500;600;700&display=swap');

        /* ── iOS Glass Token ── */
        :root {
          --glass-bg:        rgba(255, 255, 255, 0.55);
          --glass-bg-deep:   rgba(255, 255, 255, 0.72);
          --glass-border:    rgba(255, 255, 255, 0.75);
          --glass-shadow:    0 8px 32px rgba(212, 43, 43, 0.08),
                             0 2px 12px rgba(0, 0, 0, 0.08),
                             inset 0 1px 0 rgba(255,255,255,0.9);
          --glass-shadow-deep: 0 16px 48px rgba(212, 43, 43, 0.14),
                               0 4px 16px rgba(0, 0, 0, 0.10),
                               inset 0 1px 0 rgba(255,255,255,1);
          --accent:          #d42b2b;
          --accent-dark:     #b82222;
          --accent-glow:     rgba(212, 43, 43, 0.18);
          --text-primary:    #1a1a1a;
          --text-muted:      #888;
          --blur:            saturate(180%) blur(20px);
          --blur-deep:       saturate(200%) blur(28px);
        }

        /* ── Navbar ── */
        .floating-nav {
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%) translateY(0);
          width: calc(100% - 48px);
          max-width: 1280px;
          background: var(--glass-bg);
          backdrop-filter: var(--blur);
          -webkit-backdrop-filter: var(--blur);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 58px;
          z-index: 1000;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.35s ease,
                      background 0.35s ease,
                      border-color 0.35s ease;
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
        }

        .floating-nav::before {
          content: '';
          position: absolute;
          top: 0; left: 20px; right: 20px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(212,43,43,0.35) 30%,
            rgba(212,43,43,0.55) 50%,
            rgba(212,43,43,0.35) 70%,
            transparent 100%
          );
          border-radius: 1px;
          pointer-events: none;
        }

        .floating-nav.hidden {
          transform: translateX(-50%) translateY(-120%);
        }

        .floating-nav.scrolled {
          background: var(--glass-bg-deep);
          backdrop-filter: var(--blur-deep);
          -webkit-backdrop-filter: var(--blur-deep);
          border-color: rgba(255,255,255,0.85);
        }

        /* ── Logo ── */
        .nav-logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          text-decoration: none;
        }

        .nav-logo-img {
          height: 36px;
          width: auto;
          object-fit: contain;
          display: block;
          transition: opacity 0.2s ease;
        }

        .nav-logo:hover .nav-logo-img {
          opacity: 0.82;
        }

        /* ── Center links ── */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .nav-link {
          font-family: 'Montserrat', sans-serif;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          text-decoration: none;
          position: relative;
          padding: 6px 12px;
          border-radius: 10px;
          transition: color 0.2s ease, background 0.2s ease;
          white-space: nowrap;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: rgba(0,0,0,0.04);
        }

        .nav-link.active {
          color: var(--accent);
          background: rgba(212, 43, 43, 0.09);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(212,43,43,0.18);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.6),
                      0 1px 4px rgba(212,43,43,0.12);
        }

        /* ── CTA ── */
        .nav-cta {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .nav-cta-btn {
          font-family: 'Montserrat', sans-serif;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #fff;
          background: linear-gradient(135deg, #d42b2b 0%, #b82222 100%);
          border: none;
          border-radius: 11px;
          padding: 9px 18px;
          cursor: pointer;
          text-decoration: none;
          transition: box-shadow 0.2s ease, transform 0.15s ease, filter 0.2s ease;
          white-space: nowrap;
          display: inline-block;
          box-shadow: 0 2px 10px rgba(212,43,43,0.38),
                      inset 0 1px 0 rgba(255,255,255,0.22);
        }

        .nav-cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(212,43,43,0.48),
                      inset 0 1px 0 rgba(255,255,255,0.22);
          filter: brightness(1.06);
        }

        .nav-cta-btn:active {
          transform: translateY(0);
          filter: brightness(0.96);
        }

        /* ── Mobile hamburger ── */
        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 4px;
          background: none;
          border: none;
        }

        .nav-hamburger span {
          display: block;
          width: 22px;
          height: 1.5px;
          background: var(--text-primary);
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        /* ── Mobile menu ── */
        .mobile-menu {
          position: fixed;
          top: 86px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 48px);
          max-width: 1280px;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: saturate(180%) blur(24px);
          -webkit-backdrop-filter: saturate(180%) blur(24px);
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.75);
          box-shadow: 0 12px 40px rgba(212,43,43,0.1),
                      0 4px 16px rgba(0,0,0,0.08),
                      inset 0 1px 0 rgba(255,255,255,0.9);
          z-index: 999;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.42s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.3s ease;
          opacity: 0;
        }

        .mobile-menu.open {
          max-height: 320px;
          opacity: 1;
        }

        .mobile-menu-inner {
          padding: 12px 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mobile-nav-link {
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          text-decoration: none;
          padding: 11px 12px;
          border-radius: 10px;
          transition: color 0.2s ease, background 0.2s ease;
        }

        .mobile-nav-link:hover {
          color: var(--text-primary);
          background: rgba(0,0,0,0.04);
        }

        .mobile-nav-link.active {
          color: var(--accent);
          background: rgba(212,43,43,0.08);
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-hamburger { display: flex; }
          .floating-nav {
            width: calc(100% - 32px);
            padding: 0 18px;
          }
          .mobile-menu {
            width: calc(100% - 32px);
            top: 84px;
          }
        }
      `}</style>

      <FloatingNavInner
        visible={visible}
        scrolled={scrolled}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
      />
    </>
  );
}

interface FloatingNavInnerProps {
  visible: boolean;
  scrolled: boolean;
  activeLink: string;
  setActiveLink: (link: string) => void;
}

function FloatingNavInner({
  visible,
  scrolled,
  activeLink,
  setActiveLink,
}: FloatingNavInnerProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav
        className={[
          "floating-nav",
          !visible ? "hidden" : "",
          scrolled ? "scrolled" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="nav-logo">
          <Image
            src="/logo/2151-logo.png"
            alt="21FiftyOne"
            height={36}
            width={120}
            className="nav-logo-img"
            style={{ width: "auto", height: "36px" }}
            priority
          />
        </Link>

        {/* Center Nav Links */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`nav-link ${activeLink === link.label ? "active" : ""}`}
              onClick={() => setActiveLink(link.label)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        {/* <div className="nav-cta">
          <Link href="/shop" className="nav-cta-btn">
            SHOP NOW
          </Link>
        </div> */}

        {/* Mobile Hamburger */}
        <button
          className="nav-hamburger"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span style={mobileOpen ? { transform: "rotate(45deg) translate(4px, 4px)" } : {}} />
          <span style={mobileOpen ? { opacity: 0 } : {}} />
          <span style={mobileOpen ? { transform: "rotate(-45deg) translate(4px, -4px)" } : {}} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <div className="mobile-menu-inner">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`mobile-nav-link ${activeLink === link.label ? "active" : ""}`}
              onClick={() => {
                setActiveLink(link.label);
                setMobileOpen(false);
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}