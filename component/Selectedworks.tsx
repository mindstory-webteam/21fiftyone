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
    id: 1, index: "01", num: "01 / 05", category: "BRAND IDENTITY",
    title: "THE OBSIDIAN\nCOLLECTIVE",
    desc: "A tonal visual overhaul for a boutique fashion house, focusing on tonal layering and high-contrast typography.",
    cta: "VIEW CASE STUDY",
    video: "/videos/video-1.mp4",
    poster: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=900&q=80",
  },
  {
    id: 2, index: "02", num: "02 / 05", category: "DIGITAL CRAFT",
    title: "NOIR DIGITAL\nEXPERIENCE",
    desc: "An immersive web platform built for maximum conversion with cinematic precision and dark elegance.",
    cta: "VIEW CASE STUDY",
    video: "/videos/video-2.mp4",
    poster: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=900&q=80",
  },
  {
    id: 3, index: "03", num: "03 / 05", category: "CONTENT ALCHEMY",
    title: "PHANTOM\nFRAMES",
    desc: "A cinematic campaign for a global creative agency — three films, one narrative thread, zero compromises.",
    cta: "VIEW CASE STUDY",
    video: "/videos/video-3.mp4",
    poster: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=900&q=80",
  },
  {
    id: 4, index: "04", num: "04 / 05", category: "SOCIAL ECHO",
    title: "ECHO\nCHAMBER",
    desc: "A social strategy that turned a niche streetwear brand into a cultural moment felt across four continents.",
    cta: "VIEW CASE STUDY",
    video: "/videos/video-1.mp4",
    poster: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=900&q=80",
  },
  {
    id: 5, index: "05", num: "05 / 05", category: "MOTION & FILM",
    title: "VELVET\nSHADOWS",
    desc: "A short-form visual anthology exploring texture, light and the language of silence in motion design.",
    cta: "VIEW CASE STUDY",
    video: "/videos/video-2.mp4",
    poster: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=900&q=80",
  },
];

