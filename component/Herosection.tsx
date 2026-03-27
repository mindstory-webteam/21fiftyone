"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, useCallback } from "react";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   VIDEOS — replace with your real paths
═══════════════════════════════════════════ */
const VIDEOS = [
  "/videos/video-1.webm",
  "/videos/video-2.webm",
  "/videos/video-3.webm",
  "/videos/video-4.webm",
];
const getVideo = (i: number) =>
  VIDEOS[((i % VIDEOS.length) + VIDEOS.length) % VIDEOS.length];

/* ─── 3-D tilt wrapper ─── */
const VideoPreview = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    gsap.to(el, {
      rotateY: ((e.clientX - left) / width  - 0.5) * 14,
      rotateX: ((e.clientY - top)  / height - 0.5) * -14,
      duration: 0.28, ease: "power1.out",
      transformPerspective: 900, overwrite: "auto",
    });
  }, []);
  const onLeave = useCallback(() =>
    gsap.to(ref.current, { rotateY: 0, rotateX: 0, duration: 0.65, ease: "power3.out", overwrite: "auto" }), []);
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transformStyle: "preserve-3d", width: "100%", height: "100%" }}>
      {children}
    </div>
  );
};

/* ─── Button ─── */
const Button = ({ id, title }: { id?: string; title: string }) => (
  <button id={id} className="detroit-btn">
    <span>{title}</span>
    <span className="btn-arrow">→</span>
  </button>
);

