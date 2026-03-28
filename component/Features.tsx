"use client";

import { useState, useRef, useEffect, CSSProperties } from "react";
import type { ElementType } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";

gsap.registerPlugin(ScrollTrigger);

/* ════════════════════════════════════════════════════════
   GLOBAL STYLES
════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --sv-cream: #f2ede6;
    --sv-white: #ffffff;
    --sv-black: #0c0c0c;
    --sv-red:   #c8372d;
    --sv-muted: #8a8480;
    --sv-line:  rgba(12,12,12,0.10);
    --sv-card-bg: #f7f3ee;
  }

  #services {
    background: var(--sv-white);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── section label row ── */
  .sv-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 20px;
    border-bottom: 1px solid var(--sv-line);
    margin-bottom: 52px;
    opacity: 0;
    transform: translateY(16px);
    animation: svFadeUp 0.8s 0.1s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .sv-label-l {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.32em; text-transform: uppercase;
    color: var(--sv-red);
  }
  .sv-label-r {
    font-size: 10px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--sv-muted);
  }

  /* ── heading block ── */
  .sv-heading-wrap {
    margin-bottom: 72px;
  }

  /* Line 1 — ultra-bold condensed uppercase */
  .sv-headline {
    font-family: 'Anton', sans-serif !important;
    font-size: clamp(64px, 10vw, 152px) !important;
    line-height: 0.86 !important;
    letter-spacing: -0.03em !important;
    color: var(--sv-black) !important;
    text-transform: uppercase;
    display: block;
    overflow: visible;
    justify-content: flex-start;
  }

  /* Line 2 — large red italic serif */
  .sv-headline-accent {
    font-family: 'Playfair Display', serif !important;
    font-style: italic !important;
    font-size: clamp(52px, 8vw, 128px) !important;
    color: var(--sv-red) !important;
    line-height: 1.0 !important;
    letter-spacing: -0.02em !important;
    font-weight: 400 !important;
    display: block;
    overflow: visible;
    justify-content: flex-start;
    margin-top: 4px;
  }

  /* ── sub copy ── */
  .sv-sub-wrap {
    opacity: 0;
    transform: translateY(18px);
    animation: svFadeUp 0.9s 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
    max-width: 480px;
    margin-top: 28px;
  }
  .sv-sub-main {
    font-size: clamp(15px, 1.4vw, 18px);
    font-weight: 500;
    color: var(--sv-black);
    line-height: 1.5;
    margin-bottom: 8px;
  }
  .sv-sub-side {
    font-size: 14px;
    font-weight: 300;
    color: var(--sv-muted);
    line-height: 1.9;
  }

  /* ── Bento grid ── */
  .sv-bento-large {
    position: relative;
    width: 100%;
    height: 60vh;
    min-height: 380px;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 20px;
    border: 1px solid var(--sv-line);
  }

  .sv-bento-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 20px;
  }

  .sv-bento-cell {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--sv-line);
    background: var(--sv-card-bg);
    min-height: 280px;
  }

  .sv-bento-cell.tall {
    grid-row: span 2;
    min-height: 580px;
  }

  .sv-bento-cell.accent {
    background: var(--sv-black);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 28px;
  }

  /* ── card inner ── */
  .sv-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 28px;
    z-index: 10;
  }

  .sv-card-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 0;
  }

  /* card gradient overlay */
  .sv-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(12,12,12,0.08) 0%,
      rgba(12,12,12,0.55) 100%
    );
    z-index: 1;
  }

  /* ── card title — Anton style ── */
  .sv-card-title {
    font-family: 'Anton', sans-serif;
    font-size: clamp(36px, 4vw, 64px);
    line-height: 0.9;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: #ffffff;
    position: relative;
    z-index: 2;
  }

  /* accent card title — Playfair italic */
  .sv-card-title-serif {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: clamp(28px, 3vw, 52px);
    line-height: 1.1;
    color: var(--sv-red);
    position: relative;
    z-index: 2;
  }

  .sv-card-desc {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 300;
    line-height: 1.75;
    color: rgba(255,255,255,0.72);
    max-width: 260px;
    position: relative;
    z-index: 2;
    margin-top: 10px;
  }

  .sv-card-desc-dark {
    color: var(--sv-muted);
  }

  /* ── coming soon pill ── */
  .sv-pill {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    overflow: hidden;
    border-radius: 9999px;
    background: rgba(12,12,12,0.75);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 8px 18px;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    cursor: pointer;
    align-self: flex-start;
    z-index: 20;
    backdrop-filter: blur(6px);
  }

  .sv-pill-light {
    background: rgba(12,12,12,0.06);
    border: 1px solid var(--sv-line);
    color: var(--sv-muted);
  }

  /* ── accent card (dark bg) ── */
  .sv-accent-title {
    font-family: 'Anton', sans-serif;
    font-size: clamp(32px, 3.5vw, 56px);
    line-height: 0.9;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: var(--sv-cream);
    max-width: 260px;
  }

  /* ── number badge ── */
  .sv-num {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 11px;
    letter-spacing: 0.12em;
    color: var(--sv-red);
    margin-bottom: 12px;
    display: block;
  }

  /* ── keyframes ── */
  @keyframes svFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── responsive ── */
  @media (max-width: 768px) {
    .sv-bento-grid {
      grid-template-columns: 1fr;
    }
    .sv-bento-cell.tall {
      grid-row: span 1;
      min-height: 320px;
    }
    .sv-bento-large {
      height: 50vw;
      min-height: 260px;
    }
  }