export default function SelectedWorks() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const calc = () => {
      // Use offsetTop (distance from document top) — reliable regardless of parent
      const offsetTop = el.getBoundingClientRect().top + window.scrollY;
      const scrolled  = window.scrollY - offsetTop;
      const range     = el.offsetHeight - window.innerHeight;
      if (range <= 0) return;

      const progress = Math.max(0, Math.min(scrolled / range, 1));
      const idx      = Math.min(
        Math.floor(progress * WORKS.length),
        WORKS.length - 1
      );
      setActive(idx);
    };

    window.addEventListener("scroll", calc, { passive: true });
    window.addEventListener("resize", calc);
    // Small delay so layout is settled before first calculation
    const t = setTimeout(calc, 100);
    return () => {
      window.removeEventListener("scroll", calc);
      window.removeEventListener("resize", calc);
      clearTimeout(t);
    };
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
          --border: rgba(0,0,0,0.09);
        }

      

        .sw-outer {
          /* One viewport-height slot per card */
          height: calc(${WORKS.length} * 100vh);
          position: relative;
          /* NO overflow:hidden here — would break sticky */
        }

        .sw-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          /* overflow:hidden is safe ON the sticky child, not ancestors */
          overflow: hidden;
          background: var(--bg);
          display: grid;
          grid-template-columns: 360px 1fr;
          grid-template-rows: 1fr auto;
        }

        /* ─── LEFT PANEL ─── */
        .sw-left {
          grid-column: 1;
          grid-row: 1 / 3;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 56px 40px 36px 72px;
          border-right: 1px solid var(--border);
          position: relative;
          z-index: 2;
        }

        .sw-sup {
          display: block;
          font-family: 'Barlow', sans-serif;
          font-size: 9px; font-weight: 600;
          letter-spacing: 0.34em; color: #aaa;
          text-transform: uppercase; margin-bottom: 20px;
        }
        .sw-h-solid {
          display: block;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(52px, 5.2vw, 80px);
          text-transform: uppercase; color: var(--black);
          line-height: 0.88; letter-spacing: -0.03em;
        }
        .sw-h-masked-row {
          display: block; line-height: 0.88;
          margin-top: 2px; margin-bottom: 28px;
        }
        /* Fixed px height — critical for canvas measureText */
        .sw-masked-canvas {
          display: inline-block; vertical-align: bottom;
          height: 73px; width: auto;
        }
        .sw-sub {
          font-family: 'Barlow', sans-serif;
          font-size: 13.5px; font-weight: 400;
          line-height: 1.78; color: #666; max-width: 260px;
        }
        .sw-left-bottom {}
        .sw-dots {
          display: flex; align-items: center; gap: 6px; margin-bottom: 12px;
        }
        .sw-dot {
          height: 2px; width: 20px;
          background: rgba(0,0,0,0.12); border-radius: 2px;
          transition: width 0.35s ease, background 0.35s ease;
        }
        .sw-dot.on { width: 44px; background: var(--red); }
        .sw-left-count {
          font-family: 'Barlow', sans-serif;
          font-size: 8.5px; font-weight: 600;
          letter-spacing: 0.22em; color: var(--muted); text-transform: uppercase;
        }
        .sw-vert {
          position: absolute; bottom: 120px; left: -24px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 8px; font-weight: 700;
          letter-spacing: 0.32em; color: rgba(0,0,0,0.15);
          text-transform: uppercase;
          writing-mode: vertical-rl; transform: rotate(180deg);
          pointer-events: none;
        }

        /* ─── RIGHT PANEL ─── */
        .sw-right {
          grid-column: 2; grid-row: 1;
          display: flex; align-items: center;
          padding: 48px 72px 48px 56px;
          gap: 52px; overflow: hidden; position: relative;
        }

        .sw-cards-wrap {
          position: relative; flex-shrink: 0;
          width: 36vw; max-width: 480px;
          height: calc(100vh - 140px);
          display: flex; align-items: center;
        }

        /* ─── Text beside cards ─── */
        .sw-text-wrap {
          flex: 1; position: relative;
          min-height: 300px; display: flex; align-items: center;
        }
        .sw-text-inner {
          position: absolute; left: 0; right: 0;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s;
          pointer-events: none;
        }
        .sw-text-inner.active {
          opacity: 1; transform: translateY(0);
          pointer-events: auto; position: relative;
        }
        .sw-text-meta {
          display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
        }
        .sw-text-idx {
          font-family: 'Barlow', sans-serif;
          font-size: 9px; font-weight: 600;
          letter-spacing: 0.2em; color: var(--red); text-transform: uppercase;
        }
        .sw-text-rule { flex: 1; max-width: 52px; height: 1px; background: var(--border); }
        .sw-text-cat {
          font-family: 'Barlow', sans-serif;
          font-size: 9px; font-weight: 600;
          letter-spacing: 0.26em; color: var(--muted); text-transform: uppercase;
        }
        .sw-text-title {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
          font-size: clamp(32px, 3.2vw, 52px);
          text-transform: uppercase; color: var(--black);
          letter-spacing: -0.025em; line-height: 0.93;
          white-space: pre-line; margin-bottom: 20px;
        }
        .sw-text-desc {
          font-family: 'Barlow', sans-serif;
          font-size: 13.5px; font-weight: 400;
          line-height: 1.8; color: #555; max-width: 340px; margin-bottom: 28px;
        }
        .sw-cta {
          display: inline-flex; align-items: center; gap: 14px;
          font-family: 'Barlow', sans-serif;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--black); background: none; border: none;
          cursor: pointer; padding: 0; transition: gap 0.25s;
        }
        .sw-cta:hover { gap: 22px; }
        .sw-cta-line {
          width: 32px; height: 1px; flex-shrink: 0;
          background: var(--red); position: relative; transition: width 0.28s ease;
        }
        .sw-cta-line::after {
          content: ''; position: absolute; right: 0; top: -2.5px;
          border-left: 5px solid var(--red);
          border-top: 3px solid transparent; border-bottom: 3px solid transparent;
        }
        .sw-cta:hover .sw-cta-line { width: 48px; }

        /* ─── BOTTOM BAR ─── */
        .sw-bottom {
          grid-column: 2; grid-row: 2;
          display: flex; align-items: center;
          padding: 14px 72px 24px 56px;
          border-top: 1px solid var(--border); gap: 16px;
        }
        .sw-bottom-count {
          font-family: 'Barlow', sans-serif;
          font-size: 8.5px; font-weight: 600;
          letter-spacing: 0.22em; color: var(--muted); text-transform: uppercase;
          margin-right: 16px;
        }
        .sw-scroll-label {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Barlow', sans-serif;
          font-size: 8.5px; font-weight: 600;
          letter-spacing: 0.22em; color: #bbb; text-transform: uppercase;
        }
        .sw-scroll-label::before {
          content: ''; display: block; width: 28px; height: 1px; background: #ccc;
        }

        /* ─── Card media shared styles ─── */
        .sw-card-media {
          width: 100%; aspect-ratio: 3 / 4; position: relative; overflow: hidden;
        }
        .sw-card-media video {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .sw-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%);
        }
        .sw-card-num {
          position: absolute; top: 18px; left: 18px;
          font-family: 'Barlow', sans-serif;
          font-size: 9px; font-weight: 600; letter-spacing: 0.18em;
          color: rgba(255,255,255,0.92);
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 5px 13px; border-radius: 100px; text-transform: uppercase;
        }
        .sw-card-cat {
          position: absolute; bottom: 20px; left: 20px;
          font-family: 'Barlow', sans-serif;
          font-size: 8.5px; font-weight: 600; letter-spacing: 0.26em;
          color: rgba(255,255,255,0.7); text-transform: uppercase;
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1024px) {
          .sw-sticky {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr auto;
          }
          .sw-left {
            grid-column: 1; grid-row: 1;
            padding: 36px 28px 20px;
            border-right: none; border-bottom: 1px solid var(--border);
          }
          .sw-left-bottom { display: none; }
          .sw-vert { display: none; }
          .sw-right { grid-column: 1; grid-row: 2; padding: 20px 28px; gap: 28px; }
          .sw-cards-wrap { width: 50vw; }
          .sw-bottom { grid-column: 1; grid-row: 3; padding: 12px 28px 20px; }
        }
        @media (max-width: 640px) {
          .sw-right { flex-direction: column; }
          .sw-cards-wrap { width: 88vw; max-width: none; height: auto; }
          .sw-card-media { aspect-ratio: 4/3 !important; }
        }
      `}</style>

      <div className="sw-outer" ref={outerRef} id="selected-works">
        <div className="sw-sticky">

          {/* LEFT */}
          <aside className="sw-left">
            <div>
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
                  <div key={i} className={`sw-dot${i <= active ? " on" : ""}`} />
                ))}
              </div>
              <span className="sw-left-count">
                {String(active + 1).padStart(2, "0")} / {String(WORKS.length).padStart(2, "0")}
              </span>
            </div>
            <span className="sw-vert">Portfolio 2025</span>
          </aside>

          {/* RIGHT */}
          <div className="sw-right">
            <div className="sw-cards-wrap">
              {WORKS.map((work, i) => (
                <VideoCard key={work.id} work={work} index={i} active={active} total={WORKS.length} />
              ))}
            </div>

            <div className="sw-text-wrap">
              {WORKS.map((work, i) => (
                <div
                  key={work.id}
                  className={`sw-text-inner${i === active ? " active" : ""}`}
                  aria-hidden={i !== active}
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
              ))}
            </div>
          </div>

          {/* BOTTOM BAR */}
          {/* <div className="sw-bottom">
            <div className="sw-dots" style={{ flex: 1 }}>
              {WORKS.map((_, i) => (
                <div key={i} className={`sw-dot${i <= active ? " on" : ""}`} />
              ))}
            </div>
            <span className="sw-bottom-count">
              {String(active + 1).padStart(2, "0")} / {String(WORKS.length).padStart(2, "0")}
            </span>
            <span className="sw-scroll-label">Scroll to explore</span>
          </div> */}

        </div>
      </div>
    </>
  );
}

/* ── VideoCard ── */
function VideoCard({
  work, index, active, total,
}: {
  work: Work; index: number; active: number; total: number;
}) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const isCurrent = index === active;
  const isPast    = index < active;
  const depth     = active - index; // 0=current, 1=one behind…

  let transform: string;
  let opacity: number;
  let zIndex: number;

  if (isCurrent) {
    transform = "translateX(0px) translateY(0px) scale(1)";
    opacity   = 1;
    zIndex    = total + 1;
  } else if (isPast) {
    // Stack behind-and-slightly-right of current
    transform = `translateX(${depth * 14}px) translateY(${depth * 10}px) scale(${1 - depth * 0.03})`;
    opacity   = Math.max(0.25, 1 - depth * 0.28);
    zIndex    = total - depth;
  } else {
    // Future cards: off-screen right, waiting
    transform = "translateX(100vw) scale(0.92)";
    opacity   = 0;
    zIndex    = index;
  }

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isCurrent) { v.play().catch(() => {}); }
    else           { v.pause(); v.currentTime = 0; }
  }, [isCurrent]);

  return (
    <article
      style={{
        position: "absolute", width: "100%",
        borderRadius: "4px", overflow: "hidden", background: "#111",
        transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease, box-shadow 0.5s ease",
        transform, opacity, zIndex,
        boxShadow: isCurrent ? "0 32px 80px rgba(0,0,0,0.18)" : "none",
        pointerEvents: isCurrent ? "auto" : "none",
      }}
    >
      <div className="sw-card-media">
        <video ref={videoRef} src={work.video} poster={work.poster} muted loop playsInline preload="metadata" />
        <div className="sw-card-overlay" />
        <span className="sw-card-num">{work.num}</span>
        <span className="sw-card-cat">{work.category}</span>
      </div>
    </article>
  );
}

/* ── MaskedCanvas ── */
function MaskedCanvas({ word, videoSrc, className }: { word: string; videoSrc: string; className: string }) {
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

    function getCssH(): number {
      if (!canvas) return 73;
      const h = canvas.offsetHeight;
      if (h > 0) return h;
      const c = parseFloat(getComputedStyle(canvas).height);
      return isNaN(c) || c === 0 ? 73 : c;
    }
    function initSize() {
      if (!canvas || !ctx) return;
      const cssH = getCssH();
      const fs   = cssH * 0.96;
      ctx.font   = `900 italic ${fs}px 'Barlow Condensed', sans-serif`;
      const tw   = ctx.measureText(word).width;
      canvas.width        = Math.ceil(tw * dpr);
      canvas.height       = Math.ceil(cssH * dpr);
      canvas.style.width  = `${Math.ceil(tw)}px`;
      canvas.style.height = `${cssH}px`;
    }
    function frame() {
      if (!canvas || !video || !ctx) return;
      const cW = canvas.width / dpr, cH = canvas.height / dpr;
      ctx.save(); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, cW, cH);
      ctx.globalCompositeOperation = "source-over";
      if (readyRef.current && video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, cW, cH);
      } else {
        const t = (Date.now() % 3000) / 3000;
        const g = ctx.createLinearGradient(cW * t, 0, cW * (t + 0.65), cH);
        g.addColorStop(0, "#a81008"); g.addColorStop(0.4, "#e0361a");
        g.addColorStop(0.7, "#d42b2b"); g.addColorStop(1, "#6e0000");
        ctx.fillStyle = g; ctx.fillRect(0, 0, cW, cH);
      }
      ctx.globalCompositeOperation = "destination-in";
      ctx.font = `900 italic ${cH * 0.96}px 'Barlow Condensed', sans-serif`;
      ctx.textBaseline = "top"; ctx.fillStyle = "#000";
      ctx.fillText(word, 0, cH * 0.03);
      ctx.restore();
      rafRef.current = requestAnimationFrame(frame);
    }
    const boot = () => requestAnimationFrame(() => { initSize(); frame(); });
    if (document.fonts?.ready) document.fonts.ready.then(boot); else setTimeout(boot, 200);

    video.crossOrigin = "anonymous"; video.muted = true;
    video.loop = true; video.playsInline = true; video.src = videoSrc;
    const onCanPlay = () => { readyRef.current = true; video.play().catch(() => {}); };
    video.addEventListener("canplay", onCanPlay);
    const ro = new ResizeObserver(() => requestAnimationFrame(() => initSize()));
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