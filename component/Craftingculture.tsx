"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import BugSectionEffect from "./Bugsectioneffect";

const TOTAL = 5;

const SLIDES = [
  {
    key: "s1",
    layout: "split-right",
    cols: "1fr 1fr",
    textBg: "#f8f7f5",
    titleColor: "#0d0d0d",
    subtitleColor: "#555",
    title: "CRAFTING\nCULTURE",
    subtitle:
      "Detroit — AI Production House in Paris, crafting culture for luxury brands. Print & Film. AI. 3D. CGI.",
    video: "/videos/video-1.webm",
    poster:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=90",
    thumbs: [
      "https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=200&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=80",
    ],
    cursorDark: false,
  },
  {
    key: "s2",
    layout: "split-right",
    cols: "0.9fr 1.1fr",
    textBg: "#0d0d0d",
    titleColor: "#f8f7f5",
    subtitleColor: "#888",
    title: "PRINT\n&\nFILM",
    subtitle:
      "Where visual storytelling meets technical mastery. Every frame a statement.",
    video: "/videos/video-2.webm",
    poster:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=90",
    cursorDark: true,
  },
  {
    key: "s3",
    layout: "split-left",
    cols: "1.2fr 0.8fr",
    textBg: "#f0ebe3",
    titleColor: "#0d0d0d",
    subtitleColor: "#555",
    title: "AI.\n3D.\nCGI.",
    subtitle:
      "Pushing the boundaries of image-making with next-gen tools & human vision.",
    video: "/videos/video-3.webm",
    poster:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=90",
    cursorDark: false,
  },
  {
    key: "s4",
    layout: "fullbleed",
    cols: "1fr",
    textBg: "transparent",
    titleColor: "#f8f7f5",
    subtitleColor: "rgba(248,247,245,0.65)",
    title: "LUXURY\nBRANDS",
    subtitle:
      "Louis Vuitton. Hermès. Dom Pérignon. Chanel. We craft their culture.",
    video: "/videos/video-1.webm",
    poster:
      "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1600&q=90",
    cursorDark: true,
  },
  {
    key: "s5",
    layout: "split-right",
    cols: "0.85fr 1.15fr",
    textBg: "#d9cfc3",
    titleColor: "#0d0d0d",
    subtitleColor: "#555",
    title: "PARIS\nPRODUCTION\nHOUSE",
    subtitle: "Detroit — Where artistry meets artifice. Where culture is made.",
    video: "/videos/video-2.webm",
    poster:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=90",
    smallTitle: true,
    cursorDark: false,
  },
] as const;

