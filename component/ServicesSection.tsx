"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import BugSectionEffect from "./Bugsectioneffect"; // adjust path as needed

/* ── 8 cards, 4 groups of 2 ─────────────────────── */
const CARDS = [
  {
    id: 1, tag: "01", title: "BRAND IDENTITY",
    body: "Visual storytelling that resonates through tonal hierarchy and editorial precision. We create icons that stand the test of time.",
    cta: "EXPLORE IDENTITY", layout: "large", accent: true,
    image: "/image/about-1.jpg", icon: null,
  },
  {
    id: 2, tag: "02", title: "DIGITAL CRAFT",
    body: "High-performance web ecosystems designed for the modern era — built to convert and built to last.",
    cta: "EXPLORE CRAFT", layout: "small", accent: false,
    image: "/image/about-2.jpg", icon: "code",
  },
  {
    id: 3, tag: "03", title: "SOCIAL ECHO",
    body: "Strategic movement that amplifies your brand's pulse across digital channels and beyond.",
    cta: "EXPLORE ECHO", layout: "large", accent: false,
    image: "/image/about-1.jpg", icon: "asterisk",
  },
  {
    id: 4, tag: "04", title: "CONTENT ALCHEMY",
    body: "Cinematic production that captures the essence of your vision, polished with the 21FiftyOne quality stamp.",
    cta: "EXPLORE ALCHEMY", layout: "small", accent: false,
    image: "/image/about-2.jpg", icon: null,
  },
  {
    id: 5, tag: "05", title: "MOTION & FILM",
    body: "From concept to colour grade — we craft moving images that don't just tell stories, they ignite them.",
    cta: "EXPLORE MOTION", layout: "small", accent: false,
    image: "/image/about-1.jpg", icon: "film",
  },
  {
    id: 6, tag: "06", title: "EXPERIENCE DESIGN",
    body: "Immersive digital environments where intuition meets spectacle. Every interaction is a revelation.",
    cta: "EXPLORE UX", layout: "large", accent: true,
    image: "/image/about-2.jpg", icon: null,
  },
  {
    id: 7, tag: "07", title: "STRATEGY & VISION",
    body: "Market intelligence fused with creative ambition — a roadmap that turns obscurity into cultural authority.",
    cta: "EXPLORE STRATEGY", layout: "small", accent: false,
    image: "/image/about-1.jpg", icon: "eye",
  },
  {
    id: 8, tag: "08", title: "NOIR PRODUCTION",
    body: "Dark, dramatic, unforgettable. We build production worlds drenched in atmosphere and precision craft.",
    cta: "EXPLORE NOIR", layout: "small", accent: false,
    image: "/image/about-2.jpg", icon: "diamond",
  },
];

const GROUPS = [[0, 1], [2, 3], [4, 5], [6, 7]];