/* ═══════════════════════════════════════════
   HERO
═══════════════════════════════════════════ */
export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasClicked,   setHasClicked]   = useState(false);
  const [isHovered,    setIsHovered]    = useState(false);

  const bgVdRef    = useRef<HTMLVideoElement>(null);
  const nextVdRef  = useRef<HTMLVideoElement>(null);
  const miniVdRef  = useRef<HTMLVideoElement>(null);
  const miniCardRef = useRef<HTMLDivElement>(null);
  const miniHintRef = useRef<HTMLDivElement>(null);

  const nextIndex = (currentIndex + 1) % VIDEOS.length;

  const slides = [
    { eyebrow: "Detroit Studio — Paris",  line1: "We",    line2: "Make",  accent: "Culture.",    sub: "AI Production House · Luxury & Editorial",      cta: "View Our Work" },
    { eyebrow: "120+ Projects Delivered", line1: "Human", line2: "Meets", accent: "Machine.",    sub: "Where artistry meets AI precision",              cta: "Our Process"   },
    { eyebrow: "48 Luxury Brands",        line1: "Every", line2: "Frame", accent: "Deliberate.", sub: "Louis Vuitton · Hermès · Chanel · Dom Pérignon", cta: "Case Studies"  },
    { eyebrow: "Est. 2021 — Paris",       line1: "Born",  line2: "From",  accent: "Obsession.",  sub: "We engineer cultural moments that last",          cta: "About Us"      },
  ];
  const slide = slides[currentIndex % slides.length];

  /* ── mini click ── */
  const handleMiniClick = useCallback(() => {
    setHasClicked(true);
    setCurrentIndex(p => (p + 1) % VIDEOS.length);
  }, []);

  /* ── hover reveal / hide ── */
  const handleEnter = useCallback(() => {
    setIsHovered(true);
    gsap.to(miniCardRef.current, {
      opacity: 1, scale: 1, y: 0,
      duration: 0.5, ease: "power3.out", overwrite: "auto",
    });
    gsap.to(miniHintRef.current, {
      opacity: 0, duration: 0.25, overwrite: "auto",
    });
  }, []);

  const handleLeave = useCallback(() => {
    setIsHovered(false);
    gsap.to(miniCardRef.current, {
      opacity: 0, scale: 0.9, y: 16,
      duration: 0.38, ease: "power2.in", overwrite: "auto",
    });
    gsap.to(miniHintRef.current, {
      opacity: 1, duration: 0.4, delay: 0.1, overwrite: "auto",
    });
  }, []);

  /* ── sync mini src ── */
  useEffect(() => {
    const mv = miniVdRef.current; if (!mv) return;
    mv.src = getVideo(nextIndex);
    mv.load(); mv.play().catch(() => {});
  }, [nextIndex]);

  /* ── expand on click ── */
  useEffect(() => {
    if (!hasClicked) return;
    const nv = nextVdRef.current;
    const bg = bgVdRef.current;
    if (!nv) return;
    nv.src = getVideo(currentIndex); nv.load();
    const ctx = gsap.context(() => {
      gsap.set(nv, { visibility: "visible", width: 240, height: 240, xPercent: -50, yPercent: -50 });
      gsap.to(nv, {
        width: "100%", height: "100%", xPercent: 0, yPercent: 0, top: 0, left: 0,
        duration: 0.95, ease: "power2.inOut",
        onStart() { nv.play().catch(() => {}); },
        onComplete() {
          if (bg) { bg.src = getVideo(currentIndex); bg.load(); bg.play().catch(() => {}); }
          gsap.set(nv, { visibility: "hidden", clearProps: "width,height,top,left,xPercent,yPercent" });
        },
      });
    });
    return () => ctx.revert();
  }, [currentIndex, hasClicked]);

  /* ── scroll clip ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("#video-frame", { clipPath: "polygon(14% 0,72% 0,88% 90%,0 95%)", borderRadius: "0% 0% 40% 10%" });
      gsap.from("#video-frame", {
        clipPath: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)", borderRadius: "0% 0% 0% 0%",
        ease: "power1.inOut",
        scrollTrigger: { trigger: "#video-frame", start: "center center", end: "bottom center", scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  /* ── text stagger ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-text-item",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.72, ease: "power3.out", stagger: 0.09 }
      );
    });
    return () => ctx.revert();
  }, [currentIndex]);

  /* ── init mini hidden ── */
  useEffect(() => {
    gsap.set(miniCardRef.current, { opacity: 0, scale: 0.9, y: 16 });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root { --cream:#f2ede6; --black:#0c0c0c; --red:#c8372d; }

        /* Button */
        .detroit-btn {
          display: inline-flex; align-items: center; gap: 16px;
          background: var(--red); color: var(--cream); border: none;
          padding: 15px 32px; font-family:'DM Sans',sans-serif;
          font-size: 9px; letter-spacing: .36em; text-transform: uppercase;
          font-weight: 500; cursor: pointer; outline: none;
          transition: gap .32s ease, background .25s ease;
        }
        .detroit-btn:hover { gap: 26px; background: #a82b22; }
        .btn-arrow { transition: transform .32s ease; }
        .detroit-btn:hover .btn-arrow { transform: translateX(5px); }

        /* Headings */
        .d-h1 {
          font-family: 'Anton', sans-serif;
          font-size: clamp(72px, 10vw, 148px);
          line-height: .84; letter-spacing: -.02em;
          text-transform: uppercase; color: var(--cream); display: block;
        }
        .d-h1-accent {
          font-family: 'Playfair Display', serif; font-style: italic;
          font-size: clamp(60px, 8.2vw, 122px);
          line-height: .88; letter-spacing: -.01em;
          color: var(--red); display: block;
        }
        .d-ghost {
          font-family: 'Anton', sans-serif;
          font-size: clamp(72px, 10vw, 148px);
          line-height: .84; letter-spacing: -.02em; text-transform: uppercase;
          -webkit-text-stroke: 1.5px rgba(242,237,230,.14); color: transparent;
          pointer-events: none; user-select: none;
        }
        .d-ghost-dark { -webkit-text-stroke: 1.5px rgba(12,12,12,.12); }

        /* Eyebrow */
        .d-eyebrow {
          font-family: 'DM Sans', sans-serif; font-size: 8.5px;
          letter-spacing: .42em; text-transform: uppercase;
          color: var(--red); display: flex; align-items: center; gap: 12px;
        }
        .d-eyebrow::before { content:''; width:24px; height:1px; background:var(--red); flex-shrink:0; }

        /* Sub */
        .d-sub {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          line-height: 1.85; color: rgba(242,237,230,.46);
          font-weight: 300; letter-spacing: .03em;
        }

        /* HUD */
        .d-hud {
          font-family: 'DM Sans', sans-serif; font-size: 8px;
          letter-spacing: .28em; text-transform: uppercase;
          color: rgba(242,237,230,.24); position: absolute; z-index: 45; pointer-events: none;
        }
        @keyframes blink { 50%{ opacity:.1 } }
        .d-rec { color:var(--red); animation:blink 1.1s steps(1) infinite; }

        /* Corner marks */
        .d-corner { position:absolute; z-index:45; pointer-events:none; }
        .d-corner::before,.d-corner::after { content:''; position:absolute; background:rgba(200,55,45,.28); }
        .d-corner::before { width:16px; height:1px; }
        .d-corner::after  { width:1px; height:16px; }
        .dc-tl { top:20px; left:20px; }
        .dc-tr { top:20px; right:20px; }
        .dc-tr::before { right:0; }
        .dc-tr::after  { right:0; }

        /* Grain */
        .d-grain {
          position:absolute; inset:0; pointer-events:none; z-index:35;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size:160px; mix-blend-mode:overlay; opacity:.032;
        }

        /* Left gradient */
        .d-backdrop {
          position:absolute; inset:0; z-index:8; pointer-events:none;
          background:linear-gradient(
            100deg,
            rgba(3,3,3,.95)  0%,
            rgba(4,4,4,.84)  22%,
            rgba(0,0,0,.58)  44%,
            rgba(0,0,0,.18)  62%,
            transparent      76%
          );
        }

        /* Dots */
        .d-dot {
          width:4px; height:4px; background:rgba(242,237,230,.18);
          border-radius:2px; transition:background .35s ease,width .35s ease; cursor:pointer;
        }
        .d-dot.active { background:var(--red); width:22px; }

        /* ══ LAYOUT ══ */

        /* Full-height left column — text lives here */
        .hero-col-left {
          position:absolute; left:0; top:0; bottom:0;
          width: clamp(420px, 42vw, 620px);
          z-index:42;
          display:flex; flex-direction:column;
          padding: 0 64px;
          justify-content:center;
          gap: 0;
        }

        /* Top eyebrow strip */
        .hero-eyebrow-row {
          position:absolute; top: 36px; left:64px;
        }

        /* Heading block — centered vertically */
        .hero-heading {
          display:flex; flex-direction:column; gap: 4px;
          margin-bottom: 32px;
        }

        /* Body copy + CTA */
        .hero-body { display:flex; flex-direction:column; gap:28px; }

        /* Bottom bar */
        .hero-bar {
          position:absolute; bottom:36px; left:64px;
          display:flex; align-items:center; gap:24px;
        }

        /* ══ RIGHT PREVIEW ZONE ══ */

        /* Invisible hover zone — occupies right portion */
        .preview-zone {
          position:absolute;
          right: 0; top:0; bottom:0;
          width: clamp(260px, 30vw, 400px);
          z-index:44;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer;
        }

        /* Hint text — shows when card hidden */
        .preview-hint {
          font-family:'DM Sans',sans-serif; font-size:8px;
          letter-spacing:.36em; text-transform:uppercase;
          color:rgba(242,237,230,.16);
          writing-mode:vertical-rl; transform:rotate(180deg);
          pointer-events:none;
          transition:opacity .35s ease;
        }

        /* The card */
        .preview-card {
          position:absolute;
          width: clamp(200px, 22vw, 300px);
          aspect-ratio: 9/14;
          border-radius:8px; overflow:hidden;
          box-shadow:0 24px 72px rgba(0,0,0,.75), 0 2px 12px rgba(0,0,0,.5);
          will-change:transform,opacity;
        }
        .preview-card video {
          width:100%; height:100%;
          object-fit:cover; display:block;
          filter:saturate(.84) contrast(1.05);
        }

        /* Hover: inner scale */
        .preview-card-inner {
          width:100%; height:100%;
          transition:transform .45s cubic-bezier(.22,1,.36,1);
          transform:scale(1);
        }
        .preview-zone:hover .preview-card-inner { transform:scale(1.04); }

        /* Card overlays */
        .preview-card-border {
          position:absolute; inset:0; z-index:2; pointer-events:none;
          border:1px solid rgba(200,55,45,.18); border-radius:8px;
          transition:border-color .35s ease;
        }
        .preview-zone:hover .preview-card-border { border-color:rgba(200,55,45,.5); }

        .preview-card-foot {
          position:absolute; bottom:0; left:0; right:0; z-index:3;
          padding:40px 16px 16px;
          background:linear-gradient(transparent,rgba(0,0,0,.78));
          display:flex; justify-content:space-between; align-items:flex-end;
        }
        .preview-card-foot span {
          font-family:'DM Sans',sans-serif; font-size:8px;
          letter-spacing:.28em; text-transform:uppercase;
          color:rgba(242,237,230,.42);
        }
        .preview-tint {
          position:absolute; inset:0; z-index:1; pointer-events:none;
          background:linear-gradient(150deg,rgba(200,55,45,.1),transparent 52%);
        }

        /* "CLICK" badge */
        .preview-badge {
          position:absolute; top:14px; left:14px; z-index:4;
          font-family:'DM Sans',sans-serif; font-size:7px;
          letter-spacing:.32em; text-transform:uppercase;
          color:rgba(242,237,230,.36);
          border:1px solid rgba(242,237,230,.12);
          padding:5px 9px; border-radius:2px;
        }

        video { will-change:transform; }
      `}</style>

      <div style={{ position:"relative", height:"100dvh", width:"auto", overflow:"hidden" }}>

        {/* ══ VIDEO FRAME ══ */}
        <div id="video-frame" style={{
          position:"relative", zIndex:10,
          height:"100dvh", width:"100vw",
          overflow:"hidden", background:"var(--black)",
        }}>

          {/* BG video */}
          <video ref={bgVdRef} src={getVideo(currentIndex)}
            autoPlay loop muted playsInline
            style={{
              position:"absolute", inset:0, zIndex:1,
              width:"100%", height:"100%", objectFit:"cover",
              filter:"saturate(.65) contrast(1.1) brightness(.52)",
            }}
          />

          {/* Expanding transition video */}
          <video ref={nextVdRef} src={getVideo(currentIndex)}
            loop muted playsInline
            style={{
              position:"absolute", top:"50%", left:"50%",
              zIndex:22, visibility:"hidden",
              width:240, height:240, objectFit:"cover",
              transform:"translate(-50%,-50%)",
              filter:"saturate(.82) contrast(1.06)",
            }}
          />

          {/* Grain */}
          <div className="d-grain" />

          {/* Gradient backdrop */}
          <div className="d-backdrop" />

          {/* Red vignette */}
          <div style={{
            position:"absolute", inset:0, zIndex:30, pointerEvents:"none",
            boxShadow:"inset 0 0 120px rgba(200,55,45,.05), inset 0 0 0 1px rgba(200,55,45,.08)",
          }} />

          {/* Corners */}
          <div className="d-corner dc-tl" />
          <div className="d-corner dc-tr" />

          {/* HUD */}
          <div className="d-hud" style={{ top:22, left:64, display:"flex", gap:14, alignItems:"center" }}>
            <span className="d-rec">● REC</span>
            <span>4K / 24fps</span>
          </div>
          <div className="d-hud" style={{ top:22, right:64 }}>Detroit Studio — Paris</div>

          {/* Ghost inside */}
          <h1 className="d-ghost" style={{ position:"absolute", bottom:16, right:16, zIndex:40 }}>
            DETROIT
          </h1>

          {/* ══ LEFT COLUMN ══ */}
          <div className="hero-col-left">

            {/* Eyebrow — absolute top */}
            <div className="hero-eyebrow-row hero-text-item">
              <div className="d-eyebrow">{slide.eyebrow}</div>
            </div>

            {/* Heading */}
            <div className="hero-heading">
              <span className="d-h1 hero-text-item">{slide.line1}</span>
              <span className="d-h1 hero-text-item">{slide.line2}</span>
              <span className="d-h1-accent hero-text-item">{slide.accent}</span>
            </div>

            {/* Body */}
            <div className="hero-body">
              <p className="d-sub hero-text-item">{slide.sub}</p>
              <div className="hero-text-item">
                <Button id="hero-cta" title={slide.cta} />
              </div>
            </div>

            {/* Bottom bar — dots + counter */}
            <div className="hero-bar hero-text-item">
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                {slides.map((_, i) => (
                  <div key={i} className={`d-dot${i === currentIndex % slides.length ? " active" : ""}`} />
                ))}
              </div>
              <span style={{
                fontFamily:"'DM Sans',sans-serif", fontSize:8,
                letterSpacing:".28em", textTransform:"uppercase",
                color:"rgba(242,237,230,.2)",
              }}>
                {String(currentIndex + 1).padStart(2,"0")} / {String(VIDEOS.length).padStart(2,"0")}
              </span>
            </div>

          </div>

          {/* ══ RIGHT PREVIEW ZONE ══ */}
          <div
            className="preview-zone"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            onClick={handleMiniClick}
          >
            {/* vertical hint text */}
            <div className="preview-hint" ref={miniHintRef}>
              Hover to preview
            </div>

            {/* Preview card — GSAP controls visibility */}
            <div className="preview-card" ref={miniCardRef}>
              <VideoPreview>
                <div className="preview-card-inner">
                  <video ref={miniVdRef} src={getVideo(nextIndex)}
                    autoPlay loop muted playsInline
                  />
                  <div className="preview-tint" />
                  <div className="preview-badge">Next</div>
                  <div className="preview-card-border" />
                  <div className="preview-card-foot">
                    <span>Click to play</span>
                    <span>{nextIndex + 1} / {VIDEOS.length}</span>
                  </div>
                </div>
              </VideoPreview>
            </div>
          </div>

        </div>

        {/* Ghost outside */}
        <h1 className="d-ghost d-ghost-dark" style={{ position:"absolute", bottom:16, right:16 }}>
          DETROIT
        </h1>

      </div>
    </>
  );
}