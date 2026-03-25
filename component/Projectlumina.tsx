"use client";

import { useRef, useEffect, useState } from "react";

export default function ProjectLumina() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onReady = () => setLoaded(true);
    v.addEventListener("canplay", onReady);
    return () => v.removeEventListener("canplay", onReady);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ══ Section shell ══ */
        .pl-section {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 580px;
          overflow: hidden;
          background: #0d0d0d;
          display: flex;
          align-items: flex-end;
        }

        /* ══ Video ══ */
        .pl-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 0;
          transition: opacity 1.2s ease;
          pointer-events: none;
        }
        .pl-video.ready { opacity: 1; }

        /* ══ Overlay layers ══ */

        /* 1 — dark cinematic vignette */
        .pl-overlay-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 100% 100% at 50% 50%,
            transparent 30%,
            rgba(0,0,0,0.45) 70%,
            rgba(0,0,0,0.75) 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* 2 — bottom-to-top gradient so text pops */
        .pl-overlay-bottom {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.82) 0%,
            rgba(0,0,0,0.50) 28%,
            rgba(0,0,0,0.18) 55%,
            transparent 100%
          );
          pointer-events: none;
          z-index: 2;
        }

        /* 3 — top fade for nav bleed */
        .pl-overlay-top {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.40) 0%,
            transparent 22%
          );
          pointer-events: none;
          z-index: 2;
        }

        /* 4 — subtle red color grade */
        .pl-overlay-grade {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 60% 55% at 55% 40%,
            rgba(180,20,20,0.07) 0%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 2;
        }

        /* ══ Content ══ */
        .pl-content {
          position: relative;
          z-index: 10;
          width: 100%;
          padding: 0 72px 72px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* Eyebrow badge */
        .pl-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 6px 14px;
          border-radius: 100px;
          width: fit-content;
          margin-bottom: 22px;
          opacity: 0;
          transform: translateY(12px);
          animation: plFadeUp 0.7s ease 0.2s forwards;
        }
        .pl-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #d42b2b;
          flex-shrink: 0;
        }
        .pl-badge-text {
          font-family: 'Barlow', sans-serif;
          font-size: 9px; font-weight: 600;
          letter-spacing: 0.32em;
          color: rgba(255,255,255,0.75);
          text-transform: uppercase;
        }

        /* ══ TRANSPARENT HEADLINE ══ */
        .pl-headline-wrap {
          position: relative;
          line-height: 0.88;
          margin-bottom: 24px;
          opacity: 0;
          transform: translateY(18px);
          animation: plFadeUp 0.85s cubic-bezier(0.16,1,0.3,1) 0.35s forwards;
        }

        .pl-headline {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(68px, 10vw, 148px);
          text-transform: uppercase;
          letter-spacing: -0.03em;
          line-height: 0.88;
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0 0.18em;
        }

        /* "Project" — transparent / knockout text showing video through */
        .pl-word-ghost {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.55);
          /* On modern browsers: true video-through via mix-blend-mode */
          mix-blend-mode: screen;
          -webkit-text-fill-color: transparent;
          background: rgba(255,255,255,0.12);
          -webkit-background-clip: text;
          background-clip: text;
          text-shadow: none;
        }

        /* "Lumina" — solid red accent */
        .pl-word-accent {
          color: #d42b2b;
          -webkit-text-stroke: 0px;
          text-shadow:
            0 0 80px rgba(212,43,43,0.35),
            0 2px 40px rgba(212,43,43,0.2);
        }

        /* Sub description */
        .pl-desc {
          font-family: 'Barlow', sans-serif;
          font-size: 14.5px;
          font-weight: 300;
          line-height: 1.82;
          color: rgba(255,255,255,0.52);
          max-width: 360px;
          margin-bottom: 36px;
          opacity: 0;
          transform: translateY(14px);
          animation: plFadeUp 0.7s ease 0.55s forwards;
        }

        /* CTA row */
        .pl-cta-row {
          display: flex;
          align-items: center;
          gap: 24px;
          opacity: 0;
          transform: translateY(12px);
          animation: plFadeUp 0.7s ease 0.72s forwards;
        }

        .pl-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          background: #d42b2b;
          color: #fff;
          font-family: 'Barlow', sans-serif;
          font-size: 9.5px; font-weight: 700;
          letter-spacing: 0.26em; text-transform: uppercase;
          padding: 14px 26px;
          border: none; border-radius: 2px;
          cursor: pointer;
          transition: background 0.22s ease, gap 0.28s cubic-bezier(0.16,1,0.3,1);
        }
        .pl-btn-primary:hover { background: #b82020; gap: 22px; }
        .pl-btn-primary svg { flex-shrink: 0; transition: transform 0.28s ease; }
        .pl-btn-primary:hover svg { transform: translateX(4px); }

        .pl-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: none; border: none;
          color: rgba(255,255,255,0.45);
          font-family: 'Barlow', sans-serif;
          font-size: 9.5px; font-weight: 600;
          letter-spacing: 0.24em; text-transform: uppercase;
          cursor: pointer;
          transition: color 0.22s ease;
        }
        .pl-btn-ghost:hover { color: rgba(255,255,255,0.85); }

        /* ══ Bottom right corner meta ══ */
        .pl-meta {
          position: absolute;
          bottom: 72px; right: 72px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          opacity: 0;
          animation: plFadeUp 0.7s ease 0.9s forwards;
        }
        .pl-meta-label {
          font-family: 'Barlow', sans-serif;
          font-size: 8.5px; font-weight: 600;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.22);
          text-transform: uppercase;
        }
        .pl-meta-value {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.14em;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
        }

        /* ══ Top right scroll indicator ══ */
        .pl-scroll {
          position: absolute;
          top: 50%; right: 32px;
          transform: translateY(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: plFadeIn 1s ease 1.1s forwards;
        }
        .pl-scroll-line {
          width: 1px; height: 48px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.3));
        }
        .pl-scroll-label {
          font-family: 'Barlow', sans-serif;
          font-size: 7.5px; font-weight: 600;
          letter-spacing: 0.34em;
          color: rgba(255,255,255,0.25);
          text-transform: uppercase;
          writing-mode: vertical-rl;
        }

        /* ══ Keyframes ══ */
        @keyframes plFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes plFadeIn {
          to { opacity: 1; }
        }

        /* ══ Responsive ══ */
        @media (max-width: 768px) {
          .pl-content { padding: 0 28px 52px; }
          .pl-meta { display: none; }
          .pl-scroll { display: none; }
          .pl-cta-row { flex-direction: column; align-items: flex-start; gap: 12px; }
        }
      `}</style>

      <section className="pl-section">

        {/* ── Video background ── */}
        {/* Replace src with your own video URL */}
        <video
          ref={videoRef}
          className={`pl-video${loaded ? " ready" : ""}`}
          src="/videos/video-1.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />

        {/* ── Overlay layers ── */}
        <div className="pl-overlay-vignette" />
        <div className="pl-overlay-bottom"   />
        <div className="pl-overlay-top"      />
        <div className="pl-overlay-grade"    />

        {/* ── Main content ── */}
        <div className="pl-content">

          {/* Badge */}
          <div className="pl-badge">
            <div className="pl-badge-dot" />
            <span className="pl-badge-text">Featured Case Study</span>
          </div>

          {/* Headline — ghost + accent */}
          <div className="pl-headline-wrap">
            <h1 className="pl-headline">
              <span className="pl-word-ghost">Project</span>
              <span className="pl-word-accent">Lumina</span>
            </h1>
          </div>

          {/* Description */}
          <p className="pl-desc">
            Redefining the digital ecosystem for a global luxury
            automotive house through noir-inspired architectural design.
          </p>

          {/* CTAs */}
          <div className="pl-cta-row">
            <button type="button" className="pl-btn-primary">
              View Case Study
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5H13M9 1L13 5L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button type="button" className="pl-btn-ghost">
              All Projects
            </button>
          </div>
        </div>

        {/* ── Bottom-right meta ── */}
        <div className="pl-meta">
          <span className="pl-meta-label">Category</span>
          <span className="pl-meta-value">Brand Identity</span>
          <span className="pl-meta-label" style={{ marginTop: 10 }}>Year</span>
          <span className="pl-meta-value">2025</span>
        </div>

        {/* ── Scroll indicator ── */}
        <div className="pl-scroll">
          <div className="pl-scroll-line" />
          <span className="pl-scroll-label">Scroll</span>
        </div>

      </section>
    </>
  );
}