"use client";

import { useEffect, useRef, useState } from "react";

interface Work {
  id: number;
  index: string;
  num: string;
  category: string;
  title: string;
  desc: string;
  cta: string;
  video: string;
  poster: string;
}

const WORKS: Work[] = [
  {
    id: 1,
    index: "01",
    num: "01 / 05",
    category: "BRAND IDENTITY",
    title: "THE OBSIDIAN\nCOLLECTIVE",
    desc: "A tonal visual overhaul for a boutique fashion house, focusing on tonal layering and high-contrast typography.",
    cta: "VIEW CASE STUDY",
    video: "/videos/video-1.mp4",
    poster: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=900&q=80",
  },
  {
    id: 2,
    index: "02",
    num: "02 / 05",
    category: "DIGITAL CRAFT",
    title: "NOIR DIGITAL\nEXPERIENCE",
    desc: "An immersive web platform built for maximum conversion with cinematic precision and dark elegance.",
    cta: "VIEW CASE STUDY",
    video: "/videos/video-2.mp4",
    poster: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=900&q=80",
  },
  {
    id: 3,
    index: "03",
    num: "03 / 05",
    category: "CONTENT ALCHEMY",
    title: "PHANTOM\nFRAMES",
    desc: "A cinematic campaign for a global creative agency — three films, one narrative thread, zero compromises.",
    cta: "VIEW CASE STUDY",
    video: "/videos/video-3.mp4",
    poster: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=900&q=80",
  },
  {
    id: 4,
    index: "04",
    num: "04 / 05",
    category: "SOCIAL ECHO",
    title: "ECHO\nCHAMBER",
    desc: "A social strategy that turned a niche streetwear brand into a cultural moment felt across four continents.",
    cta: "VIEW CASE STUDY",
    video: "/videos/video-1.mp4",
    poster: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=900&q=80",
  },
  {
    id: 5,
    index: "05",
    num: "05 / 05",
    category: "MOTION & FILM",
    title: "VELVET\nSHADOWS",
    desc: "A short-form visual anthology exploring texture, light and the language of silence in motion design.",
    cta: "VIEW CASE STUDY",
    video: "/videos/video-2.mp4",
    poster: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=900&q=80",
  },
];

const TOTAL_STEPS = WORKS.length;