export default function ServicesSection() {
  const [groupIdx,     setGroupIdx]     = useState(0);
  const [prevGroupIdx, setPrevGroupIdx] = useState<number | null>(null);
  const [dir,          setDir]          = useState<"left" | "right">("left");
  const [animating,    setAnimating]    = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((idx: number, direction: "left" | "right") => {
    if (animating || idx === groupIdx) return;
    setAnimating(true);
    setDir(direction);
    setPrevGroupIdx(groupIdx);
    setGroupIdx(idx);
    // FIX: match timeout to longest animation (leave = 0.4s, enter = 0.65s)
    setTimeout(() => { setPrevGroupIdx(null); setAnimating(false); }, 700);
  }, [animating, groupIdx]);

  const next = useCallback(() => goTo((groupIdx + 1) % GROUPS.length, "left"),  [goTo, groupIdx]);
  const prev = useCallback(() => goTo((groupIdx - 1 + GROUPS.length) % GROUPS.length, "right"), [goTo, groupIdx]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(next, 6000);
  }, [next]);

  useEffect(() => {
    timerRef.current = setTimeout(next, 6000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [groupIdx, next]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,900;1,900&family=Barlow:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .svc { width:100%; background:#f8f7f5; padding:100px 0 88px; overflow:hidden; }
        .svc-inner { max-width:1280px; margin:0 auto; padding:0 64px; }

        /* ── Header ── */
        .svc-header {
          display:flex; align-items:flex-end; justify-content:space-between;
          margin-bottom:60px; gap:40px;
        }
        .svc-header-left { flex:1; min-width:0; }
        .svc-sup {
          font-family:'Barlow',sans-serif; font-size:10px; font-weight:600;
          letter-spacing:0.26em; color:#aaa; text-transform:uppercase; margin-bottom:16px;
          display:block;
        }
        .svc-heading { line-height:0.9; margin-bottom:18px; }
        .svc-h-line {
          display:block; font-family:'Barlow Condensed',sans-serif; font-weight:900;
          font-size:clamp(42px,5.5vw,80px); text-transform:uppercase; color:#0d0d0d;
          line-height:0.9; letter-spacing:-0.025em;
        }
        .svc-h-masked-row { display:block; line-height:0.9; overflow:hidden; }
        /* FIX: explicit px height so canvas.offsetHeight is reliable */
        .svc-masked-canvas {
          display:inline-block; vertical-align:bottom;
          height:80px; width:auto;
        }
        .svc-sub {
          font-family:'Barlow',sans-serif; font-size:15px; font-weight:400;
          line-height:1.75; color:#666; max-width:380px; margin-top:22px;
        }
        .svc-counter {
          font-family:'Barlow',sans-serif; font-size:10px; font-weight:500;
          letter-spacing:0.18em; color:#bbb; white-space:nowrap; flex-shrink:0;
        }
        .svc-counter span { color:#0d0d0d; }

        /* ── Stage ── */
        /* FIX: use min-height so collapsing during leave animation is prevented */
        .svc-stage {
          position:relative;
          overflow:hidden;
          /* height is set by JS once cards render — fallback keeps layout stable */
          min-height:620px;
        }

        /* ── Card groups ── */
        .card-group {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:20px;
          width:100%;
        }
        /* FIX: leaving group is absolute so it doesn't push the entering group down */
        .card-group.cg-leave-left,
        .card-group.cg-leave-right {
          position:absolute; inset:0;
          pointer-events:none;
          /* Match grid gap so overlay lines up */
          grid-template-columns:1fr 1fr;
          gap:20px;
        }

        .card-group.cg-enter-left  { animation:cgInL  0.65s cubic-bezier(0.16,1,0.3,1) both; }
        .card-group.cg-enter-right { animation:cgInR  0.65s cubic-bezier(0.16,1,0.3,1) both; }
        .card-group.cg-leave-left  { animation:cgOutL 0.42s ease both; }
        .card-group.cg-leave-right { animation:cgOutR 0.42s ease both; }
        @keyframes cgInL  { from{opacity:0;transform:translateX(72px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes cgInR  { from{opacity:0;transform:translateX(-72px)} to{opacity:1;transform:translateX(0)} }
        @keyframes cgOutL { from{opacity:1;transform:translateX(0)}  to{opacity:0;transform:translateX(-56px)} }
        @keyframes cgOutR { from{opacity:1;transform:translateX(0)}  to{opacity:0;transform:translateX(56px)} }

        .card-group > * { animation:cardPop 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .card-group > *:nth-child(1) { animation-delay:0.05s; }
        .card-group > *:nth-child(2) { animation-delay:0.15s; }
        @keyframes cardPop { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }

        /* ── Card base ── */
        .svc-card {
          position:relative; overflow:hidden; border-radius:8px;
          border:1px solid rgba(0,0,0,0.07);
          background:#ffffff;
          display:flex; flex-direction:column;
          cursor:pointer;
          transition:border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;
        }
        .svc-card:hover {
          border-color:transparent;
          box-shadow:0 24px 64px rgba(0,0,0,0.24);
          transform:translateY(-4px);
        }
        .svc-card.card-large { min-height:620px; }
        .svc-card.card-large .card-content { justify-content:flex-end; padding-bottom:40px; }
        .svc-card.card-small { min-height:620px; }
        .svc-card.card-small .card-content { justify-content:space-between; }

        .card-bg-img {
          position:absolute; inset:0; z-index:0;
          background-size:cover; background-position:center;
          opacity:0; transform:scale(1.1);
          transition:
            opacity 0.65s cubic-bezier(0.25,0.46,0.45,0.94),
            transform 0.75s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .svc-card:hover .card-bg-img { opacity:1; transform:scale(1); }

        .card-overlay {
          position:absolute; inset:0; z-index:1;
          background:linear-gradient(to top,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.6) 45%,rgba(0,0,0,0.22) 100%);
          opacity:0; pointer-events:none;
          transition:opacity 0.55s ease;
        }
        .svc-card:hover .card-overlay { opacity:1; }

        .card-content {
          position:relative; z-index:2;
          display:flex; flex-direction:column; flex:1;
          padding:36px 36px 40px;
        }

        .card-icon-badge {
          position:absolute; top:24px; right:24px; z-index:3;
          width:38px; height:38px; border-radius:50%;
          background:rgba(255,255,255,0.92);
          display:flex; align-items:center; justify-content:center;
          backdrop-filter:blur(6px);
          transition:background 0.4s, border 0.4s;
        }
        .svc-card:hover .card-icon-badge {
          background:rgba(255,255,255,0.12);
          border:1px solid rgba(255,255,255,0.3);
        }
        .card-icon-badge svg path { transition:stroke 0.4s; }
        .svc-card:hover .card-icon-badge svg path { stroke:rgba(255,255,255,0.9) !important; }

        .card-accent-line {
          width:40px; height:2px; background:#d42b2b;
          margin-bottom:24px; transition:opacity 0.4s;
        }
        .svc-card:hover .card-accent-line { opacity:0.7; }

        .card-tag {
          font-family:'Barlow',sans-serif; font-size:9.5px; font-weight:600;
          letter-spacing:0.24em; text-transform:uppercase;
          color:#c8c8c8; margin-bottom:10px; transition:color 0.4s;
        }
        .svc-card:hover .card-tag { color:rgba(255,255,255,0.5); }

        .card-title {
          font-family:'Barlow Condensed',sans-serif; font-weight:900;
          font-size:clamp(28px,3vw,42px); text-transform:uppercase;
          color:#0d0d0d; letter-spacing:-0.02em; line-height:0.95;
          margin-bottom:14px; transition:color 0.4s;
        }
        .svc-card:hover .card-title { color:#ffffff; }

        .card-desc {
          font-family:'Barlow',sans-serif; font-size:14px; font-weight:400;
          line-height:1.75; color:#777; flex:1; margin-bottom:28px;
          max-width:340px; transition:color 0.4s;
        }
        .svc-card:hover .card-desc { color:rgba(255,255,255,0.72); }

        .card-cta {
          display:inline-flex; align-items:center; gap:12px;
          font-family:'Barlow',sans-serif; font-size:10.5px; font-weight:600;
          letter-spacing:0.2em; text-transform:uppercase;
          color:#0d0d0d; cursor:pointer; background:none; border:none;
          padding:0; align-self:flex-start; transition:color 0.4s;
        }
        .svc-card:hover .card-cta { color:#ffffff; }
        .card-cta-line {
          width:32px; height:1px; flex-shrink:0;
          background:#0d0d0d; position:relative;
          transition:background 0.4s, width 0.3s;
        }
        .card-cta-line::after {
          content:''; position:absolute; right:0; top:-2.5px;
          border-left:5px solid #0d0d0d;
          border-top:3px solid transparent;
          border-bottom:3px solid transparent;
          transition:border-left-color 0.4s;
        }
        .svc-card:hover .card-cta-line { background:#ffffff; width:44px; }
        .svc-card:hover .card-cta-line::after { border-left-color:#ffffff; }
        .card-cta.red .card-cta-line { background:#d42b2b; }
        .card-cta.red .card-cta-line::after { border-left-color:#d42b2b; }
        .svc-card:hover .card-cta.red .card-cta-line { background:#fff; }
        .svc-card:hover .card-cta.red .card-cta-line::after { border-left-color:#fff; }

        .card-ghost-num {
          position:absolute; bottom:-16px; right:20px; z-index:2;
          font-family:'Barlow Condensed',sans-serif; font-weight:900;
          font-size:140px; line-height:1; letter-spacing:-0.06em;
          pointer-events:none; user-select:none;
          color:rgba(0,0,0,0.035); transition:color 0.4s;
        }
        .svc-card:hover .card-ghost-num { color:rgba(255,255,255,0.07); }

        /* ── Navigation ── */
        .svc-nav { display:flex; align-items:center; gap:20px; margin-top:36px; }
        .svc-nav-btn {
          width:44px; height:44px; border-radius:50%;
          border:1px solid rgba(0,0,0,0.13); background:transparent;
          cursor:pointer; display:flex; align-items:center; justify-content:center;
          flex-shrink:0; transition:background 0.2s, border-color 0.2s;
        }
        .svc-nav-btn:hover { background:#0d0d0d; border-color:#0d0d0d; }
        .svc-nav-btn:hover .sarr { stroke:#fff; }
        .sarr { stroke:#0d0d0d; transition:stroke 0.2s; }

        .svc-dots { display:flex; align-items:center; gap:7px; }
        .svc-dot {
          height:2px; width:20px; background:#ddd; border:none; border-radius:2px;
          cursor:pointer; padding:0;
          transition:width 0.35s ease, background 0.35s ease;
        }
        .svc-dot.active { width:48px; background:#d42b2b; }

        .svc-prog {
          flex:1; max-width:100px; height:1px; background:#e0e0e0;
          border-radius:1px; overflow:hidden; position:relative;
        }
        .svc-prog-fill {
          position:absolute; inset:0 auto 0 0; width:0%;
          background:#0d0d0d; animation:svcFill 6s linear forwards;
        }
        @keyframes svcFill { from{width:0%} to{width:100%} }

        .svc-pg {
          font-family:'Barlow',sans-serif; font-size:10px; font-weight:500;
          letter-spacing:0.14em; color:#bbb; white-space:nowrap;
        }

        @media(max-width:960px){
          .svc-inner { padding:0 28px; }
          .card-group,
          .card-group.cg-leave-left,
          .card-group.cg-leave-right { grid-template-columns:1fr; }
          .svc-card.card-large,
          .svc-card.card-small { min-height:360px; }
          .svc-header { flex-direction:column; align-items:flex-start; }
          .svc-masked-canvas { height:56px; }
        }
      `}</style>

      {/* FIX: style tag is INSIDE BugSectionEffect wrapper, and BugSectionEffect
              gets explicit width:100% so its overflow:hidden covers the section */}
      <BugSectionEffect bugCount={2} leafCount={0} style={{ width: "100%" }}>
        <section className="svc" id="services">
          <div className="svc-inner">

            {/* Header */}
            <div className="svc-header">
              <div className="svc-header-left">
                <span className="svc-sup">What We Do</span>
                <div className="svc-heading">
                  <span className="svc-h-line">CRAFTING THE</span>
                  <span className="svc-h-masked-row">
                    {/* FIX: canvas height is now a fixed px value (80px), not clamp,
                              so offsetHeight is always readable before fonts load */}
                    <SvcMaskedCanvas
                      word="EXCEPTIONAL"
                      videoSrc="/videos/video-1.mp4"
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
                SERVICES&nbsp;/&nbsp;<span>01</span>&nbsp;—&nbsp;<span>08</span>
              </div>
            </div>

            {/* Stage */}
            <div className="svc-stage">
              {/* Leaving group — absolute overlay */}
              {prevGroupIdx !== null && (
                <div
                  key={`out-${prevGroupIdx}`}
                  className={`card-group ${dir === "left" ? "cg-leave-left" : "cg-leave-right"}`}
                >
                  <CardGroup indices={GROUPS[prevGroupIdx]} />
                </div>
              )}
              {/* Entering group — normal flow (sets stage height) */}
              <div
                key={`in-${groupIdx}`}
                className={`card-group ${dir === "left" ? "cg-enter-left" : "cg-enter-right"}`}
              >
                <CardGroup indices={GROUPS[groupIdx]} />
              </div>
            </div>

            {/* Nav */}
            <div className="svc-nav">
              <button className="svc-nav-btn" aria-label="Previous"
                onClick={() => { resetTimer(); prev(); }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7L9 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sarr"/>
                </svg>
              </button>

              <div className="svc-dots">
                {GROUPS.map((_, i) => (
                  <button key={i}
                    className={`svc-dot${i === groupIdx ? " active" : ""}`}
                    aria-label={`Group ${i + 1}`}
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

              <button className="svc-nav-btn" aria-label="Next"
                onClick={() => { resetTimer(); next(); }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2L10 7L5 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sarr"/>
                </svg>
              </button>
            </div>

          </div>
        </section>
      </BugSectionEffect>
    </>
  );
}

/* ── Card group ── */
function CardGroup({ indices }: { indices: number[] }) {
  return (
    <>
      {indices.map((ci) => {
        const card = CARDS[ci];
        return (
          <div key={card.id} className={`svc-card card-${card.layout}`}>
            <div className="card-bg-img" style={{ backgroundImage: `url(${card.image})` }} aria-hidden="true" />
            <div className="card-overlay" aria-hidden="true" />
            {card.icon && <IconBadge type={card.icon} />}
            <div className="card-content">
              {card.accent && <div className="card-accent-line" />}
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

/* ── Icon badges ── */
function IconBadge({ type }: { type: string }) {
  const icons: Record<string, React.ReactElement> = {
    code: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.5 4.5L2 8.5L5.5 12.5" stroke="#d42b2b"/>
        <path d="M11.5 4.5L15 8.5L11.5 12.5" stroke="#d42b2b"/>
      </svg>
    ),
    asterisk: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M8.5 1.5V15.5M1.5 8.5H15.5M3.5 3.5L13.5 13.5M13.5 3.5L3.5 13.5" stroke="#d42b2b" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    film: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1.5" y="3.5" width="14" height="10" rx="1.5" stroke="#d42b2b"/>
        <path d="M1.5 6.5H15.5M1.5 10.5H15.5M5 3.5V6.5M5 10.5V13.5M12 3.5V6.5M12 10.5V13.5" stroke="#d42b2b"/>
      </svg>
    ),
    eye: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 8.5C1 8.5 4 3 8.5 3C13 3 16 8.5 16 8.5C16 8.5 13 14 8.5 14C4 14 1 8.5 1 8.5Z" stroke="#d42b2b"/>
        <circle cx="8.5" cy="8.5" r="2" stroke="#d42b2b"/>
      </svg>
    ),
    diamond: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 1.5L15.5 8.5L8.5 15.5L1.5 8.5L8.5 1.5Z" stroke="#d42b2b"/>
        <path d="M1.5 8.5H15.5" stroke="#d42b2b"/>
      </svg>
    ),
  };
  return <div className="card-icon-badge">{icons[type] ?? null}</div>;
}

/* ── Canvas video mask ── */
function SvcMaskedCanvas({
  word,
  videoSrc,
  className,
}: {
  word: string;
  videoSrc: string;
  className: string;
}) {
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

    // FIX: derive cssH from the element's computed style, not offsetHeight,
    //      so we get the correct value even if layout hasn't painted yet.
    function getCssH(): number {
      if (!canvas) return 80;
      const h = canvas.offsetHeight;
      // offsetHeight returns 0 if element not yet laid out — fall back to CSS value
      if (h > 0) return h;
      const computed = parseFloat(getComputedStyle(canvas).height);
      return isNaN(computed) || computed === 0 ? 80 : computed;
    }

    function initSize() {
      if (!canvas || !ctx) return;
      const cssH = getCssH();
      const fs   = cssH * 0.96;
      ctx.font = `900 italic ${fs}px 'Barlow Condensed', sans-serif`;
      const tw = ctx.measureText(word).width;
      canvas.width        = Math.ceil(tw * dpr);
      canvas.height       = Math.ceil(cssH * dpr);
      canvas.style.width  = `${Math.ceil(tw)}px`;
      canvas.style.height = `${cssH}px`;
    }

    function frame() {
      if (!canvas || !video || !ctx) return;
      const cW = canvas.width  / dpr;
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
      ctx.fillStyle    = "#000";
      ctx.fillText(word, 0, cH * 0.03);
      ctx.restore();
      rafRef.current = requestAnimationFrame(frame);
    }

    // FIX: wait for both fonts AND first layout tick before initSize
    const boot = () => {
      // rAF ensures the browser has done one layout pass so offsetHeight is valid
      requestAnimationFrame(() => { initSize(); frame(); });
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(boot);
    } else {
      setTimeout(boot, 200);
    }

    video.crossOrigin  = "anonymous";
    video.muted        = true;
    video.loop         = true;
    video.playsInline  = true;
    video.src          = videoSrc;

    const onCanPlay = () => {
      readyRef.current = true;
      video.play().catch(() => {});
    };
    video.addEventListener("canplay", onCanPlay);

    // FIX: ResizeObserver re-inits with layout-correct height
    const ro = new ResizeObserver(() => {
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => requestAnimationFrame(() => initSize()));
      } else {
        requestAnimationFrame(() => initSize());
      }
    });
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