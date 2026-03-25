"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CARDS = [
  {
    id: 1,
    tag: "01",
    title: "BRAND IDENTITY",
    body: "Visual storytelling that resonates through tonal hierarchy and editorial precision. We create icons that stand the test of time.",
    cta: "EXPLORE IDENTITY",
    layout: "large",
    accent: true,
    image: "/image/about-1.jpg",
  },
  {
    id: 2,
    tag: "02",
    title: "DIGITAL CRAFT",
    body: "High-performance web ecosystems designed for the modern era — built to convert and built to last.",
    cta: "EXPLORE CRAFT",
    layout: "small",
    accent: false,
    image: "/image/about-2.jpg",
  },
  {
    id: 3,
    tag: "03",
    title: "SOCIAL ECHO",
    body: "Strategic movement that amplifies your brand's pulse across digital channels.",
    cta: "EXPLORE ECHO",
    layout: "small",
    accent: false,
    image: "/image/about-1.jpg",
  },
  {
    id: 4,
    tag: "04",
    title: "CONTENT ALCHEMY",
    body: "Cinematic production that captures the essence of your vision, polished with the 21FiftyOne quality stamp.",
    cta: "EXPLORE ALCHEMY",
    layout: "side",
    accent: false,
    image: "/image/about-2.jpg",
  },
];

const GROUPS = [
  [0, 1],
  [2, 3],
];