`;

/* ════════════════════════════════════════════════════════
   TEXT ROLL
════════════════════════════════════════════════════════ */
const ROLL_STAGGER = 0.032;

interface TextRollProps {
  children: string;
  direction?: "left" | "right" | "center";
}

const TextRoll = ({ children, direction = "left" }: TextRollProps) => {
  const chars = children.split("");
  const getDelay = (i: number, total: number) => {
    if (direction === "center") return ROLL_STAGGER * Math.abs(i - (total - 1) / 2);
    if (direction === "right")  return ROLL_STAGGER * (total - 1 - i);
    return ROLL_STAGGER * i;
  };
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      style={{ position: "relative", display: "inline-block", overflow: "hidden",
               cursor: "pointer", lineHeight: 0.88, verticalAlign: "top", userSelect: "none" }}
    >
      <span aria-hidden style={{ display: "block" }}>
        {chars.map((l, i) => (
          <motion.span key={i}
            variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
            transition={{ ease: "easeInOut", delay: getDelay(i, chars.length) }}
            style={{ display: "inline-block" }}
          >{l === " " ? "\u00A0" : l}</motion.span>
        ))}
      </span>
      <span aria-hidden style={{ display: "block", position: "absolute", inset: 0 }}>
        {chars.map((l, i) => (
          <motion.span key={i}
            variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
            transition={{ ease: "easeInOut", delay: getDelay(i, chars.length) }}
            style={{ display: "inline-block" }}
          >{l === " " ? "\u00A0" : l}</motion.span>
        ))}
      </span>
    </motion.span>
  );
};

/* ════════════════════════════════════════════════════════
   SPLIT TEXT
════════════════════════════════════════════════════════ */
type FromTo = {
  opacity?: number; y?: number; x?: number;
  scale?: number; rotation?: number; skewX?: number;
  [key: string]: number | undefined;
};

interface SplitTextProps {
  text: string; className?: string; delay?: number; duration?: number;
  ease?: string; splitType?: "chars" | "words" | "lines";
  from?: FromTo; to?: FromTo; threshold?: number; rootMargin?: string;
  textAlign?: CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void; showCallback?: boolean;
  tag?: ElementType; hoverRoll?: boolean;
  hoverRollDirection?: "left" | "right" | "center";
}

function HoverRollSplitText({
  text, className = "", delay = 50, duration = 1.25, ease = "power3.out",
  splitType = "chars", from = { opacity: 0, y: 40 }, to = { opacity: 1, y: 0 },
  threshold = 0.1, rootMargin = "-100px", textAlign = "left",
  onLetterAnimationComplete, showCallback = false, hoverRollDirection = "left",
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const unitRefs     = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef        = useRef<gsap.core.Timeline | null>(null);

  const units =
    splitType === "chars" ? text.split("") :
    splitType === "words" ? text.split(" ") : text.split("\n");

  useEffect(() => {
    const container = containerRef.current;
    const targets   = unitRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!container || !targets.length) return;
    gsap.set(targets, { ...from });
    tlRef.current = gsap.timeline({ paused: true,
      onComplete: () => { if (showCallback && onLetterAnimationComplete) onLetterAnimationComplete(); }
    });
    tlRef.current.to(targets, { ...to, duration, ease, stagger: delay / 1000 });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { tlRef.current?.play(); observer.unobserve(container); } });
    }, { threshold, rootMargin });
    observer.observe(container);
    return () => { observer.disconnect(); tlRef.current?.kill(); };
  }, [text, delay, duration, ease, splitType, threshold, rootMargin, showCallback]);

  return (
    <div ref={containerRef} className={className}
      style={{ textAlign, lineHeight: "inherit", display: "flex", flexWrap: "wrap",
               gap: splitType === "chars" ? "0" : "0.2em" }}
      aria-label={text}
    >
      {units.map((unit, i) => {
        if (unit === " " && splitType === "chars") return (
          <span key={i} ref={(el) => { unitRefs.current[i] = el; }} style={{ display: "inline-block" }}>&nbsp;</span>
        );
        return (
          <span key={i} ref={(el) => { unitRefs.current[i] = el; }} style={{ display: "inline-block" }}>
            <TextRoll direction={hoverRollDirection}>{unit}</TextRoll>
          </span>
        );
      })}
    </div>
  );
}

function SplitText({
  text, className = "", delay = 50, duration = 1.25, ease = "power3.out",
  splitType = "chars", from = { opacity: 0, y: 40 }, to = { opacity: 1, y: 0 },
  threshold = 0.1, rootMargin = "-100px", textAlign = "left",
  onLetterAnimationComplete, showCallback = false, tag: Tag = "div",
  hoverRoll = false, hoverRollDirection = "left",
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const tlRef        = useRef<gsap.core.Timeline | null>(null);

  if (hoverRoll) return (
    <HoverRollSplitText text={text} className={className} delay={delay} duration={duration}
      ease={ease} splitType={splitType} from={from} to={to} threshold={threshold}
      rootMargin={rootMargin} textAlign={textAlign}
      onLetterAnimationComplete={onLetterAnimationComplete} showCallback={showCallback}
      hoverRollDirection={hoverRollDirection} />
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const buildSpans = (): HTMLElement[] => {
      container.innerHTML = "";
      if (splitType === "chars") {
        const spans: HTMLElement[] = [];
        text.split(" ").forEach((word, wi, arr) => {
          const wordEl = document.createElement("span");
          wordEl.style.display = "inline-block"; wordEl.style.whiteSpace = "nowrap";
          word.split("").forEach((char) => {
            const charEl = document.createElement("span");
            charEl.textContent = char; charEl.style.display = "inline-block";
            charEl.style.willChange = "transform, opacity";
            wordEl.appendChild(charEl); spans.push(charEl);
          });
          container.appendChild(wordEl);
          if (wi < arr.length - 1) {
            const sp = document.createElement("span");
            sp.innerHTML = "&nbsp;"; sp.style.display = "inline-block";
            container.appendChild(sp);
          }
        });
        return spans;
      }
      if (splitType === "words") {
        return text.split(" ").map((word, wi, arr) => {
          const el = document.createElement("span");
          el.textContent = word + (wi < arr.length - 1 ? "\u00A0" : "");
          el.style.display = "inline-block"; el.style.willChange = "transform, opacity";
          container.appendChild(el); return el;
        });
      }
      return text.split("\n").map((line) => {
        const el = document.createElement("span");
        el.textContent = line; el.style.display = "block";
        el.style.willChange = "transform, opacity";
        container.appendChild(el); return el;
      });
    };
    const targets = buildSpans();
    if (!targets.length) return;
    gsap.set(targets, { ...from });
    tlRef.current = gsap.timeline({ paused: true,
      onComplete: () => { if (showCallback && onLetterAnimationComplete) onLetterAnimationComplete(); }
    });
    tlRef.current.to(targets, { ...to, duration, ease, stagger: delay / 1000 });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { tlRef.current?.play(); observer.unobserve(container); } });
    }, { threshold, rootMargin });
    observer.observe(container);
    return () => {
      observer.disconnect(); tlRef.current?.kill();
      if (container) container.innerHTML = text;
    };
  }, [text, delay, duration, ease, splitType, threshold, rootMargin, showCallback]);

  return <Tag ref={containerRef as React.Ref<never>} className={className}
    style={{ textAlign, lineHeight: "inherit" }} aria-label={text} />;
}

/* ════════════════════════════════════════════════════════
   BENTO TILT
════════════════════════════════════════════════════════ */
const BentoTilt = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current) return;
    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
    const relX = (e.clientX - left) / width;
    const relY = (e.clientY - top)  / height;
    const tiltX = (relY - 0.5) * 6;
    const tiltY = (relX - 0.5) * -6;
    setTransformStyle(`perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.97,0.97,0.97)`);
  };

  return (
    <div ref={itemRef} className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTransformStyle("")}
      style={{ transform: transformStyle, transition: transformStyle ? "none" : "transform 0.6s cubic-bezier(0.23,1,0.32,1)" }}
    >
      {children}
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   HOVER CURSOR PILL
════════════════════════════════════════════════════════ */
const ComingSoonPill = ({ light = false }: { light?: boolean }) => {
  const [cursorPos, setCursorPos]   = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setCursorPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseEnter={() => setHoverOpacity(1)}
      onMouseLeave={() => setHoverOpacity(0)}
      className={`sv-pill${light ? " sv-pill-light" : ""}`}
    >
      <div className="pointer-events-none absolute -inset-px transition duration-300"
        style={{
          opacity: hoverOpacity,
          background: `radial-gradient(80px circle at ${cursorPos.x}px ${cursorPos.y}px, ${light ? "#c8372d33" : "#656fe266"}, transparent)`,
        }}
      />
      <TiLocationArrow className="relative z-20" style={{ fontSize: 14 }} />
      <span className="relative z-20" style={{ fontSize: 10, letterSpacing: "0.18em" }}>Coming Soon</span>
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   SERVICES DATA
════════════════════════════════════════════════════════ */
const SERVICES = [
  {
    id: "01",
    src: "/videos/video-1.webm",
    title: "Brand Strategy",
    titleAccent: "& Identity",
    desc: "We craft brand narratives that resonate — from naming and positioning to full visual identity systems built to last.",
    isComingSoon: true,
    large: true,
  },
  {
    id: "02",
    src: "/videos/video-2.webm",
    title: "Digital Design",
    desc: "Websites, apps, and interfaces where every pixel earns its place. Interaction-first design that converts.",
    isComingSoon: true,
    tall: true,
  },
  {
    id: "03",
    src: "/videos/video-3.webm",
    title: "Motion & Film",
    desc: "Cinematic storytelling for campaigns, product launches, and brand films that move people.",
    isComingSoon: true,
  },
  {
    id: "04",
    src: "/videos/video-1.webm",
    title: "3D & Spatial",
    desc: "Immersive 3D experiences, AR activations, and spatial design for the next generation of platforms.",
    isComingSoon: false,
  },
];

/* ════════════════════════════════════════════════════════
   SERVICES / FEATURES COMPONENT
════════════════════════════════════════════════════════ */
const Features = () => {

  /* inject styles */
  useEffect(() => {
    const id = "sv-global-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id; el.textContent = STYLES;
      document.head.appendChild(el);
    }
  }, []);

  const [large, ...rest] = SERVICES;
  const gridCards = rest; // 4 cards in 2×2 grid

  return (
    <section id="services" className="min-h-screen w-screen">
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 40px 120px" }}>

        {/* ── Label row ── */}
        <div className="sv-label-row">
          <span className="sv-label-l">What We Do</span>
          <span className="sv-label-r">Services — 2024</span>
        </div>

        {/* ── Heading block ── */}
        <div className="sv-heading-wrap">
          <div style={{ maxWidth: 900 }}>

            {/* Line 1 — "OUR CORE" — Anton bold uppercase */}
            <SplitText
              text="Our Core"
              tag="div"
              className="sv-headline"
              delay={30}
              duration={1.1}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 70 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-40px"
              textAlign="left"
              hoverRoll
              hoverRollDirection="left"
            />

            {/* Line 2 — "Services" — Playfair italic red */}
            <SplitText
              text="Services"
              tag="div"
              className="sv-headline-accent"
              delay={55}
              duration={1.35}
              ease="power4.out"
              splitType="words"
              from={{ opacity: 0, y: 60, skewX: 6 }}
              to={{ opacity: 1, y: 0, skewX: 0 }}
              threshold={0.1}
              rootMargin="-40px"
              textAlign="left"
              hoverRoll
              hoverRollDirection="left"
            />
          </div>

          {/* Sub copy */}
          <div className="sv-sub-wrap">
            <p className="sv-sub-main">
              End-to-end creative production for brands that want to be remembered.
            </p>
            <p className="sv-sub-side">
              From strategy to final pixel — we partner with ambitious teams to
              build work that stands apart in a world full of noise.
            </p>
          </div>
        </div>

        {/* ── Large hero card ── */}
        <BentoTilt className="sv-bento-large">
          <video src={large.src} loop muted autoPlay
            className="sv-card-video" />
          <div className="sv-card-overlay" />
          <div className="sv-card-inner">
            <div>
              <span className="sv-num">{large.id} /</span>
              <h2 className="sv-card-title">{large.title}</h2>
              <h3 className="sv-card-title-serif" style={{ marginTop: 4 }}>{large.titleAccent}</h3>
              <p className="sv-card-desc">{large.desc}</p>
            </div>
            <ComingSoonPill />
          </div>
        </BentoTilt>

        {/* ── 2×2 bento grid ── */}
        <div className="sv-bento-grid">

          {/* Card 2 — tall left */}
          <BentoTilt className="sv-bento-cell tall">
            <video src={gridCards[0].src} loop muted autoPlay className="sv-card-video" />
            <div className="sv-card-overlay" />
            <div className="sv-card-inner">
              <div>
                <span className="sv-num">{gridCards[0].id} /</span>
                <h2 className="sv-card-title">{gridCards[0].title}</h2>
                <p className="sv-card-desc">{gridCards[0].desc}</p>
              </div>
              <ComingSoonPill />
            </div>
          </BentoTilt>

          {/* Card 3 — top right */}
          <BentoTilt className="sv-bento-cell">
            <video src={gridCards[1].src} loop muted autoPlay className="sv-card-video" />
            <div className="sv-card-overlay" />
            <div className="sv-card-inner">
              <div>
                <span className="sv-num">{gridCards[1].id} /</span>
                <h2 className="sv-card-title">{gridCards[1].title}</h2>
                <p className="sv-card-desc">{gridCards[1].desc}</p>
              </div>
              <ComingSoonPill />
            </div>
          </BentoTilt>

          {/* Card 4 — bottom right with video */}
          <BentoTilt className="sv-bento-cell">
            <video src={gridCards[2].src} loop muted autoPlay className="sv-card-video" />
            <div className="sv-card-overlay" />
            <div className="sv-card-inner">
              <div>
                <span className="sv-num">{gridCards[2].id} /</span>
                <h2 className="sv-card-title">{gridCards[2].title}</h2>
                <p className="sv-card-desc">{gridCards[2].desc}</p>
              </div>
            </div>
          </BentoTilt>

          {/* Accent card — dark bg, "More coming" */}
          <BentoTilt className="sv-bento-cell accent">
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
              <h2 className="sv-accent-title">
                Mo<b>r</b>e<br />Comin<b>g</b><br />So<b>o</b>n.
              </h2>
              <TiLocationArrow style={{ fontSize: 56, color: "var(--sv-red)", alignSelf: "flex-end" }} />
            </div>
          </BentoTilt>

        </div>

      </div>
    </section>
  );
};

export default Features;