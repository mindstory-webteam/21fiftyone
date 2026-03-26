"use client";

import { useEffect, useRef, useState } from "react";

export default function BreakTheMold() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@300;400;600;700&display=swap');

        .btm-section {
          position: relative;
          width: 100%;
          min-height: 520px;
          background: #0d0d0d;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* ── Ambient red glow ── */
        .btm-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 60% at 40% 55%, rgba(212,43,43,0.09) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── Large background numeral ── */
        .btm-bg-num {
          position: absolute;
          right: -24px;
          bottom: -60px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(200px, 28vw, 340px);
          font-weight: 900;
          color: rgba(255,255,255,0.03);
          line-height: 1;
          letter-spacing: -0.05em;
          pointer-events: none;
          user-select: none;
        }

        /* ── Thin horizontal rule at top ── */
        .btm-top-rule {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent 100%);
        }

        /* ── Thin horizontal rule at bottom ── */
        .btm-bottom-rule {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent 100%);
        }

        /* ── Corner markers ── */
        .btm-corner {
          position: absolute;
          width: 18px;
          height: 18px;
          pointer-events: none;
          opacity: 0.2;
        }
        .btm-corner.tl { top: 22px; left: 36px; border-top: 1px solid #fff; border-left: 1px solid #fff; }
        .btm-corner.tr { top: 22px; right: 36px; border-top: 1px solid #fff; border-right: 1px solid #fff; }
        .btm-corner.bl { bottom: 22px; left: 36px; border-bottom: 1px solid #fff; border-left: 1px solid #fff; }
        .btm-corner.br { bottom: 22px; right: 36px; border-bottom: 1px solid #fff; border-right: 1px solid #fff; }

        /* ── Bottom meta labels ── */
        .btm-meta-left {
          position: absolute;
          bottom: 30px; left: 48px;
          display: flex; align-items: center; gap: 10px;
          opacity: 0; transition: opacity 0.8s ease 0.9s;
        }
        .btm-meta-left.show { opacity: 0.28; }
        .btm-meta-left-line {
          width: 22px; height: 1px; background: #fff; flex-shrink: 0;
        }
        .btm-meta-left-text {
          font-family: 'Barlow', sans-serif;
          font-size: 8.5px; font-weight: 600;
          letter-spacing: 0.3em; color: #fff;
          text-transform: uppercase;
        }

        .btm-meta-right {
          position: absolute;
          bottom: 30px; right: 48px;
          opacity: 0; transition: opacity 0.8s ease 1s;
        }
        .btm-meta-right.show { opacity: 0.2; }
        .btm-meta-right-text {
          font-family: 'Barlow', sans-serif;
          font-size: 8.5px; font-weight: 600;
          letter-spacing: 0.3em; color: #fff;
          text-transform: uppercase;
        }

        /* ══════════════════
           CENTER CONTENT
        ══════════════════ */
        .btm-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 80px 40px;
          max-width: 760px;
          width: 100%;
        }

        /* Eyebrow */
        .btm-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 36px;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.6s ease 0.1s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s;
        }
        .btm-eyebrow.show { opacity: 1; transform: translateY(0); }
        .btm-eyebrow-line {
          width: 28px; height: 1px;
          background: rgba(212,43,43,0.75); flex-shrink: 0;
        }
        .btm-eyebrow-text {
          font-family: 'Barlow', sans-serif;
          font-size: 9.5px; font-weight: 600;
          letter-spacing: 0.34em; color: #d42b2b;
          text-transform: uppercase;
        }

        /* Headline */
        .btm-headline {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(56px, 9vw, 108px);
          text-transform: uppercase;
          line-height: 0.88;
          letter-spacing: -0.03em;
          margin: 0 0 32px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease 0.22s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.22s;
        }
        .btm-headline.show { opacity: 1; transform: translateY(0); }

        .btm-headline-solid {
          display: block;
          color: #ffffff;
        }

        .btm-headline-outline {
          display: block;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.22);
        }

        /* Subtext */
        .btm-sub {
          font-family: 'Barlow', sans-serif;
          font-size: 14px; font-weight: 400;
          line-height: 1.82;
          color: rgba(255,255,255,0.42);
          max-width: 420px;
          margin: 0 auto 44px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.65s ease 0.38s, transform 0.65s cubic-bezier(0.16,1,0.3,1) 0.38s;
        }
        .btm-sub.show { opacity: 1; transform: translateY(0); }

        /* CTA */
        .btm-cta-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.6s ease 0.52s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.52s;
        }
        .btm-cta-wrap.show { opacity: 1; transform: translateY(0); }

        .btm-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          background: #d42b2b;
          color: #ffffff;
          font-family: 'Barlow', sans-serif;
          font-size: 9.5px; font-weight: 700;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 15px 28px;
          border-radius: 2px;
          border: none;
          cursor: pointer;
          transition: background 0.25s ease, gap 0.28s cubic-bezier(0.16,1,0.3,1);
        }
        .btm-btn-primary:hover {
          background: #b82020;
          gap: 22px;
        }
        .btm-btn-primary svg {
          flex-shrink: 0;
          transition: transform 0.28s cubic-bezier(0.16,1,0.3,1);
        }
        .btm-btn-primary:hover svg {
          transform: translateX(4px);
        }

        .btm-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: none;
          color: rgba(255,255,255,0.55);
          font-family: 'Barlow', sans-serif;
          font-size: 9.5px; font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 15px 0;
          border: none;
          cursor: pointer;
          transition: color 0.22s ease;
        }
        .btm-btn-ghost:hover { color: rgba(255,255,255,0.9); }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .btm-content { padding: 64px 24px; }
          .btm-cta-wrap { flex-direction: column; gap: 8px; }
          .btm-corner { display: none; }
          .btm-meta-left, .btm-meta-right { display: none; }
        }
      `}</style>

      <section className="btm-section" ref={sectionRef}>

        {/* Ambient effects */}
        <div className="btm-glow" />
        <div className="btm-bg-num">1</div>
        <div className="btm-top-rule" />
        <div className="btm-bottom-rule" />

        {/* Corner markers */}
        <div className="btm-corner tl" />
        <div className="btm-corner tr" />
        <div className="btm-corner bl" />
        <div className="btm-corner br" />

        {/* Bottom meta */}
        <div className={`btm-meta-left${visible ? " show" : ""}`}>
          <div className="btm-meta-left-line" />
          <span className="btm-meta-left-text">Studio 2025</span>
        </div>
        <div className={`btm-meta-right${visible ? " show" : ""}`}>
          <span className="btm-meta-right-text">Based Worldwide</span>
        </div>

        {/* Main content */}
        <div className="btm-content">

          {/* Eyebrow */}
          <div className={`btm-eyebrow${visible ? " show" : ""}`}>
            <div className="btm-eyebrow-line" />
            <span className="btm-eyebrow-text">Let s Create Together</span>
            <div className="btm-eyebrow-line" />
          </div>

          {/* Headline */}
          <h2 className={`btm-headline${visible ? " show" : ""}`}>
            <span className="btm-headline-solid">READY TO BREAK</span>
            <span className="btm-headline-outline">THE MOLD?</span>
          </h2>

          {/* Subtext */}
          <p className={`btm-sub${visible ? " show" : ""}`}>
            Let s collaborate on your next masterpiece. Our studio
            doors are always open for the brave.
          </p>

          {/* CTAs */}
          <div className={`btm-cta-wrap${visible ? " show" : ""}`}>
            <button type="button" className="btm-btn-primary">
              Connect With The Studio
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path
                  d="M1 5H13M9 1L13 5L9 9"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button type="button" className="btm-btn-ghost">
              View Our Work
            </button>
          </div>

        </div>
      </section>
    </>
  );
}