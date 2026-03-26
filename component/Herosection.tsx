"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SLIDES = [
  {
    eyebrow: "Our Essence",
    line1: "WE ARE THE",
    masked: "ALCHEMISTS",
    line3: "OF DIGITAL NOIR.",
    sub: "Forged in the intersection of cinematic artistry and raw technical precision, 21FiftyOne transforms brands into immersive experiences.",
    maskVideo: "/videos/mask.webm",
    bgVideo: "/public/videos/video-1.webm",
  },
  {
    eyebrow: "Our Vision",
    line1: "MASTERS OF",
    masked: "CINEMATIC",
    line3: "STORYTELLING.",
    sub: "Every frame is a canvas. Every second of footage a brushstroke in the epic narrative of your brand's legacy.",
    maskVideo: "/videos/mask-2.mp4",
    bgVideo: "/videos/video-2.webm",
  },
  {
    eyebrow: "Our Craft",
    line1: "ARCHITECTS OF",
    masked: "IMMERSIVE",
    line3: "WORLDS.",
    sub: "We build environments where audiences don't just watch — they feel, breathe, and live inside the story.",
    maskVideo: "/videos/mask.mp4",
    bgVideo: "/videos/video-3.webm",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (animating || idx === current) return;
      setAnimating(true);
      setPrev(current);
      setCurrent(idx);
      setTimeout(() => {
        setPrev(null);
        setAnimating(false);
      }, 800);
    },
    [animating, current]
  );

  const next = useCallback(
    () => goTo((current + 1) % SLIDES.length),
    [goTo, current]
  );
  const prevSlide = useCallback(
    () => goTo((current - 1 + SLIDES.length) % SLIDES.length),
    [goTo, current]
  );


  /* Scroll-reactive curved reveal */
  useEffect(() => {
    const curve = document.getElementById("hero-curve");
    const hero = document.querySelector(".hero") as HTMLElement | null;
    if (!curve || !hero) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroH = hero.offsetHeight;
      // Start appearing after 5% scroll, fully visible at 35%
      const start = heroH * 0.18;
      const end = heroH * 0.55;
      const progress = Math.min(Math.max((scrollY - start) / (end - start), 0), 1);
      // translateY goes from 100% (hidden) to 0% (fully shown)
      const ty = 100 - progress * 100;
      curve.style.transform = `translateY(${ty}%)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,900;1,900&family=Barlow:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hero {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
          background: #0a0a0a;
        }

        /* ── Full background video ─────────────── */
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .bg-panel {
          position: absolute;
          inset: 0;
        }
        .bg-panel video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .bg-panel.bg-in  { z-index: 2; animation: bgIn  1s ease forwards; }
        .bg-panel.bg-out { z-index: 1; animation: bgOut 0.7s ease forwards; }
        @keyframes bgIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes bgOut { from { opacity:1; } to { opacity:0; } }

        /* ── Overlay: white on the LEFT (text area), dark on right (video shows) ── */
        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          /* Strong white on left so dark text reads clearly,
             fades to near-transparent on right so video shows through */
        //   background: linear-gradient(
        //     to right,
        //     #ffffff 0%,
        //     rgba(255,255,255,0.96) 20%,
        //     rgba(255,255,255,0.82) 38%,
        //     rgba(255,255,255,0.40) 55%,
        //     rgba(255,255,255,0.10) 72%,
        //     transparent 100%
        //   );
        }

        /* Top + bottom vignette (dark, subtle) */
        .hero-overlay::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.18) 0%,
            transparent 20%,
            transparent 80%,
            rgba(0,0,0,0.22) 100%
          );
          pointer-events: none;
        }

        /* ── Content ───────────────────────────── */
        .hero-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 100px 72px 80px;
          max-width: 800px;
        }

        /* ── Slide stack ───────────────────────── */
        .slide-stack {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }

        .slide-content { width: 100%; }
        .slide-content.is-entering {
          animation: sIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .slide-content.is-leaving {
          position: absolute;
          inset: 0;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          justify-content: center;
          animation: sOut 0.4s ease both;
        }
        @keyframes sIn  { from { opacity:0; transform:translateY(34px); } to { opacity:1; transform:translateY(0); } }
        @keyframes sOut { from { opacity:1; transform:translateY(0); }    to { opacity:0; transform:translateY(-22px); } }

        /* ── Typography — BLACK on white overlay ── */
        .hero-eyebrow {
          font-family: 'Barlow', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.28em;
          color: #aaaaaa;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .hero-h1 { margin-bottom: 28px; }

        .hero-line {
          display: block;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(48px, 6vw, 108px);
          text-transform: uppercase;
          color: #0d0d0d;
          line-height: 0.92;
          letter-spacing: -0.02em;
        }

        /* Row that holds masked canvas — always its own block line */
        .hero-line-masked-row {
          display: block;
          line-height: 0.92;
        }

        /* Trailing text after masked word — inline, same size */
        .hero-line-plain {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(48px, 6vw, 108px);
          text-transform: uppercase;
          color: #0d0d0d;
          line-height: 0.92;
          letter-spacing: -0.02em;
          /* inline-block so it sits beside the canvas on same baseline */
          display: inline-block;
          vertical-align: bottom;
        }

        .masked-canvas {
          display: inline-block;
          vertical-align: bottom;
          height: clamp(44px, 5.53vw, 99px);
          width: auto;
        }

        .hero-sub {
          font-family: 'Barlow', sans-serif;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.78;
          color: #555555;
          max-width: 420px;
          margin-bottom: 52px;
        }

        /* ── Nav ───────────────────────────────── */
        .hero-nav {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.14);
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(8px);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s;
        }
        .nav-btn:hover {
          background: #0d0d0d;
          border-color: #0d0d0d;
        }
        .nav-btn:hover .arr { stroke: #ffffff; }
        .arr {
          stroke: #0d0d0d;
          transition: stroke 0.2s;
        }

        .nav-dots { display: flex; align-items: center; gap: 6px; }
        .nav-dot {
          height: 2px;
          width: 20px;
          background: rgba(0,0,0,0.18);
          border: none;
          border-radius: 2px;
          cursor: pointer;
          padding: 0;
          transition: width 0.35s ease, background 0.35s ease;
        }
        .nav-dot.active { width: 44px; background: #d42b2b; }

        .nav-progress {
          flex: 1;
          max-width: 100px;
          height: 1px;
          background: rgba(0,0,0,0.12);
          border-radius: 1px;
          overflow: hidden;
          position: relative;
        }
        .nav-progress-fill {
          position: absolute;
          inset: 0 auto 0 0;
          width: 0%;
          background: #0d0d0d;
          border-radius: 1px;
          transition: width 0.1s linear;
        }

        .nav-count {
          font-family: 'Barlow', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.16em;
          color: #aaaaaa;
          white-space: nowrap;
        }

        /* ── Slide number watermark (right side, over video) ── */
        .slide-num {
          position: absolute;
          right: 60px;
          bottom: 80px;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(80px, 14vw, 200px);
          line-height: 1;
          color: rgba(255,255,255,0.07);
          letter-spacing: -0.06em;
          pointer-events: none;
          user-select: none;
          z-index: 2;
        }

        /* ── Responsive ────────────────────────── */

        /* ── Curved scroll reveal at bottom ───── */
        .hero-curve {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 10;
          pointer-events: none;
          transform: translateY(100%);
          will-change: transform;
        }
        .hero-curve svg {
          display: block;
          width: 100%;
          height: auto;
        }

        @media (max-width: 768px) {
          .hero-content { padding: 90px 28px 60px; max-width: 100%; }
          .hero-overlay {
            background: linear-gradient(
              to bottom,
              rgba(255,255,255,0.92) 0%,
              rgba(255,255,255,0.80) 50%,
              rgba(255,255,255,0.50) 100%
            );
          }
          .slide-num { display: none; }
        }
      `}</style>

      <section className="hero">

        {/* Background video */}
        <div className="hero-bg">
          {prev !== null && (
            <div className="bg-panel bg-out" key={`bgout-${prev}`}>
              <BgVideo src={SLIDES[prev].bgVideo} active={false} onEnded={null} onProgress={null} />
            </div>
          )}
          <div className="bg-panel bg-in" key={`bgin-${current}`}>
            <BgVideo
              src={SLIDES[current].bgVideo}
              active={true}
              onEnded={next}
              onProgress={(pct) => {
                const el = document.getElementById("npf");
                if (el) el.style.width = `${pct}%`;
              }}
            />
          </div>
        </div>

        {/* White-to-transparent overlay */}
        <div className="hero-overlay" />

        {/* Text content */}
        <div className="hero-content">
          <div className="slide-stack">
            {prev !== null && (
              <div className="slide-content is-leaving" key={`out-${prev}`}>
                <SlideText slide={SLIDES[prev]} />
              </div>
            )}
            <div className="slide-content is-entering" key={`in-${current}`}>
              <SlideText slide={SLIDES[current]} />
            </div>
          </div>

          <div className="hero-nav">
            <button className="nav-btn" aria-label="Previous" onClick={prevSlide}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="arr" />
              </svg>
            </button>

            <div className="nav-dots">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`nav-dot${i === current ? " active" : ""}`}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>

            <div className="nav-progress">
              <div className="nav-progress-fill" id="npf" />
            </div>

            <span className="nav-count">
              {String(current + 1).padStart(2, "0")}&thinsp;/&thinsp;{String(SLIDES.length).padStart(2, "0")}
            </span>

            <button className="nav-btn" aria-label="Next" onClick={next}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2L10 7L5 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="arr" />
              </svg>
            </button>
          </div>
        </div>

        {/* Watermark */}
        <div className="slide-num" key={`num-${current}`}>
          {String(current + 1).padStart(2, "0")}
        </div>


        {/* Curved white reveal — reacts to scroll */}
        <div className="hero-curve" id="hero-curve">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,60 L0,30 Q360,0 720,20 Q1080,40 1440,10 L1440,60 Z" fill="#f8f7f5"/>
          </svg>
        </div>

      </section>
    </>
  );
}

