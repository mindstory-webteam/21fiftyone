"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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

      // Show/hide on scroll direction
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      // Add shadow/border when scrolled
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

        .floating-nav {
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%) translateY(0);
          width: calc(100% - 48px);
          max-width: 1280px;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          height: 60px;
          z-index: 1000;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.3s ease,
                      background 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .floating-nav.hidden {
          transform: translateX(-50%) translateY(-110%);
        }

        .floating-nav.scrolled {
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06);
          background: rgba(255, 255, 255, 0.98);
        }

        /* Logo */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .nav-logo-icon {
          width: 28px;
          height: 28px;
          background: #f0ede8;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 11px;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }

        .nav-logo-text {
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        /* Center links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 36px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .nav-link {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: #888;
          text-decoration: none;
          position: relative;
          padding: 4px 0;
          transition: color 0.2s ease;
          white-space: nowrap;
        }

        .nav-link:hover {
          color: #1a1a1a;
        }

        .nav-link.active {
          color: #d42b2b;
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 1.5px;
          background: #d42b2b;
          border-radius: 1px;
        }

        /* CTA Button */
        .nav-cta {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .nav-cta-btn {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #fff;
          background: #d42b2b;
          border: none;
          border-radius: 3px;
          padding: 10px 20px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.15s ease;
          white-space: nowrap;
          display: inline-block;
        }

        .nav-cta-btn:hover {
          background: #b82222;
          transform: translateY(-1px);
        }

        .nav-cta-btn:active {
          transform: translateY(0);
        }

        /* Mobile hamburger */
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
          background: #1a1a1a;
          transition: all 0.3s ease;
        }

        /* Mobile menu */
        .mobile-menu {
          position: fixed;
          top: 88px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 48px);
          max-width: 1280px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(12px);
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          z-index: 999;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.3s ease;
          opacity: 0;
        }

        .mobile-menu.open {
          max-height: 300px;
          opacity: 1;
        }

        .mobile-menu-inner {
          padding: 16px 28px 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mobile-nav-link {
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: #888;
          text-decoration: none;
          padding: 10px 0;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          transition: color 0.2s ease;
        }

        .mobile-nav-link:last-child {
          border-bottom: none;
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          color: #d42b2b;
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .nav-hamburger {
            display: flex;
          }
          .floating-nav {
            width: calc(100% - 32px);
            padding: 0 20px;
          }
          .mobile-menu {
            width: calc(100% - 32px);
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
          <div className="nav-logo-icon">21</div>
          <span className="nav-logo-text">21FiftyOne</span>
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
        <div className="nav-cta">
          <Link href="/shop" className="nav-cta-btn">
            SHOP NOW
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="nav-hamburger"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span
            style={
              mobileOpen
                ? { transform: "rotate(45deg) translate(4px, 4px)" }
                : {}
            }
          />
          <span style={mobileOpen ? { opacity: 0 } : {}} />
          <span
            style={
              mobileOpen
                ? { transform: "rotate(-45deg) translate(4px, -4px)" }
                : {}
            }
          />
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