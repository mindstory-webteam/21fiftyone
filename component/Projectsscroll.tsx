"use client";

import { useEffect, useRef, useState } from "react";

const projects = [
  {
    id: 1,
    name: "LOUIS VUITTON\nASNIERES",
    category: "SOCIAL QUEST",
    year: "2024",
    tags: ["Brand Experience", "Digital"],
    video: "/videos/video-1.webm",
    poster: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=90",
  },
  {
    id: 2,
    name: "HERMES\nODYSSEY",
    category: "FRAGRANCE FINDER",
    year: "2024",
    tags: ["Interactive", "Luxury"],
    video: "/videos/video-2.webm",
    poster: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=90",
  },
  {
    id: 3,
    name: "LA MER\nRITUAL",
    category: "SKINCARE PRINT",
    year: "2023",
    tags: ["Campaign", "Print"],
    video: "/videos/video-3.webm",
    poster: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=1200&q=90",
  },
  {
    id: 4,
    name: "MARLY\nGARDEN",
    category: "PRINT LUXE PARFUM",
    year: "2023",
    tags: ["Editorial", "Fragrance"],
    video: "/videos/video-1.webm",
    poster: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=1200&q=90",
  },
  {
    id: 5,
    name: "PARIS\nBERLIN",
    category: "SOCIAL QUEST II",
    year: "2023",
    tags: ["Social", "Motion"],
    video: "/videos/video-2.webm",
    poster: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=90",
  },
  {
    id: 6,
    name: "LOUIS VUITTON\nGRASSE",
    category: "SOCIAL QUEST II",
    year: "2022",
    tags: ["Heritage", "Digital"],
    video: "/videos/video-3.webm",
    poster: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=90",
  },
] as const;

const TOTAL = projects.length;

function VideoPanel({ video, poster, active }: { video: string; poster: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) { if (v.paused) v.play().catch(() => {}); }
    else { v.pause(); v.currentTime = 0; }
  }, [active]);
  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <video
        ref={ref} src={video} poster={poster}
        muted loop playsInline preload="metadata"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}