export default function SelectedWorks() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [activeCount, setActiveCount] = useState<number>(1);

  useEffect(() => {
    const onScroll = () => {
      const el = outerRef.current;
      if (!el) return;
      const rect   = el.getBoundingClientRect();
      const viewH  = window.innerHeight;
      const totalH = el.offsetHeight - viewH;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(scrolled / totalH, 1);
      const step  = progress * TOTAL_STEPS;
      const count = Math.min(Math.floor(step) + 1, WORKS.length);
      setActiveCount(count);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,900&family=Barlow:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --red:    #d42b2b;
          --black:  #0d0d0d;
          --bg:     #f8f7f5;
          --muted:  #888;
          --border: rgba(0,0,0,0.07);
        }

        /* ── Scrollable outer shell ── */
        .sw-outer {
          width: 100%;
          height: calc(100vh + ${WORKS.length} * 100vh);
          background: var(--bg);
          position: relative;
        }

        /* ── Sticky viewport ── */
        .sw-sticky {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: var(--bg);
          display: grid;
          grid-template-columns: 360px 1fr;
          grid-template-rows: 1fr auto;
        }

        /* ══════════════════════════════════
           LEFT PANEL
        ══════════════════════════════════ */
        .sw-left {
          grid-column: 1;
          grid-row: 1 / 3;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 56px 0 36px 72px;
          /* Removed border-right — replaced with subtle separator */
          position: relative;
          z-index: 2;
        }

        /* Thin separator line — only rendered as a pseudo-element, no visual "box" line */
        .sw-left::after {
          content: '';
          position: absolute;
          right: 0;
          top: 60px;
          bottom: 60px;
          width: 1px;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            var(--border) 20%,
            var(--border) 80%,
            transparent 100%
          );
        }

        .sw-left-top {}

        .sw-sup {
          display: block;
          font-family: 'Barlow', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.34em;
          color: #aaa;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .sw-h-solid {
          display: block;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(52px, 5.2vw, 80px);
          text-transform: uppercase;
          color: var(--black);
          line-height: 0.88;
          letter-spacing: -0.03em;
        }

        .sw-h-masked-row {
          display: block;
          line-height: 0.88;
          margin-top: 2px;
          margin-bottom: 28px;
        }
        .sw-masked-canvas {
          display: inline-block;
          vertical-align: bottom;
          height: clamp(46px, 4.8vw, 73px);
          width: auto;
        }

        .sw-sub {
          font-family: 'Barlow', sans-serif;
          font-size: 13.5px;
          font-weight: 400;
          line-height: 1.78;
          color: #666;
          max-width: 260px;
        }

        .sw-left-bottom {}

        /* ── Progress dots — FIXED: no extra visible bar ── */
        .sw-dots {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 14px;
        }
        .sw-dot {
          height: 2px;
          width: 20px;
          background: rgba(0,0,0,0.10);
          border-radius: 2px;
          transition: width 0.45s cubic-bezier(0.16,1,0.3,1), background 0.45s ease;
          flex-shrink: 0;
        }
        .sw-dot.on {
          width: 44px;
          background: var(--red);
        }

        .sw-left-count {
          font-family: 'Barlow', sans-serif;
          font-size: 8.5px;
          font-weight: 600;
          letter-spacing: 0.22em;
          color: var(--muted);
          text-transform: uppercase;
        }

        /* Vertical label */
        .sw-vert {
          position: absolute;
          bottom: 120px;
          left: -26px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.32em;
          color: rgba(0,0,0,0.12);
          text-transform: uppercase;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          pointer-events: none;
        }

        /* ══════════════════════════════════
           RIGHT PANEL
        ══════════════════════════════════ */
        .sw-right {
          grid-column: 2;
          grid-row: 1;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          padding: 0 72px 0 64px;
          gap: 52px;
        }

        /* ── Video card stack ── */
        .sw-cards-wrap {
          position: relative;
          flex-shrink: 0;
          width: 36vw;
          max-width: 500px;
          height: calc(100vh - 120px);
          display: flex;
          align-items: center;
        }

        .sw-card {
          position: absolute;
          width: 100%;
          border-radius: 6px;
          overflow: hidden;
          background: #111;
          transition:
            transform  0.9s cubic-bezier(0.16, 1, 0.3, 1),
            opacity    0.7s ease,
            box-shadow 0.6s ease;
          pointer-events: none;
          opacity: 0;
          will-change: transform, opacity;
        }
        .sw-card.visible { pointer-events: auto; opacity: 1; }
        .sw-card.top {
          box-shadow: 0 40px 100px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.12);
          z-index: 10;
        }

        .sw-card-media {
          width: 100%;
          aspect-ratio: 3 / 4;
          position: relative;
          overflow: hidden;
        }
        .sw-card-media video {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }
        .sw-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.08) 45%, transparent 65%);
        }
        .sw-card-num {
          position: absolute; top: 18px; left: 18px;
          font-family: 'Barlow', sans-serif;
          font-size: 9px; font-weight: 600; letter-spacing: 0.18em;
          color: rgba(255,255,255,0.92);
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 5px 13px; border-radius: 100px;
          text-transform: uppercase;
        }
        .sw-card-cat-bot {
          position: absolute; bottom: 20px; left: 20px;
          font-family: 'Barlow', sans-serif;
          font-size: 8.5px; font-weight: 600; letter-spacing: 0.26em;
          color: rgba(255,255,255,0.65); text-transform: uppercase;
        }

        /* ── Text panel beside card ── */
        .sw-text-wrap {
          flex: 1;
          position: relative;
          min-height: 320px;
          display: flex;
          align-items: center;
        }

        .sw-text-inner {
          position: absolute;
          inset: auto 0;
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.6s ease 0.08s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.08s;
          pointer-events: none;
          will-change: opacity, transform;
        }
        .sw-text-inner.active {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
          position: relative;
        }

        .sw-text-meta {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 22px;
        }
        .sw-text-idx {
          font-family: 'Barlow', sans-serif;
          font-size: 9px; font-weight: 600;
          letter-spacing: 0.2em; color: var(--red);
          text-transform: uppercase;
        }
        .sw-text-rule {
          flex: 1; max-width: 52px; height: 1px;
          background: rgba(0,0,0,0.10);
        }
        .sw-text-cat {
          font-family: 'Barlow', sans-serif;
          font-size: 9px; font-weight: 600;
          letter-spacing: 0.26em; color: var(--muted);
          text-transform: uppercase;
        }

        .sw-text-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(34px, 3.4vw, 56px);
          text-transform: uppercase;
          color: var(--black);
          letter-spacing: -0.025em;
          line-height: 0.93;
          white-space: pre-line;
          margin-bottom: 22px;
        }
        .sw-text-desc {
          font-family: 'Barlow', sans-serif;
          font-size: 13.5px; font-weight: 400;
          line-height: 1.82; color: #555;
          max-width: 340px; margin-bottom: 30px;
        }

        .sw-cta {
          display: inline-flex; align-items: center; gap: 14px;
          font-family: 'Barlow', sans-serif;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--black);
          background: none; border: none;
          cursor: pointer; padding: 0;
          transition: gap 0.28s cubic-bezier(0.16,1,0.3,1);
        }
        .sw-cta:hover { gap: 24px; }
        .sw-cta-line {
          width: 32px; height: 1px; flex-shrink: 0;
          background: var(--red); position: relative;
          transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .sw-cta-line::after {
          content: ''; position: absolute;
          right: 0; top: -2.5px;
          border-left: 5px solid var(--red);
          border-top: 3px solid transparent;
          border-bottom: 3px solid transparent;
        }
        .sw-cta:hover .sw-cta-line { width: 50px; }

        /* ══════════════════════════════════
           BOTTOM BAR — cleaned up, no hard lines
        ══════════════════════════════════ */
        .sw-bottom {
          grid-column: 2;
          grid-row: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 72px 28px 64px;
          /* Subtle fade-in separator instead of hard border */
          position: relative;
        }
        .sw-bottom::before {
          content: '';
          position: absolute;
          top: 0; left: 64px; right: 72px;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent 0%,
            var(--border) 15%,
            var(--border) 85%,
            transparent 100%
          );
        }

        .sw-bottom-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sw-bottom-count {
          font-family: 'Barlow', sans-serif;
          font-size: 8.5px;
          font-weight: 600;
          letter-spacing: 0.22em;
          color: var(--muted);
          text-transform: uppercase;
          min-width: 52px;
        }

        .sw-scroll-label {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Barlow', sans-serif;
          font-size: 8.5px; font-weight: 600;
          letter-spacing: 0.22em; color: #bbb;
          text-transform: uppercase;
        }
        .sw-scroll-label::before {
          content: ''; display: block;
          width: 28px; height: 1px; background: #ccc;
        }

        /* ══════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════ */
        @media (max-width: 1024px) {
          .sw-sticky {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr auto;
          }
          .sw-left {
            grid-column: 1; grid-row: 1;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: flex-start;
            justify-content: space-between;
            padding: 40px 28px 20px;
          }
          .sw-left::after { display: none; }
          .sw-left-bottom { display: none; }
          .sw-right {
            grid-column: 1; grid-row: 2;
            padding: 20px 28px;
            gap: 28px;
          }
          .sw-bottom {
            grid-column: 1; grid-row: 3;
            padding: 12px 28px 20px;
          }
          .sw-bottom::before { left: 28px; right: 28px; }
          .sw-vert { display: none; }
        }

        @media (max-width: 640px) {
          .sw-right { flex-direction: column; align-items: flex-start; }
          .sw-cards-wrap { width: 86vw; max-width: none; }
        }
      `}</style>

      <div className="sw-outer" ref={outerRef} id="selected-works">
        <div className="sw-sticky">

          {/* ══ LEFT PANEL ══ */}
          <aside className="sw-left">
            <div className="sw-left-top">
              <span className="sw-sup">Featured Portfolio</span>

              <span className="sw-h-solid">SELECTED</span>
              <span className="sw-h-masked-row">
                <MaskedCanvas
                  word="WORKS"
                  videoSrc="/videos/mask.mp4"
                  className="sw-masked-canvas"
                />
              </span>

              <p className="sw-sub">
                Curated projects where strategy meets cinematic craft —
                each piece built to resonate and endure.
              </p>
            </div>

            <div className="sw-left-bottom">
              <div className="sw-dots">
                {WORKS.map((_, i) => (
                  <div key={i} className={`sw-dot${i < activeCount ? " on" : ""}`} />
                ))}
              </div>
              <span className="sw-left-count">
                {String(activeCount).padStart(2, "0")} / {String(WORKS.length).padStart(2, "0")}
              </span>
            </div>

            <span className="sw-vert">Portfolio 2025</span>
          </aside>

          {/* ══ RIGHT PANEL ══ */}
          <div className="sw-right">

            {/* Stacked video cards */}
            <div className="sw-cards-wrap">
              {WORKS.map((work, i) => (
                <VideoCard
                  key={work.id}
                  work={work}
                  index={i}
                  activeCount={activeCount}
                  total={WORKS.length}
                />
              ))}
            </div>

            {/* Text alongside card */}
            <div className="sw-text-wrap">
              {WORKS.map((work, i) => {
                const isCurrent = i === activeCount - 1;
                return (
                  <div
                    key={work.id}
                    className={`sw-text-inner${isCurrent ? " active" : ""}`}
                    aria-hidden={!isCurrent}
                  >
                    <div className="sw-text-meta">
                      <span className="sw-text-idx">{work.index}</span>
                      <div className="sw-text-rule" />
                      <span className="sw-text-cat">{work.category}</span>
                    </div>
                    <h3 className="sw-text-title">{work.title}</h3>
                    <p className="sw-text-desc">{work.desc}</p>
                    <button className="sw-cta" type="button">
                      <span className="sw-cta-line" />
                      {work.cta}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ══ BOTTOM BAR ══ */}
          {/* <div className="sw-bottom">
            <div className="sw-bottom-left">
              <div className="sw-dots">
                {WORKS.map((_, i) => (
                  <div key={i} className={`sw-dot${i < activeCount ? " on" : ""}`} />
                ))}
              </div>
              <span className="sw-bottom-count">
                {String(activeCount).padStart(2, "0")} / {String(WORKS.length).padStart(2, "0")}
              </span>
            </div>
            <span className="sw-scroll-label">Scroll to explore</span>
          </div> */}

        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════
   VideoCard
══════════════════════════════════════ */
interface CardProps {
  work: Work;
  index: number;
  activeCount: number;
  total: number;
}

function VideoCard({ work, index, activeCount, total }: CardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVisible = index < activeCount;
  const isTop     = index === activeCount - 1;

  const stackBack  = activeCount - 1 - index;
  const stackX     = stackBack * 14;
  const stackY     = stackBack * 10;
  const stackScale = 1 - stackBack * 0.032;

  const transform = isVisible
    ? `translateX(${stackX}px) translateY(${stackY}px) scale(${stackScale})`
    : `translateX(100vw) scale(0.92)`;

  const opacity = isVisible
    ? isTop ? 1 : Math.max(0.28, 1 - stackBack * 0.25)
    : 0;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isTop) { v.play().catch(() => {}); }
    else { v.pause(); v.currentTime = 0; }
  }, [isTop]);

  return (
    <article
      className={`sw-card${isVisible ? " visible" : ""}${isTop ? " top" : ""}`}
      style={{
        transform,
        opacity,
        zIndex: index + 1,
        transitionDelay: isVisible ? `${(index % 3) * 0.04}s` : "0s",
      }}
    >
      <div className="sw-card-media">
        <video
          ref={videoRef}
          src={work.video}
          poster={work.poster}
          muted loop playsInline preload="metadata"
        />
        <div className="sw-card-overlay" />
        <span className="sw-card-num">{work.num}</span>
        <span className="sw-card-cat-bot">{work.category}</span>
      </div>
    </article>
  );
}

/* ══════════════════════════════════════
   MaskedCanvas — video-filled italic text
══════════════════════════════════════ */
interface MaskedCanvasProps {
  word: string;
  videoSrc: string;
  className: string;
}

function MaskedCanvas({ word, videoSrc, className }: MaskedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef  = useRef<HTMLVideoElement>(null);
  const rafRef    = useRef<number>(0);
  const readyRef  = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    function initSize() {
      if (!canvas || !ctx) return;
      const cssH = canvas.offsetHeight || 73;
      const fs = cssH * 0.96;
      ctx.font = `900 italic ${fs}px 'Barlow Condensed', sans-serif`;
      const tw = ctx.measureText(word).width;
      canvas.width  = Math.ceil(tw * dpr);
      canvas.height = Math.ceil(cssH * dpr);
      canvas.style.width  = `${Math.ceil(tw)}px`;
      canvas.style.height = `${cssH}px`;
    }

    function frame() {
      if (!canvas || !video || !ctx) return;
      const cW = canvas.width / dpr;
      const cH = canvas.height / dpr;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cW, cH);

      ctx.globalCompositeOperation = "source-over";
      if (readyRef.current && video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, cW, cH);
      } else {
        const t = (Date.now() % 3000) / 3000;
        const g = ctx.createLinearGradient(cW * t, 0, cW * (t + 0.65), cH);
        g.addColorStop(0,   "#a81008");
        g.addColorStop(0.4, "#e0361a");
        g.addColorStop(0.7, "#d42b2b");
        g.addColorStop(1,   "#6e0000");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, cW, cH);
      }

      ctx.globalCompositeOperation = "destination-in";
      ctx.font = `900 italic ${cH * 0.96}px 'Barlow Condensed', sans-serif`;
      ctx.textBaseline = "top";
      ctx.fillStyle = "#000";
      ctx.fillText(word, 0, cH * 0.03);
      ctx.restore();

      rafRef.current = requestAnimationFrame(frame);
    }

    document.fonts.ready.then(() => { initSize(); frame(); });

    video.crossOrigin = "anonymous";
    video.muted = true; video.loop = true;
    video.playsInline = true; video.src = videoSrc;

    const onCanPlay = () => { readyRef.current = true; video.play().catch(() => {}); };
    video.addEventListener("canplay", onCanPlay);

    const ro = new ResizeObserver(() => document.fonts.ready.then(() => initSize()));
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      video.removeEventListener("canplay", onCanPlay);
      ro.disconnect(); readyRef.current = false; video.src = "";
    };
  }, [word, videoSrc]);

  return (
    <>
      <video ref={videoRef} style={{ display: "none" }} muted loop playsInline />
      <canvas ref={canvasRef} className={className} aria-label={word} />
    </>
  );
}