export default function ServicesSection() {
  const [groupIdx, setGroupIdx] = useState(0);
  const [prevGroupIdx, setPrevGroupIdx] = useState<number | null>(null);
  const [dir, setDir] = useState<"left" | "right">("left");
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (idx: number, direction: "left" | "right") => {
      if (animating || idx === groupIdx) return;
      setAnimating(true);
      setDir(direction);
      setPrevGroupIdx(groupIdx);
      setGroupIdx(idx);
      setTimeout(() => { setPrevGroupIdx(null); setAnimating(false); }, 650);
    },
    [animating, groupIdx]
  );

  const next = useCallback(() => goTo((groupIdx + 1) % GROUPS.length, "left"), [goTo, groupIdx]);
  const prev = useCallback(() => goTo((groupIdx - 1 + GROUPS.length) % GROUPS.length, "right"), [goTo, groupIdx]);

  useEffect(() => {
    timerRef.current = setTimeout(next, 5500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [groupIdx, next]);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(next, 5500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,900;1,900&family=Barlow:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .svc { width:100%; background:#f8f7f5; padding:96px 0 80px; overflow:hidden; }
        .svc-inner { max-width:1180px; margin:0 auto; padding:0 64px; }

        /* ── Header ── */
        .svc-header {
          display:flex; align-items:flex-end; justify-content:space-between;
          margin-bottom:52px; gap:32px;
        }
        .svc-header-left { flex:1; min-width:0; }
        .svc-sup {
          font-family:'Barlow',sans-serif; font-size:10px; font-weight:600;
          letter-spacing:0.24em; color:#aaa; text-transform:uppercase; margin-bottom:14px;
        }
        .svc-heading { line-height:0.92; margin-bottom:16px; }
        .svc-h-line {
          display:block; font-family:'Barlow Condensed',sans-serif; font-weight:900;
          font-size:clamp(36px,5vw,72px); text-transform:uppercase; color:#0d0d0d;
          line-height:0.92; letter-spacing:-0.02em;
        }
        .svc-h-masked-row { display:block; line-height:0.92; }
        .svc-masked-canvas {
          display:inline-block; vertical-align:bottom;
          height:clamp(33px,4.6vw,66px); width:auto;
        }
        .svc-sub {
          font-family:'Barlow',sans-serif; font-size:14px; font-weight:400;
          line-height:1.72; color:#666; max-width:340px; margin-top:20px;
        }
        .svc-counter {
          font-family:'Barlow',sans-serif; font-size:10px; font-weight:500;
          letter-spacing:0.18em; color:#bbb; white-space:nowrap; flex-shrink:0;
        }
        .svc-counter span { color:#0d0d0d; }

        /* ── Stage ── */
        .svc-stage { position:relative; overflow:hidden; min-height:520px; }

        .card-group {
          display:grid; grid-template-columns:1fr 1fr;
          grid-template-rows:auto auto; gap:16px; width:100%;
        }
        .card-group.cg-enter-left  { animation:cgInL  0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .card-group.cg-enter-right { animation:cgInR  0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .card-group.cg-leave-left  { position:absolute;inset:0;pointer-events:none;animation:cgOutL 0.38s ease both; }
        .card-group.cg-leave-right { position:absolute;inset:0;pointer-events:none;animation:cgOutR 0.38s ease both; }
        @keyframes cgInL  { from{opacity:0;transform:translateX(56px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes cgInR  { from{opacity:0;transform:translateX(-56px)} to{opacity:1;transform:translateX(0)} }
        @keyframes cgOutL { from{opacity:1;transform:translateX(0)}  to{opacity:0;transform:translateX(-56px)} }
        @keyframes cgOutR { from{opacity:1;transform:translateX(0)}  to{opacity:0;transform:translateX(56px)} }

        .card-group > * { animation:cardPop 0.55s cubic-bezier(0.16,1,0.3,1) both; }
        .card-group > *:nth-child(1){ animation-delay:0.04s; }
        .card-group > *:nth-child(2){ animation-delay:0.13s; }
        .card-group > *:nth-child(3){ animation-delay:0.22s; }
        .card-group > *:nth-child(4){ animation-delay:0.30s; }
        @keyframes cardPop { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }

        /* ────────────────────────────────────────────
           CARD BASE
           - White background by default
           - Background image hidden (opacity 0, scale 1.08)
           - On hover: image fades in, scales to 1, overlay appears,
             all text flips to white
        ──────────────────────────────────────────── */
        .svc-card {
          position:relative; overflow:hidden; border-radius:6px;
          border:1px solid rgba(0,0,0,0.06);
          background:#ffffff;
          display:flex; flex-direction:column;
          cursor:pointer;
          transition:border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .svc-card:hover {
          border-color:transparent;
          box-shadow:0 16px 48px rgba(0,0,0,0.22);
        }

        /* Background image layer */
        .card-bg-img {
          position:absolute; inset:0; z-index:0;
          background-size:cover;
          background-position:center;
          opacity:0;
          transform:scale(1.08);
          transition:opacity 0.6s cubic-bezier(0.25,0.46,0.45,0.94),
                      transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .svc-card:hover .card-bg-img {
          opacity:1;
          transform:scale(1);
        }

        /* Dark overlay — hidden until hover */
        .card-overlay {
          position:absolute; inset:0; z-index:1;
          background:linear-gradient(
            to top,
            rgba(0,0,0,0.88) 0%,
            rgba(0,0,0,0.55) 50%,
            rgba(0,0,0,0.25) 100%
          );
          opacity:0;
          transition:opacity 0.5s ease;
          pointer-events:none;
        }
        .svc-card:hover .card-overlay { opacity:1; }

        /* Content sits above bg + overlay */
        .card-content {
          position:relative; z-index:2;
          display:flex; flex-direction:column;
          flex:1;
          padding:28px 28px 32px;
          transition:color 0.4s ease;
        }

        /* Large card — 2 rows tall */
        .svc-card.card-large {
          grid-row:1 / 3;
          min-height:500px;
        }
        .svc-card.card-large .card-content { justify-content:flex-end; }

        /* Small card */
        .svc-card.card-small { min-height:240px; }
        .svc-card.card-small .card-content { justify-content:space-between; }

        /* Side card — text centered vertically */
        .svc-card.card-side { min-height:200px; }
        .svc-card.card-side .card-content { justify-content:center; }

        /* ── Text — default dark, white on hover ── */
        .card-tag {
          font-family:'Barlow',sans-serif; font-size:9px; font-weight:600;
          letter-spacing:0.22em; text-transform:uppercase;
          color:#c0c0c0;
          margin-bottom:8px;
          transition:color 0.4s ease;
        }
        .svc-card:hover .card-tag { color:rgba(255,255,255,0.55); }

        .card-title {
          font-family:'Barlow Condensed',sans-serif; font-weight:900;
          font-size:clamp(20px,2.4vw,30px); text-transform:uppercase;
          color:#0d0d0d; letter-spacing:-0.01em; line-height:1;
          margin-bottom:10px;
          transition:color 0.4s ease;
        }
        .svc-card:hover .card-title { color:#ffffff; }

        .card-desc {
          font-family:'Barlow',sans-serif; font-size:13px; font-weight:400;
          line-height:1.7; color:#777;
          margin-bottom:22px; flex:1;
          transition:color 0.4s ease;
        }
        .svc-card:hover .card-desc { color:rgba(255,255,255,0.72); }

        /* CTA link */
        .card-cta {
          display:inline-flex; align-items:center; gap:10px;
          font-family:'Barlow',sans-serif; font-size:10px; font-weight:600;
          letter-spacing:0.18em; text-transform:uppercase;
          color:#0d0d0d;
          cursor:pointer; background:none; border:none; padding:0;
          align-self:flex-start;
          transition:color 0.4s ease;
        }
        .svc-card:hover .card-cta { color:#ffffff; }

        .card-cta-line {
          width:28px; height:1px; flex-shrink:0;
          background:#0d0d0d; position:relative;
          transition:background 0.4s ease, width 0.3s ease;
        }
        .card-cta-line::after {
          content:''; position:absolute; right:0; top:-2px;
          border-left:4px solid #0d0d0d;
          border-top:2.5px solid transparent;
          border-bottom:2.5px solid transparent;
          transition:border-left-color 0.4s ease;
        }
        .svc-card:hover .card-cta-line { background:#ffffff; width:36px; }
        .svc-card:hover .card-cta-line::after { border-left-color:#ffffff; }

        /* Red CTA line (Brand Identity card default) */
        .card-cta.red .card-cta-line { background:#d42b2b; }
        .card-cta.red .card-cta-line::after { border-left-color:#d42b2b; }
        .svc-card:hover .card-cta.red .card-cta-line { background:#ffffff; }
        .svc-card:hover .card-cta.red .card-cta-line::after { border-left-color:#ffffff; }

        /* Icon badge top-right */
        .card-icon-badge {
          position:absolute; top:20px; right:20px; z-index:3;
          width:34px; height:34px;
          border-radius:50%;
          background:rgba(255,255,255,0.9);
          display:flex; align-items:center; justify-content:center;
          transition:background 0.4s ease, opacity 0.4s ease;
          backdrop-filter:blur(4px);
        }
        .svc-card:hover .card-icon-badge {
          background:rgba(255,255,255,0.15);
          border:1px solid rgba(255,255,255,0.3);
        }
        .svc-card:hover .card-icon-badge svg { stroke:rgba(255,255,255,0.9) !important; }
        .svc-card:hover .card-icon-badge path { stroke:rgba(255,255,255,0.9) !important; }

        /* Ghost number */
        .card-ghost-num {
          position:absolute; bottom:-10px; right:16px; z-index:2;
          font-family:'Barlow Condensed',sans-serif; font-weight:900;
          font-size:110px; line-height:1; letter-spacing:-0.06em;
          pointer-events:none; user-select:none;
          color:rgba(0,0,0,0.04);
          transition:color 0.4s ease;
        }
        .svc-card:hover .card-ghost-num { color:rgba(255,255,255,0.08); }

        /* Red accent line on bottom of large card (default state) */
        .card-accent-line {
          width:36px; height:2px; background:#d42b2b;
          margin-bottom:20px;
          transition:opacity 0.4s ease;
        }
        .svc-card:hover .card-accent-line { opacity:0.6; }

        /* ── Nav ── */
        .svc-nav { display:flex; align-items:center; gap:16px; margin-top:32px; }
        .svc-nav-btn {
          width:40px; height:40px; border-radius:50%;
          border:1px solid rgba(0,0,0,0.14); background:transparent;
          cursor:pointer; display:flex; align-items:center; justify-content:center;
          flex-shrink:0; transition:background 0.18s,border-color 0.18s;
        }
        .svc-nav-btn:hover { background:#0d0d0d; border-color:#0d0d0d; }
        .svc-nav-btn:hover .sarr { stroke:#fff; }
        .sarr { stroke:#0d0d0d; transition:stroke 0.18s; }
        .svc-dots { display:flex; align-items:center; gap:6px; }
        .svc-dot {
          height:2px; width:18px; background:#ddd; border:none; border-radius:2px;
          cursor:pointer; padding:0; transition:width 0.32s ease,background 0.32s ease;
        }
        .svc-dot.active { width:36px; background:#d42b2b; }
        .svc-prog {
          flex:1; max-width:80px; height:1px; background:#e0e0e0;
          border-radius:1px; overflow:hidden; position:relative;
        }
        .svc-prog-fill {
          position:absolute; inset:0 auto 0 0; width:0%;
          background:#0d0d0d; animation:svcFill 5.5s linear forwards;
        }
        @keyframes svcFill { from{width:0%} to{width:100%} }
        .svc-pg {
          font-family:'Barlow',sans-serif; font-size:10px; font-weight:500;
          letter-spacing:0.14em; color:#bbb; white-space:nowrap;
        }

        @media(max-width:900px){
          .svc-inner { padding:0 28px; }
          .card-group { grid-template-columns:1fr; }
          .svc-card.card-large { grid-row:auto; min-height:320px; }
          .svc-header { flex-direction:column; align-items:flex-start; }
        }
      `}</style>

      <section className="svc">
        <div className="svc-inner">

          {/* Header */}
          <div className="svc-header">
            <div className="svc-header-left">
              <p className="svc-sup">What We Do</p>
              <div className="svc-heading">
                <span className="svc-h-line">CRAFTING THE</span>
                <span className="svc-h-masked-row">
                  <SvcMaskedCanvas
                    word="EXCEPTIONAL"
                    videoSrc="/videos/mask.mp4"
                    className="svc-masked-canvas"
                  />
                </span>
              </div>
              <p className="svc-sub">
                Our multidisciplinary approach blends technical precision with
                creative alchemy to deliver results that pulse with life.
              </p>
            </div>
            <div className="svc-counter">
              SERVICES&nbsp;/&nbsp;<span>01</span>&nbsp;—&nbsp;<span>04</span>
            </div>
          </div>

          {/* Stage */}
          <div className="svc-stage">
            {prevGroupIdx !== null && (
              <div
                className={`card-group ${dir === "left" ? "cg-leave-left" : "cg-leave-right"}`}
                key={`out-${prevGroupIdx}`}
              >
                <CardGroup indices={GROUPS[prevGroupIdx]} />
              </div>
            )}
            <div
              className={`card-group ${dir === "left" ? "cg-enter-left" : "cg-enter-right"}`}
              key={`in-${groupIdx}`}
            >
              <CardGroup indices={GROUPS[groupIdx]} />
            </div>
          </div>

          {/* Nav */}
          <div className="svc-nav">
            <button className="svc-nav-btn" aria-label="Previous" onClick={() => { resetTimer(); prev(); }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M8.5 1.5L3.5 6.5L8.5 11.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sarr"/>
              </svg>
            </button>
            <div className="svc-dots">
              {GROUPS.map((_, i) => (
                <button key={i}
                  className={`svc-dot${i === groupIdx ? " active" : ""}`}
                  onClick={() => { resetTimer(); goTo(i, i > groupIdx ? "left" : "right"); }}
                />
              ))}
            </div>
            <div className="svc-prog">
              <div className="svc-prog-fill" key={`pf-${groupIdx}`} />
            </div>
            <span className="svc-pg">
              {String(groupIdx + 1).padStart(2, "0")}&thinsp;/&thinsp;{String(GROUPS.length).padStart(2, "0")}
            </span>
            <button className="svc-nav-btn" aria-label="Next" onClick={() => { resetTimer(); next(); }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M4.5 1.5L9.5 6.5L4.5 11.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sarr"/>
              </svg>
            </button>
          </div>

        </div>
      </section>
    </>
  );
}

/* ── Card group ──────────────────────────────────── */
function CardGroup({ indices }: { indices: number[] }) {
  return (
    <>
      {indices.map((ci) => {
        const card = CARDS[ci];
        const isLarge = card.layout === "large";
        const isSide  = card.layout === "side";

        return (
          <div
            key={card.id}
            className={`svc-card card-${card.layout}`}
          >
            {/* BG image — hidden until hover */}
            <div
              className="card-bg-img"
              style={{ backgroundImage: `url(${card.image})` }}
              aria-hidden="true"
            />

            {/* Dark overlay */}
            <div className="card-overlay" aria-hidden="true" />

            {/* Icon badges */}
            {card.tag === "02" && (
              <div className="card-icon-badge">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                  stroke="#d42b2b" strokeWidth="1.5">
                  <path d="M5 4L2 8L5 12M11 4L14 8L11 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
            {card.tag === "03" && (
              <div className="card-icon-badge">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1V15M1 8H15M3 3L13 13M13 3L3 13"
                    stroke="#d42b2b" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            )}

            {/* Content */}
            <div className="card-content">
              {isLarge && <div className="card-accent-line" />}

              <div>
                <p className="card-tag">{card.tag}</p>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-desc">{card.body}</p>
              </div>

              <button className={`card-cta${card.accent ? " red" : ""}`}>
                <span className="card-cta-line" />
                {card.cta}
              </button>
            </div>

            <div className="card-ghost-num">{card.tag}</div>
          </div>
        );
      })}
    </>
  );
}

/* ── Canvas video mask ───────────────────────────── */
function SvcMaskedCanvas({ word, videoSrc, className }: { word: string; videoSrc: string; className: string }) {
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
      const cssH = canvas.offsetHeight || 66;
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
    video.muted       = true;
    video.loop        = true;
    video.playsInline = true;
    video.src         = videoSrc;

    const onCanPlay = () => { readyRef.current = true; video.play().catch(() => {}); };
    video.addEventListener("canplay", onCanPlay);

    const ro = new ResizeObserver(() => document.fonts.ready.then(() => initSize()));
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      video.removeEventListener("canplay", onCanPlay);
      ro.disconnect();
      readyRef.current = false;
      video.src = "";
    };
  }, [word, videoSrc]);

  return (
    <>
      <video ref={videoRef} style={{ display: "none" }} muted loop playsInline />
      <canvas ref={canvasRef} className={className} aria-label={word} />
    </>
  );
}