export default function ProjectsScroll() {
  // Start at 0 — first item is always active by default
  const [current, setCurrent] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* ── Scroll progress (0..1) for list translate effect ── */
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const scrolled = -rect.top;
        const total = rect.height - window.innerHeight;
        const progress = Math.max(0, Math.min(1, scrolled / total));
        // Each slide = 1/TOTAL of total progress
        const next = Math.min(TOTAL - 1, Math.floor(progress * TOTAL));
        setCurrent(prev => prev !== next ? next : prev);
        setScrollProgress(progress);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSlide = (idx: number) => {
    const container = containerRef.current;
    if (!container) return;
    const h = container.offsetHeight - window.innerHeight;
    window.scrollTo({ top: (idx / TOTAL) * h + container.offsetTop, behavior: "smooth" });
  };

  const displayIndex = hoveredIndex !== null ? hoveredIndex : current;
  const slide = projects[displayIndex];

  // List translate: as user scrolls, list moves up to keep active item centred
  // Each item is ~90px tall approx; we shift list up by (current * itemHeight)
  const listTranslateY = -(current * 90);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&family=Barlow:wght@300;400;500;600&display=swap');

        .ps-root, .ps-root *, .ps-root *::before, .ps-root *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .ps-root {
          width: 100%;
          background: #f8f7f5;
          font-family: 'Barlow', sans-serif;
        }

        /* ══════════════════════════════════════
           BIG HEADING
        ══════════════════════════════════════ */
        .ps-heading-block {
          width: 100%;
          padding: 100px 60px 0;
          background: #f8f7f5;
          overflow: hidden;
        }
        .ps-heading-eyebrow {
          display: flex;
          align-items: center;
          gap: 14px;
          font-family: 'Barlow', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.44em;
          text-transform: uppercase;
          color: #d42b2b;
          margin-bottom: 28px;
        }
        .ps-heading-eyebrow::before {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: #d42b2b;
          flex-shrink: 0;
        }
        .ps-heading-title {
          display: block;
          font-family: 'Barlow Condensed', sans-serif;
          font-style: italic;
          font-weight: 900;
          font-size: clamp(7rem, 20vw, 24rem);
          line-height: 0.80;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: #0d0d0d;
          white-space: nowrap;
        }
        .ps-heading-sub {
          display: block;
          font-family: 'Barlow Condensed', sans-serif;
          font-style: italic;
          font-weight: 900;
          font-size: clamp(3.5rem, 10vw, 12rem);
          line-height: 0.85;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: rgba(13,13,13,0.06);
          white-space: nowrap;
          margin-top: 8px;
        }
        .ps-heading-divider {
          width: 100%;
          height: 1px;
          background: rgba(13,13,13,0.09);
          margin-top: 48px;
        }

        /* ══════════════════════════════════════
           SCROLL SECTION
        ══════════════════════════════════════ */
        .ps-scroll-section {
          position: relative;
          height: ${TOTAL * 100}vh;
          width: 100%;
        }
        .ps-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 500px;
          overflow: hidden;
        }

        /* ── LEFT VIDEO ── */
        .ps-video-panel {
          position: relative;
          width: 100%;
          height: 100%;
          background: #0d0d0d;
          overflow: hidden;
        }
        .ps-video-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.75s cubic-bezier(0.23,1,0.32,1);
        }
        .ps-video-slide.ps-vid-on { opacity: 1; }
        .ps-video-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to right, transparent 50%, rgba(248,247,245,0.05) 100%),
            linear-gradient(to bottom, rgba(13,13,13,0.3) 0%, transparent 30%,
              transparent 60%, rgba(13,13,13,0.65) 100%);
          z-index: 2;
          pointer-events: none;
        }
        .ps-video-info {
          position: absolute;
          bottom: 56px;
          left: 56px;
          z-index: 10;
          pointer-events: none;
        }
        .ps-vi-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Barlow', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          color: #d42b2b;
          margin-bottom: 12px;
        }
        .ps-vi-eyebrow::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: #d42b2b;
          flex-shrink: 0;
        }
        .ps-vi-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-style: italic;
          font-weight: 900;
          font-size: clamp(4rem, 8vw, 9rem);
          line-height: 0.84;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          white-space: pre-line;
          color: #f8f7f5;
          text-shadow: 0 4px 60px rgba(0,0,0,0.5);
        }
        .ps-vi-tags {
          display: flex;
          gap: 8px;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        .ps-vi-tag {
          font-family: 'Barlow', sans-serif;
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(248,247,245,0.6);
          border: 1px solid rgba(248,247,245,0.22);
          padding: 5px 12px;
          border-radius: 20px;
        }

        /* ══════════════════════════════════════
           RIGHT LIST PANEL
        ══════════════════════════════════════ */
        .ps-list-panel {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #f8f7f5;
          overflow: hidden;          /* clips items scrolling out of view */
        }

        /* top "selected work" label */
        .ps-list-label {
          position: absolute;
          top: 44px;
          left: 52px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Barlow', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          color: #d42b2b;
          z-index: 5;
        }
        .ps-list-label::after {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: #d42b2b;
        }

        /* Fade masks top & bottom so items fade out as they scroll */
        .ps-list-panel::before,
        .ps-list-panel::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          height: 120px;
          z-index: 4;
          pointer-events: none;
        }
        .ps-list-panel::before {
          top: 0;
          background: linear-gradient(to bottom, #f8f7f5 0%, transparent 100%);
        }
        .ps-list-panel::after {
          bottom: 0;
          background: linear-gradient(to top, #f8f7f5 0%, transparent 100%);
        }

        /* Scrolling list viewport */
        .ps-list-viewport {
          position: relative;
          width: 100%;
          /* Enough height to show ~3 items at once */
          height: calc(3 * 110px);
          overflow: hidden;
          z-index: 3;
        }

        /* The actual scrolling track — translated via JS */
        .ps-list-track {
          position: absolute;
          top: 0; left: 0; right: 0;
          transition: transform 0.55s cubic-bezier(0.23,1,0.32,1);
          padding: 0 56px 0 52px;
        }

        /* Item */
        .ps-item {
          position: relative;
          height: 110px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0;
          border-bottom: 1px solid rgba(13,13,13,0.08);
          cursor: pointer;
          transition:
            padding-left 0.4s cubic-bezier(0.23,1,0.32,1),
            opacity 0.4s ease;
          opacity: 0.28;
        }
        .ps-item:first-child { border-top: 1px solid rgba(13,13,13,0.08); }

        /* Active / hover state */
        .ps-item.ps-on {
          opacity: 1;
          padding-left: 20px;
        }
        .ps-item:hover { opacity: 0.7; }
        .ps-item.ps-on:hover { opacity: 1; }

        /* Red left bar */
        .ps-item.ps-on::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 56%;
          background: #d42b2b;
          border-radius: 2px;
        }

        /* Row: num + name + year */
        .ps-item-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .ps-num {
          font-family: 'Barlow', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.16em;
          color: #cccccc;
          min-width: 26px;
          flex-shrink: 0;
          transition: color 0.3s;
        }
        .ps-item.ps-on .ps-num { color: #d42b2b; }

        .ps-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-style: italic;
          font-weight: 900;
          font-size: clamp(1.5rem, 2.9vw, 2.6rem);
          line-height: 0.88;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          white-space: pre-line;
          color: #0d0d0d;
          flex: 1;
        }
        .ps-year {
          font-family: 'Barlow', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.12em;
          color: #aaaaaa;
          flex-shrink: 0;
          transition: color 0.3s;
        }
        .ps-item.ps-on .ps-year { color: #666; }

        /* Meta: category + dot + tags */
        .ps-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
          padding-left: 42px;
          flex-wrap: wrap;
        }
        .ps-cat {
          font-family: 'Barlow', sans-serif;
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #d42b2b;
          white-space: nowrap;
        }
        .ps-sep {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(13,13,13,0.18);
          flex-shrink: 0;
        }
        .ps-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .ps-tag {
          font-family: 'Barlow', sans-serif;
          font-size: 7.5px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #888888;
          border: 1px solid rgba(13,13,13,0.12);
          padding: 3px 10px;
          border-radius: 20px;
          white-space: nowrap;
        }

        /* ── Nav dots ── */
        .ps-dots {
          position: absolute;
          right: 20px; top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 9px;
          z-index: 10;
        }
        .ps-dot {
          width: 2px; height: 16px;
          border-radius: 2px;
          background: rgba(13,13,13,0.10);
          cursor: pointer;
          transition: height 0.35s ease, background 0.35s ease;
        }
        .ps-dot.ps-on { height: 38px; background: #d42b2b; }

        /* ── Counter ── */
        .ps-counter {
          position: absolute;
          bottom: 32px; right: 56px;
          font-family: 'Barlow', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.22em;
          color: #bbbbbb;
          z-index: 10;
        }
        .ps-counter strong { color: #0d0d0d; font-weight: 600; }

        /* ── Progress bar ── */
        .ps-progress {
          position: absolute;
          bottom: 0; left: 0;
          height: 2px;
          background: #d42b2b;
          transition: width 0.5s cubic-bezier(0.23,1,0.32,1);
          z-index: 10;
        }

        /* ── Scroll hint ── */
        .ps-hint {
          position: absolute;
          bottom: 32px; left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          pointer-events: none;
          transition: opacity 0.4s;
          z-index: 10;
        }
        .ps-hint-label {
          font-family: 'Barlow', sans-serif;
          font-size: 7.5px;
          font-weight: 600;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: #bbbbbb;
        }
        .ps-hint-line {
          width: 1px; height: 34px;
          background: #dddddd;
          position: relative; overflow: hidden;
        }
        .ps-hint-line::after {
          content: '';
          position: absolute;
          top: -100%; left: 0;
          width: 100%; height: 100%;
          background: #d42b2b;
          animation: ps-drop 1.5s ease-in-out infinite;
        }
        @keyframes ps-drop { 0% { top: -100%; } 100% { top: 100%; } }

        @media (max-width: 900px) {
          .ps-sticky { grid-template-columns: 1fr; }
          .ps-list-panel { display: none; }
          .ps-heading-block { padding: 80px 28px 0; }
        }
      `}</style>

      <div className="ps-root">

        {/* ── BIG HEADING ── */}
        <div className="ps-heading-block">
          <p className="ps-heading-eyebrow">Detroit Studio — Paris</p>
          <span className="ps-heading-title">SELECTED</span>
          <span className="ps-heading-sub">WORK 2022–2024</span>
          <div className="ps-heading-divider" />
        </div>

        {/* ── SCROLL SECTION ── */}
        <div className="ps-scroll-section" ref={containerRef}>
          <div className="ps-sticky">

            {/* LEFT: Video */}
            <div className="ps-video-panel">
              {projects.map((p, i) => (
                <div key={p.id} className={`ps-video-slide${i === displayIndex ? " ps-vid-on" : ""}`}>
                  <VideoPanel video={p.video} poster={p.poster} active={i === displayIndex} />
                </div>
              ))}
              <div className="ps-video-overlay" />
              <div className="ps-video-info">
                <p className="ps-vi-eyebrow">{slide.category}</p>
                <h2 className="ps-vi-title">{slide.name}</h2>
                <div className="ps-vi-tags">
                  {slide.tags.map(t => <span key={t} className="ps-vi-tag">{t}</span>)}
                </div>
              </div>
            </div>

            {/* RIGHT: Scrolling List */}
            <div className="ps-list-panel">
              <p className="ps-list-label">Selected Work</p>

              {/* Viewport clips the list; track slides up via transform */}
              <div className="ps-list-viewport">
                <div
                  className="ps-list-track"
                  style={{
                    transform: `translateY(${110 - current * 110}px)`,
                  }}
                >
                  {projects.map((p, i) => {
                    const isOn = current === i || hoveredIndex === i;
                    return (
                      <div
                        key={p.id}
                        ref={el => { itemRefs.current[i] = el; }}
                        className={`ps-item${isOn ? " ps-on" : ""}`}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => scrollToSlide(i)}
                      >
                        <div className="ps-item-row">
                          <span className="ps-num">{String(i + 1).padStart(2, "0")}</span>
                          <h3 className="ps-name">{p.name}</h3>
                          <span className="ps-year">{p.year}</span>
                        </div>
                        <div className="ps-meta">
                          <span className="ps-cat">{p.category}</span>
                          <span className="ps-sep" />
                          <div className="ps-tags">
                            {p.tags.map(t => <span key={t} className="ps-tag">{t}</span>)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Nav dots */}
              <div className="ps-dots">
                {projects.map((_, i) => (
                  <div
                    key={i}
                    className={`ps-dot${i === current ? " ps-on" : ""}`}
                    onClick={() => scrollToSlide(i)}
                  />
                ))}
              </div>

              {/* Counter */}
              <div className="ps-counter">
                <strong>{String(current + 1).padStart(2, "0")}</strong> / {String(TOTAL).padStart(2, "0")}
              </div>

              {/* Progress */}
              <div className="ps-progress" style={{ width: `${((current + 1) / TOTAL) * 100}%` }} />

              {/* Scroll hint */}
              <div className="ps-hint" style={{ opacity: current === 0 ? 1 : 0 }}>
                <span className="ps-hint-label">Scroll</span>
                <div className="ps-hint-line" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}