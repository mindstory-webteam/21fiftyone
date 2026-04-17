"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SplitText from "./Splittext";

/* ═══════════════════════════════════════════════════════════
   BREAK THE MOLD  — scroll-driven frame-by-frame sequence
   76 JPG frames embedded as base64 — no video file needed
   Fixed: true 100vw full-bleed, canvas sized to real viewport
═══════════════════════════════════════════════════════════ */


export default function BreakTheMold() {
  const wrapperRef    = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const imagesRef     = useRef<HTMLImageElement[]>([]);
  const loadedRef     = useRef<boolean[]>([]);
  const drawnFrame    = useRef<number>(-1);
  const [visible,     setVisible]   = useState(false);
  const [imgsReady,   setImgsReady] = useState(false);

  /* ── Pre-load all frames into Image objects ── */
  useEffect(() => {
    const total   = FRAMES.length;
    const imgs: HTMLImageElement[] = [];
    const loaded  = new Array<boolean>(total).fill(false);
    let loadedCount = 0;

    FRAMES.forEach((src, i) => {
      const img  = new Image();
      img.onload = () => {
        loaded[i] = true;
        loadedCount++;
        if (loadedCount === total) setImgsReady(true);
      };
      img.src = src;
      imgs.push(img);
    });
    imagesRef.current = imgs;
    loadedRef.current = loaded;
  }, []);

  /* ── Draw a frame onto the canvas ── */
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img    = imagesRef.current[index];
    if (!canvas || !img || !loadedRef.current[index]) return;
    if (drawnFrame.current === index) return;
    drawnFrame.current = index;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth  || 640;
    const ih = img.naturalHeight || 360;

    // object-fit: cover  math
    const scale = Math.max(cw / iw, ch / ih);
    const sw    = iw * scale;
    const sh    = ih * scale;
    const sx    = (cw - sw) / 2;
    const sy    = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  };

  /* ── Sync canvas pixel size to real screen dimensions ── */
  const syncCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Use the bounding rect of the STICKY parent, not window.innerWidth,
    // so we never over-size or under-size relative to the rendered element.
    const sticky = canvas.parentElement;
    if (!sticky) return;
    const { width, height } = sticky.getBoundingClientRect();
    if (canvas.width !== Math.round(width) || canvas.height !== Math.round(height)) {
      canvas.width  = Math.round(width);
      canvas.height = Math.round(height);
      drawnFrame.current = -1; // force redraw after resize
    }
  };

  /* ── Main scroll → frame scrubber ── */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    syncCanvas();
    drawFrame(0);

    let rafId = 0;

    const scrub = () => {
      syncCanvas();
      const rect        = wrapper.getBoundingClientRect();
      const wh          = window.innerHeight;
      const totalScroll = wrapper.offsetHeight - wh;
      const scrolled    = Math.max(0, -rect.top);
      const progress    = totalScroll > 0 ? Math.min(1, scrolled / totalScroll) : 0;

      const idx = Math.min(FRAMES.length - 1, Math.round(progress * (FRAMES.length - 1)));
      drawFrame(idx);
      setVisible(progress >= 0.97);
    };

    const onScroll = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(scrub); };
    const onResize = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(scrub); };

    scrub();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize",  onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize",  onResize);
      cancelAnimationFrame(rafId);
    };
  }, [imgsReady]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@300;400;600;700&display=swap');

        /* ══════════════════════════════════════════════════════
           FULL-BLEED ESCAPE
           Works regardless of parent max-width / padding.
           Uses a fixed-position sentinel trick for scroll, then
           a 100vw wrapper that breaks out of the layout box.
        ══════════════════════════════════════════════════════ */
        .btm-bleed {
          /* Pull the element to the true left edge of the viewport */
          position: relative;
          width:  100vw;
          left:   50%;
          transform: translateX(-50%);
          /* Prevent horizontal scrollbar on any layout */
          overflow-x: clip;
        }

        /* ══ TALL SCROLL DRIVER ══ */
        .btm-scroll-wrapper {
          position: relative;
          height: 450vh;
          width: 100%;
        }

        /* ══ STICKY PANEL — true 100vw × 100vh ══ */
        .btm-sticky {
          position: sticky;
          top: 0;
          left: 0;
          width:  100vw;
          height: 100vh;
          overflow: hidden;
          background: #0d0d0d;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Snap the sticky panel back to viewport left if parent has margin */
          margin-left: calc(50% - 50vw);
        }

        /* ══ CANVAS ══ */
        .btm-canvas {
          position: absolute;
          top:    0;
          left:   0;
          /* Let CSS stretch fill the sticky container, JS sets pixel dims */
          width:  100%;
          height: 100%;
          display: block;
          z-index: 1;
        }

        /* ══ OVERLAY ══ */
        .btm-overlay {
          position: absolute; inset: 0; z-index: 2;
          background: rgba(13,13,13,0);
          transition: background 1s cubic-bezier(0.16,1,0.3,1);
          pointer-events: none;
        }
        .btm-overlay.on { background: rgba(13,13,13,0.65); }

        /* ══ GLOW ══ */
        .btm-glow {
          position: absolute; inset: 0; z-index: 3;
          background: radial-gradient(ellipse 70% 60% at 40% 55%, rgba(212,43,43,0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ══ RULES ══ */
        .btm-top-rule, .btm-bottom-rule {
          position: absolute; left: 0; right: 0; height: 1px; z-index: 4;
          background: linear-gradient(to right,
            transparent 0%, rgba(255,255,255,0.08) 20%,
            rgba(255,255,255,0.08) 80%, transparent 100%
          );
        }
        .btm-top-rule    { top: 0; }
        .btm-bottom-rule { bottom: 0; }

        /* ══ CORNERS ══ */
        .btm-corner {
          position: absolute; width: 20px; height: 20px;
          pointer-events: none; opacity: 0.18; z-index: 4;
          transition: opacity 0.6s ease;
        }
        .btm-corner.show { opacity: 0.32; }
        .btm-corner.tl { top: 24px;    left: 40px;  border-top: 1px solid #fff; border-left: 1px solid #fff; }
        .btm-corner.tr { top: 24px;    right: 40px; border-top: 1px solid #fff; border-right: 1px solid #fff; }
        .btm-corner.bl { bottom: 24px; left: 40px;  border-bottom: 1px solid #fff; border-left: 1px solid #fff; }
        .btm-corner.br { bottom: 24px; right: 40px; border-bottom: 1px solid #fff; border-right: 1px solid #fff; }

        /* ══ META ══ */
        .btm-meta-left {
          position: absolute; bottom: 32px; left: 52px; z-index: 5;
          display: flex; align-items: center; gap: 10px;
          opacity: 0; transition: opacity 0.9s ease 0.6s; pointer-events: none;
        }
        .btm-meta-left.show { opacity: 0.28; }
        .btm-meta-left-line { width: 22px; height: 1px; background: #fff; flex-shrink: 0; }
        .btm-meta-right {
          position: absolute; bottom: 32px; right: 52px; z-index: 5;
          opacity: 0; transition: opacity 0.9s ease 0.75s; pointer-events: none;
        }
        .btm-meta-right.show { opacity: 0.2; }
        .btm-meta-text {
          font-family: 'Barlow', sans-serif; font-size: 8.5px; font-weight: 600;
          letter-spacing: 0.32em; color: #fff; text-transform: uppercase;
        }

        /* ══ GHOST NUMBER ══ */
        .btm-bg-num {
          position: absolute; right: -20px; bottom: -50px; z-index: 3;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(180px, 26vw, 320px); font-weight: 900;
          color: rgba(255,255,255,0.025); line-height: 1;
          letter-spacing: -0.05em; pointer-events: none; user-select: none;
        }

        /* ══ PROGRESS BAR ══ */
        .btm-progress-bar {
          position: absolute; bottom: 0; left: 0;
          height: 2px; z-index: 10;
          background: linear-gradient(to right, #d42b2b, #ff6b6b);
          width: 0%;
        }

        /* ══ FRAME COUNTER ══ */
        .btm-frame-counter {
          position: absolute; top: 26px; right: 52px; z-index: 5;
          font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700;
          letter-spacing: 0.2em; color: rgba(255,255,255,0.2);
          pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .btm-frame-counter.hidden { opacity: 0; }

        /* ══ SCROLL HINT ══ */
        .btm-scroll-hint {
          position: absolute; bottom: 40px; left: 50%;
          transform: translateX(-50%); z-index: 6;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          opacity: 1; transition: opacity 0.6s ease; pointer-events: none;
        }
        .btm-scroll-hint.hidden { opacity: 0; }
        .btm-scroll-hint-label {
          font-family: 'Barlow', sans-serif; font-size: 8px; font-weight: 700;
          letter-spacing: 0.3em; color: rgba(255,255,255,0.35); text-transform: uppercase;
        }
        .btm-scroll-hint-line {
          width: 1px; height: 36px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.38), transparent);
          animation: btmPulse 1.5s ease-in-out infinite;
        }
        @keyframes btmPulse {
          0%, 100% { opacity: 0.35; transform: scaleY(0.55); transform-origin: top; }
          50%       { opacity: 1;   transform: scaleY(1);     transform-origin: top; }
        }

        /* ══ CONTENT ══ */
        .btm-content {
          position: relative; z-index: 6;
          width: 100%; max-width: 800px;
          padding: 0 40px; text-align: center;
          opacity: 0; transform: translateY(32px);
          transition:
            opacity   0.95s cubic-bezier(0.16,1,0.3,1) 0.05s,
            transform 0.95s cubic-bezier(0.16,1,0.3,1) 0.05s;
          pointer-events: none;
        }
        .btm-content.show { opacity: 1; transform: translateY(0); pointer-events: auto; }

        /* ── Eyebrow ── */
        .btm-eyebrow {
          display: inline-flex; align-items: center; gap: 14px; margin-bottom: 32px;
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.55s ease 0.15s, transform 0.55s cubic-bezier(0.16,1,0.3,1) 0.15s;
        }
        .btm-eyebrow.show { opacity: 1; transform: translateY(0); }
        .btm-eyebrow-bar  { width: 28px; height: 1px; background: rgba(212,43,43,0.8); flex-shrink: 0; }
        .btm-eyebrow-label {
          font-family: 'Barlow', sans-serif; font-size: 9px; font-weight: 700;
          letter-spacing: 0.36em; color: #d42b2b; text-transform: uppercase;
        }

        /* ── Headlines ── */
        .btm-headline-wrap { margin: 0 0 28px; line-height: 0.88; }
        .btm-split-solid {
          font-family: 'Barlow Condensed', sans-serif !important;
          font-weight: 900 !important;
          font-size: clamp(52px, 9.5vw, 112px) !important;
          text-transform: uppercase !important; line-height: 0.88 !important;
          letter-spacing: -0.02em !important; color: #ffffff !important;
          display: flex !important; justify-content: center !important;
        }
        .btm-split-outline {
          font-family: 'Barlow Condensed', sans-serif !important;
          font-weight: 900 !important;
          font-size: clamp(52px, 9.5vw, 112px) !important;
          text-transform: uppercase !important; line-height: 0.88 !important;
          letter-spacing: -0.02em !important; color: transparent !important;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.2) !important;
          display: flex !important; justify-content: center !important;
          margin-top: 6px !important;
        }

        /* ── Sub ── */
        .btm-sub {
          font-family: 'Barlow', sans-serif; font-size: 14px; font-weight: 400;
          line-height: 1.85; color: rgba(255,255,255,0.4);
          max-width: 440px; margin: 0 auto 44px;
        }

        /* ── CTAs ── */
        .btm-ctas {
          display: flex; align-items: center; justify-content: center; gap: 18px;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.5s;
        }
        .btm-ctas.show { opacity: 1; transform: translateY(0); }

        .btm-btn-primary {
          display: inline-flex; align-items: center; gap: 14px;
          background: #d42b2b; color: #fff;
          font-family: 'Barlow', sans-serif; font-size: 9px; font-weight: 700;
          letter-spacing: 0.28em; text-transform: uppercase; text-decoration: none;
          padding: 16px 30px; border-radius: 2px; border: none; cursor: pointer;
          transition: background 0.25s, gap 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s;
        }
        .btm-btn-primary:hover {
          background: #bf2020; gap: 22px;
          box-shadow: 0 0 32px rgba(212,43,43,0.45);
        }
        .btm-btn-primary svg { flex-shrink: 0; transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); }
        .btm-btn-primary:hover svg { transform: translateX(5px); }

        .btm-btn-ghost {
          display: inline-flex; align-items: center; gap: 10px;
          background: none; color: rgba(255,255,255,0.5);
          font-family: 'Barlow', sans-serif; font-size: 9px; font-weight: 600;
          letter-spacing: 0.26em; text-transform: uppercase;
          text-decoration: none; padding: 16px 0;
          border: none; cursor: pointer; transition: color 0.22s ease;
          position: relative;
        }
        .btm-btn-ghost::after {
          content: ''; position: absolute; bottom: 12px; left: 0; right: 0;
          height: 1px; background: rgba(255,255,255,0.25);
          transform: scaleX(0);
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .btm-btn-ghost:hover { color: rgba(255,255,255,0.9); }
        .btm-btn-ghost:hover::after { transform: scaleX(1); }

        @media (max-width: 768px) {
          .btm-content { padding: 0 24px; }
          .btm-ctas    { flex-direction: column; gap: 10px; }
          .btm-corner, .btm-meta-left, .btm-meta-right { display: none; }
        }
      `}</style>

      {/* ── Full-bleed wrapper ── */}
      <div className="btm-bleed">
        {/* ── Tall scroll container (drives the sticky) ── */}
        <div className="btm-scroll-wrapper" ref={wrapperRef}>

          {/* ── Sticky 100vw × 100vh viewport ── */}
          <div className="btm-sticky">

            {/* Canvas: all 76 frames render here */}
            <canvas ref={canvasRef} className="btm-canvas" />

            {/* Red scrub bar */}
            <ScrollBar wrapperRef={wrapperRef} />

            {/* Frame counter */}
            <FrameCounter wrapperRef={wrapperRef} total={FRAMES.length} hidden={visible} />

            {/* Layers */}
            <div className={`btm-overlay${visible ? " on" : ""}`} />
            <div className="btm-glow" />
            <div className="btm-bg-num">1</div>
            <div className="btm-top-rule" />
            <div className="btm-bottom-rule" />

            <div className={`btm-corner tl${visible ? " show" : ""}`} />
            <div className={`btm-corner tr${visible ? " show" : ""}`} />
            <div className={`btm-corner bl${visible ? " show" : ""}`} />
            <div className={`btm-corner br${visible ? " show" : ""}`} />

            <div className={`btm-meta-left${visible ? " show" : ""}`}>
              <div className="btm-meta-left-line" />
              <span className="btm-meta-text">Studio 2025</span>
            </div>
            <div className={`btm-meta-right${visible ? " show" : ""}`}>
              <span className="btm-meta-text">Based Worldwide</span>
            </div>

            {/* Scroll hint */}
            <div className={`btm-scroll-hint${visible ? " hidden" : ""}`}>
              <span className="btm-scroll-hint-label">Scroll</span>
              <div className="btm-scroll-hint-line" />
            </div>

            {/* Content — revealed at last frame */}
            <div className={`btm-content${visible ? " show" : ""}`}>

              <div className={`btm-eyebrow${visible ? " show" : ""}`}>
                <div className="btm-eyebrow-bar" />
                <span className="btm-eyebrow-label">Let&apos;s Create Together</span>
                <div className="btm-eyebrow-bar" />
              </div>

              <div className="btm-headline-wrap">
                <SplitText
                  text="READY TO BREAK"
                  className="btm-split-solid"
                  splitType="chars"
                  delay={30}
                  duration={1.1}
                  ease="power3.out"
                  from={{ opacity: 0, y: 48, skewX: -6 }}
                  to={{ opacity: 1, y: 0, skewX: 0 }}
                  threshold={0.2}
                  rootMargin="-40px"
                  textAlign="center"
                  hoverRoll
                  hoverRollDirection="center"
                  autoRoll
                  autoRollInterval={5500}
                  autoRollDuration={620}
                />
                <SplitText
                  text="THE MOLD?"
                  className="btm-split-outline"
                  splitType="words"
                  delay={120}
                  duration={1.2}
                  ease="power4.out"
                  from={{ opacity: 0, y: 64, skewX: 8 }}
                  to={{ opacity: 1, y: 0, skewX: 0 }}
                  threshold={0.2}
                  rootMargin="-40px"
                  textAlign="center"
                  hoverRoll
                  hoverRollDirection="left"
                />
              </div>

              <p className="btm-sub">
                Let&apos;s collaborate on your next masterpiece.{" "}
                Our studio doors are always open for the brave.
              </p>

              <div className={`btm-ctas${visible ? " show" : ""}`}>
                <Link href="/contact">
                  <button type="button" className="btm-btn-primary">
                    Connect With The Studio
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                      <path
                        d="M1 5H13M9 1L13 5L9 9"
                        stroke="white" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </Link>
                <Link href="/studio">
                  <button type="button" className="btm-btn-ghost">View Our Work</button>
                </Link>
              </div>

            </div>{/* /btm-content */}
          </div>{/* /btm-sticky */}
        </div>{/* /btm-scroll-wrapper */}
      </div>{/* /btm-bleed */}
    </>
  );
}

/* ══ Scroll progress bar ══ */
function ScrollBar({ wrapperRef }: { wrapperRef: React.RefObject<HTMLDivElement | null> }) {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let rid = 0;
    const update = () => {
      const w = wrapperRef.current;
      if (!w) return;
      const r   = w.getBoundingClientRect();
      const tot = w.offsetHeight - window.innerHeight;
      const pct = tot > 0 ? Math.min(100, (Math.max(0, -r.top) / tot) * 100) : 0;
      bar.style.width = `${pct}%`;
    };
    const fn = () => { cancelAnimationFrame(rid); rid = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", fn, { passive: true });
    return () => { window.removeEventListener("scroll", fn); cancelAnimationFrame(rid); };
  }, [wrapperRef]);
  return <div ref={barRef} className="btm-progress-bar" />;
}

/* ══ Frame counter ══ */
function FrameCounter({
  wrapperRef, total, hidden,
}: {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  total: number;
  hidden: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let rid = 0;
    const update = () => {
      const w = wrapperRef.current;
      if (!w) return;
      const r   = w.getBoundingClientRect();
      const tot = w.offsetHeight - window.innerHeight;
      const p   = tot > 0 ? Math.min(1, Math.max(0, -r.top) / tot) : 0;
      const f   = Math.min(total, Math.round(p * total));
      el.textContent = `${String(f).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    };
    const fn = () => { cancelAnimationFrame(rid); rid = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", fn, { passive: true });
    return () => { window.removeEventListener("scroll", fn); cancelAnimationFrame(rid); };
  }, [wrapperRef, total]);
  return (
    <span ref={ref} className={`btm-frame-counter${hidden ? " hidden" : ""}`}>
      00 / {String(total).padStart(2, "0")}
    </span>
  );
}