/* ─────────────────────────────────────────────────────
   VideoPanel — memoised, stable ref, no re-mount on scroll
───────────────────────────────────────────────────── */
function VideoPanel({
  video,
  poster,
  active,
}: {
  video: string;
  poster: string;
  active: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) {
      // Only play if not already playing
      if (v.paused) v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [active]);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    >
      <video
        ref={ref}
        src={video}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────── */
export default function CraftingCulture() {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef    = useRef<HTMLDivElement>(null);
  const cursorRef    = useRef<HTMLDivElement | null>(null);

  /* ── Cursor: all DOM-direct, zero React re-renders ── */
  const targetRef     = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });
  const rafRef        = useRef<number>(0);
  const isOverTextRef = useRef(false);

  /* rAF lerp loop — runs forever after mount */
  useEffect(() => {
    const loop = () => {
      const el = cursorRef.current;
      if (el) {
        const tx = targetRef.current.x;
        const ty = targetRef.current.y;
        const cx = currentPosRef.current.x;
        const cy = currentPosRef.current.y;
        const nx = cx + (tx - cx) * 0.14;
        const ny = cy + (ty - cy) * 0.14;
        currentPosRef.current = { x: nx, y: ny };
        el.style.transform = `translate(${nx - 60}px, ${ny - 60}px)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // empty deps — runs once, loop is self-contained

  /* Single native mousemove on the sticky wrapper — no React synthetic overhead */
  useEffect(() => {
    const sticky = stickyRef.current;
    if (!sticky) return;

    const onMove = (e: MouseEvent) => {
      const r = sticky.getBoundingClientRect();
      targetRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };

      /* Check if the mouse is actually over a .cc-text panel */
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const overText = !!(hit?.closest(".cc-text"));

      const el = cursorRef.current;
      if (!el) return;

      if (overText && !isOverTextRef.current) {
        isOverTextRef.current = true;
        el.style.opacity = "1";
        // Read dark flag from the parent slide element
        const slideEl = hit?.closest("[data-cursor-dark]");
        const isDark  = slideEl?.getAttribute("data-cursor-dark") === "true";
        if (isDark) el.classList.add("cc-cursor-dark");
        else        el.classList.remove("cc-cursor-dark");
      } else if (!overText && isOverTextRef.current) {
        isOverTextRef.current = false;
        el.style.opacity = "0";
      }
    };

    const onLeave = () => {
      isOverTextRef.current = false;
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
    };

    sticky.addEventListener("mousemove", onMove);
    sticky.addEventListener("mouseleave", onLeave);
    return () => {
      sticky.removeEventListener("mousemove", onMove);
      sticky.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ── Scroll → current slide ── */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const container = containerRef.current;
        if (!container) return;
        const rect     = container.getBoundingClientRect();
        const scrolled = -rect.top;
        const total    = rect.height - window.innerHeight;
        const progress = Math.max(0, Math.min(1, scrolled / total));
        const next     = Math.min(TOTAL - 1, Math.floor(progress * TOTAL));
        setCurrent((prev) => (prev !== next ? next : prev));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSlide = useCallback((idx: number) => {
    const container = containerRef.current;
    if (!container) return;
    const h = container.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: (idx / TOTAL) * h + container.offsetTop,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&family=Barlow:wght@300;400;500;600&display=swap');

        .cc-wrap *, .cc-wrap *::before, .cc-wrap *::after {
          box-sizing: border-box; margin: 0; padding: 0;
        }
        .cc-wrap {
          position: relative;
          height: 500vh;
          width: 100%;
          font-family: 'Barlow', sans-serif;
        }

        /* sticky container — no overflow:hidden (breaks sticky) */
        .cc-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          background: #f8f7f5;
        }

        /* ── Slides ── */
        .cc-slide {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.6s ease;
          display: grid;
          grid-template-rows: 1fr;
          pointer-events: none;
        }
        .cc-slide.cc-active {
          opacity: 1;
          pointer-events: auto;
        }

        .cc-text {
          position: relative;
          z-index: 2;
          padding: 56px 52px 52px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0;
          cursor: none;
        }

        .cc-label {
          font-family: 'Barlow', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: #d42b2b;
          margin-bottom: 18px;
          display: block;
        }

        .cc-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-style: italic;
          font-weight: 900;
          font-size: clamp(60px, 10vw, 140px);
          line-height: 0.88;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          white-space: pre-line;
          margin-bottom: 28px;
        }
        .cc-title-sm { font-size: clamp(44px, 7vw, 100px) !important; }

        .cc-subtitle {
          font-family: 'Barlow', sans-serif;
          font-size: 13.5px;
          font-weight: 400;
          line-height: 1.78;
          max-width: 280px;
        }

        .cc-thumbs { display: flex; gap: 10px; margin-top: 28px; }
        .cc-thumb {
          width: 68px; height: 88px;
          overflow: hidden; opacity: 0.72;
          transition: opacity 0.3s; flex-shrink: 0; border-radius: 2px;
        }
        .cc-thumb:hover { opacity: 1; }
        .cc-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* Full bleed slide */
        .cc-slide-fb { position: absolute; inset: 0; }
        .cc-fb-video { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
        .cc-fb-video video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .cc-fb-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to right, rgba(13,13,13,0.78) 36%, transparent 76%);
          z-index: 1;
        }
        .cc-slide-fb .cc-text {
          position: absolute;
          top: 0; left: 0;
          width: 50%; height: 100%;
          z-index: 2;
        }

        /* ════════════════════════════════════════
           EXPLORE CURSOR
        ════════════════════════════════════════ */
        .cc-cursor-explore {
          position: absolute;
          top: 0; left: 0;
          width: 120px; height: 120px;
          pointer-events: none;
          z-index: 9000;
          opacity: 0;
          will-change: transform, opacity;
          transition: opacity 0.18s ease;
        }

        .cc-cursor-ring {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .cc-cursor-circle {
          fill: rgba(212,43,43,0.10);
          stroke: #d42b2b;
          stroke-width: 1;
        }
        .cc-cursor-dash {
          fill: none;
          stroke: rgba(212,43,43,0.38);
          stroke-width: 0.8;
          stroke-dasharray: 5 9;
          animation: cc-cursor-spin 6s linear infinite;
          transform-origin: 60px 60px;
        }
        @keyframes cc-cursor-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* dark variant */
        .cc-cursor-dark .cc-cursor-circle {
          fill: rgba(248,247,245,0.08);
          stroke: rgba(248,247,245,0.75);
        }
        .cc-cursor-dark .cc-cursor-dash { stroke: rgba(248,247,245,0.30); }
        .cc-cursor-dark .cc-cursor-label { color: #f8f7f5; }

        .cc-cursor-label {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          color: #0d0d0d;
          transition: color 0.2s ease;
        }
        .cc-cursor-word {
          font-family: 'Barlow', sans-serif;
          font-size: 8.5px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }
        .cc-cursor-arrow { opacity: 0.7; }

        /* ── Bug isolation layer — sits above slides, below cursor ── */
        .cc-bug-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 300;
        }
        /* Force BugSectionEffect child to fill the layer */
        .cc-bug-layer > * {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          pointer-events: none !important;
        }

        /* ── Nav dots ── */
        .cc-dots {
          position: absolute; right: 28px; top: 50%;
          transform: translateY(-50%);
          z-index: 200;
          display: flex; flex-direction: column; gap: 10px;
        }
        .cc-dot {
          width: 2px; height: 20px; border-radius: 2px;
          background: rgba(0,0,0,0.12);
          transition: height 0.35s ease, background 0.35s ease;
          cursor: pointer;
        }
        .cc-dot.cc-on { height: 44px; background: #d42b2b; }

        /* ── Scroll hint ── */
        .cc-hint {
          position: absolute; bottom: 28px; left: 50%;
          transform: translateX(-50%);
          z-index: 200;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          transition: opacity 0.5s; pointer-events: none;
        }
        .cc-hint span {
          font-family: 'Barlow', sans-serif; font-size: 8.5px; font-weight: 600;
          letter-spacing: 0.32em; text-transform: uppercase; color: #888;
        }
        .cc-hint-line {
          width: 1px; height: 40px; background: #ccc;
          position: relative; overflow: hidden;
        }
        .cc-hint-line::after {
          content: ''; position: absolute; top: -100%; left: 0;
          width: 100%; height: 100%; background: #d42b2b;
          animation: cc-drop 1.4s ease-in-out infinite;
        }
        @keyframes cc-drop { 0% { top: -100%; } 100% { top: 100%; } }

        /* ── Counter ── */
        .cc-ctr {
          position: absolute; bottom: 28px; right: 40px; z-index: 200;
          font-family: 'Barlow', sans-serif; font-size: 8.5px; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase; color: #aaa;
        }
        .cc-ctr b { color: #0d0d0d; font-weight: 600; }
      `}</style>

      <div className="cc-wrap" ref={containerRef}>
        <div className="cc-sticky" ref={stickyRef}>

          {SLIDES.map((slide, i) => {
            const isActive = i === current;
            const isFull   = slide.layout === "fullbleed";
            const isLeft   = slide.layout === "split-left";
            const dark     = "cursorDark" in slide ? !!slide.cursorDark : false;

            /* ── FULL BLEED ── */
            if (isFull) {
              return (
                <div
                  key={slide.key}
                  data-cursor-dark={dark ? "true" : "false"}
                  className={`cc-slide cc-slide-fb${isActive ? " cc-active" : ""}`}
                >
                  <div className="cc-fb-video">
                    <VideoPanel video={slide.video} poster={slide.poster} active={isActive} />
                  </div>
                  <div className="cc-fb-overlay" />
                  <div className="cc-text" style={{ background: "transparent" }}>
                    <span className="cc-label">Detroit Studio</span>
                    <h2 className="cc-title" style={{ color: slide.titleColor }}>{slide.title}</h2>
                    <p className="cc-subtitle" style={{ color: slide.subtitleColor }}>{slide.subtitle}</p>
                  </div>
                </div>
              );
            }

            /* ── SPLIT LEFT ── */
            if (isLeft) {
              return (
                <div
                  key={slide.key}
                  data-cursor-dark={dark ? "true" : "false"}
                  className={`cc-slide${isActive ? " cc-active" : ""}`}
                  style={{ gridTemplateColumns: slide.cols }}
                >
                  <VideoPanel video={slide.video} poster={slide.poster} active={isActive} />
                  <div className="cc-text" style={{ background: slide.textBg }}>
                    <span className="cc-label">Detroit Studio</span>
                    <h2 className="cc-title" style={{ color: slide.titleColor }}>{slide.title}</h2>
                    <p className="cc-subtitle" style={{ color: slide.subtitleColor }}>{slide.subtitle}</p>
                  </div>
                </div>
              );
            }

            /* ── SPLIT RIGHT ── */
            return (
              <div
                key={slide.key}
                data-cursor-dark={dark ? "true" : "false"}
                className={`cc-slide${isActive ? " cc-active" : ""}`}
                style={{ gridTemplateColumns: slide.cols }}
              >
                <div className="cc-text" style={{ background: slide.textBg }}>
                  <span className="cc-label">Detroit Studio</span>
                  <h2
                    className={`cc-title${"smallTitle" in slide && slide.smallTitle ? " cc-title-sm" : ""}`}
                    style={{ color: slide.titleColor }}
                  >
                    {slide.title}
                  </h2>
                  <p className="cc-subtitle" style={{ color: slide.subtitleColor }}>{slide.subtitle}</p>
                  {"thumbs" in slide && slide.thumbs && (
                    <div className="cc-thumbs">
                      {slide.thumbs.map((src, j) => (
                        <div key={j} className="cc-thumb">
                          <img src={src} alt="" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <VideoPanel video={slide.video} poster={slide.poster} active={isActive} />
              </div>
            );
          })}

          {/* Explore cursor — position:absolute inside .cc-sticky, pointer-events:none */}
          <div ref={cursorRef} className="cc-cursor-explore" aria-hidden>
            <svg className="cc-cursor-ring" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="54" className="cc-cursor-circle" />
              <circle cx="60" cy="60" r="54" className="cc-cursor-dash" />
            </svg>
            <div className="cc-cursor-label">
              <span className="cc-cursor-word">Explore</span>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="cc-cursor-arrow">
                <path d="M1.5 5.5H9.5M5.5 2L9.5 5.5L5.5 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Bug layer — fully pointer-events:none so it never intercepts mouse */}
          {/* <div className="cc-bug-layer">
            <BugSectionEffect bugCount={2} leafCount={0}>
              <></>
            </BugSectionEffect>
          </div> */}

          {/* Nav dots */}
          <div className="cc-dots">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <div
                key={i}
                className={`cc-dot${i === current ? " cc-on" : ""}`}
                onClick={() => scrollToSlide(i)}
              />
            ))}
          </div>

          {/* Scroll hint */}
          <div className="cc-hint" style={{ opacity: current === 0 ? 1 : 0 }}>
            <span>Scroll</span>
            <div className="cc-hint-line" />
          </div>

          {/* Counter */}
          <div className="cc-ctr">
            <b>{String(current + 1).padStart(2, "0")}</b> / 05
          </div>

        </div>
      </div>
    </>
  );
}