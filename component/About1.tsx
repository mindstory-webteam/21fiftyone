"use client";

import { useRef, useEffect, CSSProperties } from "react";
import type { ElementType } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

/* ════════════════════════════════════════════════════════
   TEXT ROLL  (hover animation — character by character)
════════════════════════════════════════════════════════ */
const ROLL_STAGGER = 0.035;

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
      style={{
        position: "relative",
        display: "inline-block",
        overflow: "hidden",
        cursor: "pointer",
        lineHeight: 0.88,
        verticalAlign: "top",
        userSelect: "none",
      }}
    >
      {/* visible row */}
      <span aria-hidden style={{ display: "block" }}>
        {chars.map((l, i) => (
          <motion.span
            key={i}
            variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
            transition={{ ease: "easeInOut", delay: getDelay(i, chars.length) }}
            style={{ display: "inline-block" }}
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </span>
      {/* hidden row — rolls up on hover */}
      <span aria-hidden style={{ display: "block", position: "absolute", inset: 0 }}>
        {chars.map((l, i) => (
          <motion.span
            key={i}
            variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
            transition={{ ease: "easeInOut", delay: getDelay(i, chars.length) }}
            style={{ display: "inline-block" }}
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );
};

/* ════════════════════════════════════════════════════════
   SPLIT TEXT TYPES
════════════════════════════════════════════════════════ */
type FromTo = {
  opacity?: number;
  y?: number;
  x?: number;
  scale?: number;
  rotation?: number;
  skewX?: number;
  [key: string]: number | undefined;
};

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines";
  from?: FromTo;
  to?: FromTo;
  threshold?: number;
  rootMargin?: string;
  textAlign?: CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean;
  tag?: ElementType;
  hoverRoll?: boolean;
  hoverRollDirection?: "left" | "right" | "center";
}

/* ════════════════════════════════════════════════════════
   HOVER ROLL SPLIT TEXT
════════════════════════════════════════════════════════ */
function HoverRollSplitText({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "left",
  onLetterAnimationComplete,
  showCallback = false,
  hoverRollDirection = "left",
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const unitRefs     = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef        = useRef<gsap.core.Timeline | null>(null);

  const units =
    splitType === "chars" ? text.split("") :
    splitType === "words" ? text.split(" ") :
    text.split("\n");

  useEffect(() => {
    const container = containerRef.current;
    const targets   = unitRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!container || !targets.length) return;

    gsap.set(targets, { ...from });

    tlRef.current = gsap.timeline({
      paused: true,
      onComplete: () => {
        if (showCallback && onLetterAnimationComplete) onLetterAnimationComplete();
      },
    });
    tlRef.current.to(targets, { ...to, duration, ease, stagger: delay / 1000 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tlRef.current?.play();
            observer.unobserve(container);
          }
        });
      },
      { threshold, rootMargin }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      tlRef.current?.kill();
    };
  }, [text, delay, duration, ease, splitType, threshold, rootMargin, showCallback]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        textAlign,
        lineHeight: "inherit",
        display: "flex",
        flexWrap: "wrap",
        gap: splitType === "chars" ? "0" : "0.2em",
      }}
      aria-label={text}
    >
      {units.map((unit, i) => {
        if (unit === " " && splitType === "chars") {
          return (
            <span
              key={i}
              ref={(el) => { unitRefs.current[i] = el; }}
              style={{ display: "inline-block" }}
            >
              &nbsp;
            </span>
          );
        }
        return (
          <span
            key={i}
            ref={(el) => { unitRefs.current[i] = el; }}
            style={{ display: "inline-block" }}
          >
            <TextRoll direction={hoverRollDirection}>{unit}</TextRoll>
          </span>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   STANDARD SPLIT TEXT  (no hover roll)
════════════════════════════════════════════════════════ */
function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "left",
  onLetterAnimationComplete,
  showCallback = false,
  tag: Tag = "div",
  hoverRoll = false,
  hoverRollDirection = "left",
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const tlRef        = useRef<gsap.core.Timeline | null>(null);

  if (hoverRoll) {
    return (
      <HoverRollSplitText
        text={text}
        className={className}
        delay={delay}
        duration={duration}
        ease={ease}
        splitType={splitType}
        from={from}
        to={to}
        threshold={threshold}
        rootMargin={rootMargin}
        textAlign={textAlign}
        onLetterAnimationComplete={onLetterAnimationComplete}
        showCallback={showCallback}
        hoverRollDirection={hoverRollDirection}
      />
    );
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const buildSpans = (): HTMLElement[] => {
      container.innerHTML = "";

      if (splitType === "chars") {
        const spans: HTMLElement[] = [];
        text.split(" ").forEach((word, wi, arr) => {
          const wordEl = document.createElement("span");
          wordEl.style.display = "inline-block";
          wordEl.style.whiteSpace = "nowrap";
          word.split("").forEach((char) => {
            const charEl = document.createElement("span");
            charEl.textContent = char;
            charEl.style.display = "inline-block";
            charEl.style.willChange = "transform, opacity";
            wordEl.appendChild(charEl);
            spans.push(charEl);
          });
          container.appendChild(wordEl);
          if (wi < arr.length - 1) {
            const sp = document.createElement("span");
            sp.innerHTML = "&nbsp;";
            sp.style.display = "inline-block";
            container.appendChild(sp);
          }
        });
        return spans;
      }

      if (splitType === "words") {
        return text.split(" ").map((word, wi, arr) => {
          const el = document.createElement("span");
          el.textContent = word + (wi < arr.length - 1 ? "\u00A0" : "");
          el.style.display = "inline-block";
          el.style.willChange = "transform, opacity";
          container.appendChild(el);
          return el;
        });
      }

      return text.split("\n").map((line) => {
        const el = document.createElement("span");
        el.textContent = line;
        el.style.display = "block";
        el.style.willChange = "transform, opacity";
        container.appendChild(el);
        return el;
      });
    };

    const targets = buildSpans();
    if (!targets.length) return;

    gsap.set(targets, { ...from });
    tlRef.current = gsap.timeline({
      paused: true,
      onComplete: () => {
        if (showCallback && onLetterAnimationComplete) onLetterAnimationComplete();
      },
    });
    tlRef.current.to(targets, { ...to, duration, ease, stagger: delay / 1000 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tlRef.current?.play();
            observer.unobserve(container);
          }
        });
      },
      { threshold, rootMargin }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      tlRef.current?.kill();
      if (container) container.innerHTML = text;
    };
  }, [text, delay, duration, ease, splitType, threshold, rootMargin, showCallback]);

  return (
    <Tag
      ref={containerRef as React.Ref<never>}
      className={className}
      style={{ textAlign, lineHeight: "inherit" }}
      aria-label={text}
    />
  );
}