/* ── Slide text ─────────────────────────────────── */
function SlideText({ slide }: { slide: (typeof SLIDES)[0] }) {
  return (
    <>
      <p className="hero-eyebrow">{slide.eyebrow}</p>
      <h1 className="hero-h1">
        <span className="hero-line">{slide.line1}</span>
        <span className="hero-line-masked-row">
          <MaskedCanvas word={slide.masked} videoSrc={slide.maskVideo} />
          {slide.line3 && (
            <span className="hero-line-plain">&nbsp;{slide.line3}</span>
          )}
        </span>
      </h1>
      <p className="hero-sub">{slide.sub}</p>
    </>
  );
}

/* ── Background video ───────────────────────────── */
function BgVideo({
  src,
  active,
  onEnded,
  onProgress,
}: {
  src: string;
  active: boolean;
  onEnded: (() => void) | null;
  onProgress: ((pct: number) => void) | null;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.loop = false;
    v.playsInline = true;

    const handleEnded = () => { if (onEnded) onEnded(); };
    const handleTime = () => {
      if (!v.duration || !onProgress) return;
      onProgress((v.currentTime / v.duration) * 100);
    };

    v.addEventListener("ended", handleEnded);
    v.addEventListener("timeupdate", handleTime);

    if (active) { v.currentTime = 0; v.play().catch(() => {}); }
    else { v.pause(); }

    return () => {
      v.removeEventListener("ended", handleEnded);
      v.removeEventListener("timeupdate", handleTime);
    };
  }, [active, onEnded, onProgress]);

  return <video ref={ref} src={src} muted playsInline />;
}

/* ── Canvas destination-in video mask ──────────── */
function MaskedCanvas({ word, videoSrc }: { word: string; videoSrc: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const readyRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    function initSize() {
      if (!canvas || !ctx) return;
      const cssH = canvas.offsetHeight || 118;
      const fs = cssH * 0.96;
      ctx.font = `900 italic ${fs}px 'Barlow Condensed', sans-serif`;
      const tw = ctx.measureText(word).width;
      canvas.width = Math.ceil(tw * dpr);
      canvas.height = Math.ceil(cssH * dpr);
      canvas.style.width = `${Math.ceil(tw)}px`;
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
        g.addColorStop(0, "#a81008");
        g.addColorStop(0.4, "#e0361a");
        g.addColorStop(0.7, "#d42b2b");
        g.addColorStop(1, "#6e0000");
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
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.src = videoSrc;

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
      <canvas ref={canvasRef} className="masked-canvas" aria-label={word} />
    </>
  );
}