/* ════════════════════════════════════════════════════════
   GLOBAL STYLES
   NOTE: All CSS lives here. No <style> tags in JSX.
         GSAP animation code lives only in useGSAP().
════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ab-cream: #f2ede6;
    --ab-black: #0c0c0c;
    --ab-red:   #c8372d;
    --ab-muted: #8a8480;
    --ab-line:  rgba(12,12,12,0.12);
  }

  #about {
    background: var(--ab-cream);
    font-family: 'DM Sans', sans-serif;
    
  }

  /* label row */
  .ab-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 24px;
    border-bottom: 1px solid var(--ab-line);
    margin-bottom: 48px;
    margin-top:100px;
    
    opacity: 0;
    transform: translateY(16px);
    animation: abFadeUp 0.8s 0.1s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .ab-label-l {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--ab-red);
  }
  .ab-label-r {
    font-size: 10px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--ab-muted);
  }

  /* SplitText headline styles */
  .ab-headline {
    font-family: 'Anton', sans-serif !important;
    font-size: clamp(80px, 11vw, 158px) !important;
    line-height: 0.88 !important;
    letter-spacing: -0.02em !important;
    color: var(--ab-black) !important;
    text-transform: uppercase;
    display: block;
    overflow: visible;
    justify-content: center;
  }
  .ab-headline-accent {
    font-family: 'Playfair Display', serif !important;
    font-style: italic !important;
    font-size: clamp(60px, 8vw, 116px) !important;
    color: var(--ab-red) !important;
    line-height: 1 !important;
    letter-spacing: -0.01em !important;
    display: block;
    margin-top: 8px;
    overflow: visible;
    justify-content: center;
  }

  /* sub copy */
  .ab-sub-wrap {
    opacity: 0;
    transform: translateY(20px);
    animation: abFadeUp 0.9s 0.55s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .ab-sub-main {
    font-size: clamp(16px, 1.6vw, 20px);
    font-weight: 500;
    color: var(--ab-black);
    line-height: 1.5;
    margin-bottom: 10px;
  }
  .ab-sub-side {
    font-size: 14px;
    font-weight: 300;
    color: var(--ab-muted);
    line-height: 1.85;
    max-width: 520px;
    margin: 0 auto;
  }

  /* ── Clip section: flex-center so the card sits in the middle ── */
  #clip {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /*
   * ── LARGE rounded card, centered with CSS transform.
   * Increased from 520×360 to 780×520 (bigger video).
   * GSAP only animates width / height / borderRadius / boxShadow.
   */
  .mask-clip-path {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 780px;
    height: 520px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 24px 64px rgba(12,12,12,0.28), 0 4px 16px rgba(12,12,12,0.14);
    will-change: width, height, border-radius;
  }

  /* stone video — fills the card/fullscreen */
  .stone-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 50;
    pointer-events: none;
  }

  /* scroll overlay */
  .ab-scroll-overlay {
    position: absolute;
    bottom: 48px; left: 52px; right: 52px;
    z-index: 60;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
  .ab-overlay-big {
    font-family: 'Anton', sans-serif;
    font-size: clamp(48px, 6vw, 84px);
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: var(--ab-cream);
    line-height: 0.9;
    text-shadow: 0 2px 32px rgba(0,0,0,0.55);
  }
  .ab-overlay-accent {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: clamp(17px, 2vw, 26px);
    color: rgba(242,237,230,0.72);
    line-height: 1.45;
    text-align: right;
    max-width: 260px;
    text-shadow: 0 2px 16px rgba(0,0,0,0.4);
  }

  /* marquee */
  .ab-marquee-wrap {
    width: 100%; background: var(--ab-black);
    overflow: hidden; padding: 22px 0;
    border-top: 1px solid rgba(255,255,255,0.07);
  }
  .ab-marquee-track {
    display: flex; width: max-content;
    animation: abMarquee 24s linear infinite;
  }
  .ab-marquee-track:hover { animation-play-state: paused; }
  .ab-marquee-item {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.32em; text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    padding: 0 32px; white-space: nowrap;
    transition: color 0.2s; cursor: default;
  }
  .ab-marquee-item:hover { color: var(--ab-red); }
  .ab-marquee-item.ab-dot {
    color: var(--ab-red); font-size: 9px;
    padding: 0 12px; letter-spacing: 0;
  }

  /* keyframes */
  @keyframes abFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes abMarquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* responsive */
  @media (max-width: 900px) {
    .ab-scroll-overlay { bottom: 28px; left: 28px; right: 28px; }
    .mask-clip-path { width: 560px; height: 380px; }
  }
  @media (max-width: 600px) {
    .ab-overlay-accent { display: none; }
    .mask-clip-path { width: 340px; height: 230px; }
  }
`;

/* ════════════════════════════════════════════════════════
   MARQUEE DATA
════════════════════════════════════════════════════════ */
const MARQUEE_RAW = [
  "Play Economy", "✦", "Shared Adventure", "✦",
  "Every World",  "✦", "Epic Quests",      "✦",
  "United Players","✦","Infinite Realms",  "✦",
  "Your Life MMORPG","✦","Level Up",        "✦",
];

/* ════════════════════════════════════════════════════════
   ABOUT COMPONENT
════════════════════════════════════════════════════════ */
const About1 = () => {
  /* inject styles once — NO <style> tags in JSX */
  useEffect(() => {
    const id = "ab-global-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = STYLES;
      document.head.appendChild(el);
    }
  }, []);

  /* ── GSAP scroll — all animation code lives here, nowhere else ── */
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation
      /*
       * ① Expand the large card to fullscreen.
       *    fromTo so GSAP knows the exact start state.
       *    CSS translate(-50%,-50%) keeps it centered automatically.
       */
      .fromTo(
        ".mask-clip-path",
        {
          width: "780px",
          height: "520px",
          borderRadius: "16px",
          boxShadow: "0 24px 64px rgba(12,12,12,0.28), 0 4px 16px rgba(12,12,12,0.14)",
        },
        {
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
          boxShadow: "none",
          ease: "power2.out",
        }
      )
      // ② Scale stone video in sync with expanding clip
      .fromTo(
        ".stone-video",
        { scale: 1.6, opacity: 0.85 },
        { scale: 1,   opacity: 1,    ease: "power2.out" },
        "<"
      )
      // ③ Fade in overlay text
      .fromTo(
        ".scroll-text",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.5"
      );
  });

  const doubled = [...MARQUEE_RAW, ...MARQUEE_RAW];

  return (
    <div id="about" className="min-h-screen w-screen ">

      {/* ── Top text block ── */}
      <div className="relative mb-8 mt-86 flex flex-col items-center gap-5 px-4">

        {/* Label row */}
        <div className="ab-label-row w-full max-w-5xl">
          <span className="ab-label-l">Welcome to Zentry</span>
          <span className="ab-label-r">Est. 2024 — Metagame Layer</span>
        </div>

        {/* ── SplitText hero ── */}
        <div style={{ width: "100%", maxWidth: "1100px" }}>

          <SplitText
            text="Discover World's"
            tag="div"
            className="ab-headline"
            delay={40}
            duration={1.25}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 60 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-60px"
            textAlign="center"
            hoverRoll
            hoverRollDirection="center"
          />

          <SplitText
            text="Shared Adventure"
            tag="div"
            className="ab-headline-accent"
            delay={80}
            duration={1.4}
            ease="power4.out"
            splitType="words"
            from={{ opacity: 0, y: 80, skewX: 8 }}
            to={{ opacity: 1, y: 0, skewX: 0 }}
            threshold={0.1}
            rootMargin="-60px"
            textAlign="center"
            hoverRoll
            hoverRollDirection="left"
          />
        </div>

        {/* Sub copy */}
        <div className="ab-sub-wrap text-center">
          <p className="ab-sub-main">
            The Game of Games begins — your life, now an epic MMORPG
          </p>
          <p className="ab-sub-side">
            Zentry unites every player from countless games and platforms, both
            digital and physical, into a unified Play Economy
          </p>
        </div>
      </div>

      {/* ── Scroll clip section ── */}
      <div
        className="h-dvh w-screen"
        id="clip"
      >
        {/*
          .mask-clip-path starts as a large 780×520 rounded card.
          CSS keeps it centered via transform: translate(-50%, -50%).
          GSAP ScrollTrigger expands only width/height/borderRadius → fullscreen.
        */}
        <div className="mask-clip-path about-image">

          {/* ── Stone video (sole foreground layer) ── */}
          <video
            className="stone-video"
            src="/videos/video-1.webm"
            autoPlay
            loop
            muted
            playsInline
          />

          {/* Scroll-in overlay */}
          <div className="scroll-text ab-scroll-overlay">
            <div className="ab-overlay-big">
              World's<br />Largest
            </div>
            <div className="ab-overlay-accent">
              A unified Play Economy —<br />
              every game, every world,<br />
              every player.
            </div>
          </div>

        </div>
      </div>

      {/* ── Marquee ── */}
      <div className="ab-marquee-wrap">
        <div className="ab-marquee-track">
          {doubled.map((item, i) => (
            <span
              key={i}
              className={`ab-marquee-item${item === "✦" ? " ab-dot" : ""}`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};

export default About1;