"use client";

import { useEffect, useRef, useState, useCallback, CSSProperties } from "react";
import type { ElementType } from "react";
import { motion } from "framer-motion";
import React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";



gsap.registerPlugin(ScrollTrigger);

/* ─── Design tokens ─── */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const TOKENS = `
  :root {
    --cream: #f2ede6;
    --black: #0c0c0c;
    --red:   #c8372d;
    --muted: #8a8480;
    --line:  rgba(12,12,12,0.12);
  }
`;

/* ─── Data ─── */
const SLIDES = [
  {
    number: "01", title: "Quiet Peaks", subtitle: "Alpine Serenity",
    body: "Breathe in the stillness of the summit. Our retreats are designed around the natural rhythm of altitude — where the air is pure and the silence is loud.",
    bg: "#0c0c0c", color: "#f2ede6",
  },
  {
    number: "02", title: "Pure Energy", subtitle: "Renewable Horizons",
    body: "Every experience is powered by the mountain itself. Wind, water and light converge into a force that refreshes both body and mind.",
    bg: "#1a1210", color: "#f2ede6",
  },
  {
    number: "03", title: "Alpine Snow", subtitle: "Crystalline Clarity",
    body: "Clean as the first snowfall. Unspoiled terrain and unfiltered skies create a canvas that reminds you why the earth is worth protecting.",
    bg: "#f2ede6", color: "#0c0c0c",
  },
  {
    number: "04", title: "Wild Terrain", subtitle: "Raw & Untamed",
    body: "Beyond the marked trails lives a world that demands respect. For those who seek the edges — the reward is a view nobody else has earned.",
    bg: "#2a1f1a", color: "#f2ede6",
  },
];

const MARQUEE_ITEMS = [
  "Mountain Calm","✦","Pure Air","✦","Endlessly Renewable","✦",
  "Alpine Energy","✦","Nature Leads","✦","Wild & Free","✦",
  "Summit Reached","✦","Clean Living","✦",
];

/* ═══════════════════════════════════════════════════════════
   TEXT ROLL
═══════════════════════════════════════════════════════════ */

const ROLL_STAGGER = 0.035;

interface TextRollProps {
  children: string;
  className?: string;
  direction?: "left" | "right" | "center";
}

const TextRoll: React.FC<TextRollProps> = ({ children, className, direction = "left" }) => {
  const chars = children.split("");
  const getDelay = (i: number, total: number) => {
    if (direction === "center") return ROLL_STAGGER * Math.abs(i - (total - 1) / 2);
    if (direction === "right") return ROLL_STAGGER * (total - 1 - i);
    return ROLL_STAGGER * i;
  };

  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={`relative inline-block overflow-hidden cursor-pointer select-none ${className ?? ""}`}
      style={{ lineHeight: 0.88, verticalAlign: "top" }}
    >
      <span aria-hidden style={{ display: "block" }}>
        {chars.map((l, i) => (
          <motion.span
            key={i}
            variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
            transition={{ ease: "easeInOut", delay: getDelay(i, chars.length) }}
            className="inline-block"
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </span>
      <span aria-hidden style={{ display: "block", position: "absolute", inset: 0 }}>
        {chars.map((l, i) => (
          <motion.span
            key={i}
            variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
            transition={{ ease: "easeInOut", delay: getDelay(i, chars.length) }}
            className="inline-block"
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );
};

/* ═══════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════
   HOVER ROLL SPLIT TEXT (internal)
═══════════════════════════════════════════════════════════ */

interface HoverRollProps extends Omit<SplitTextProps, "hoverRoll"> {
  hoverRollDirection?: "left" | "right" | "center";
}

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
}: HoverRollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const unitRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const units: string[] =
    splitType === "chars"
      ? text.split("")
      : splitType === "words"
      ? text.split(" ")
      : text.split("\n");

  useEffect(() => {
    const container = containerRef.current;
    const targets = unitRefs.current.filter(Boolean) as HTMLSpanElement[];
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
        gap: splitType === "chars" ? "0" : "0.25em",
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

/* ═══════════════════════════════════════════════════════════
   SPLIT TEXT (standard mode — no hoverRoll)
═══════════════════════════════════════════════════════════ */

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
  const tlRef = useRef<gsap.core.Timeline | null>(null);

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
        tag={Tag}
        hoverRollDirection={hoverRollDirection}
      />
    );
  }

  // standard innerHTML splitting
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const buildSpans = (): HTMLElement[] => {
      container.innerHTML = "";

      if (splitType === "chars") {
        const words = text.split(" ");
        const spans: HTMLElement[] = [];
        words.forEach((word, wi) => {
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
          if (wi < words.length - 1) {
            const space = document.createElement("span");
            space.innerHTML = "&nbsp;";
            space.style.display = "inline-block";
            container.appendChild(space);
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

/* ═══════════════════════════════════════════════════════════
   BENEFIT SECTION
═══════════════════════════════════════════════════════════ */

export default function BenefitSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [current, setCurrent]     = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 600);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    autoRef.current = setInterval(next, 4000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [next]);

  /* Scroll reveal for non-SplitText elements */
  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add("revealed");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const slide = SLIDES[current];

  return (
    <>
      <style>{`
        ${FONTS}
        ${TOKENS}

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .bs-root {
          width: 100%;
          background: var(--cream);
          overflow-x: clip;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          text-align: justify;
        }
        .bs-root::before {
          content: '';
          position: absolute;
          top: 0; left: 64px; right: 64px;
          height: 1px;
          background: var(--line);
        }
        .bs-section { padding: 120px 0 0; position: relative; }

        /* Label row */
        .bs-label-row {
          max-width: 1280px; margin: 0 auto; padding: 0 64px;
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 56px;
        }
        .bs-label-l { font-size: 10px; font-weight: 500; letter-spacing: .3em; text-transform: uppercase; color: var(--red); }
        .bs-label-r { font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: var(--muted); }

        /* Header */
        .bs-header {
          max-width: 1280px; margin: 0 auto; padding: 0 64px 80px;
        //   display: grid; grid-template-columns: 1fr 480px; gap: 40px; align-items: end;
        }

        /*
          Headline wrappers — SplitText renders inside these.
          We keep the same visual style as before.
        */
        .bs-headline-wrap {
          font-family: 'Anton', sans-serif;
          font-size: clamp(88px, 11vw, 158px);
          line-height: .88;
          letter-spacing: -.02em;
          color: var(--black);
          text-transform: uppercase;
          display: block;
          overflow: hidden;
        }
        .bs-headline-accent-wrap {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(64px, 8vw, 116px);
          color: var(--red);
          line-height: 1;
          letter-spacing: -.01em;
          display: block;
          margin-top: 8px;
          overflow: hidden;
        }

        /* Carousel */
        .bs-carousel {
          max-width: 1280px; margin: 0 auto; padding: 0 64px 100px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 4px;
        }
        .bs-slide-panel {
          position: relative; min-height: 500px; padding: 52px 52px 44px;
          display: flex; flex-direction: column; justify-content: space-between;
          transition: background .55s ease, color .55s ease; overflow: hidden;
        }
        .bs-slide-panel::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 3px; height: 56px; background: var(--red);
        }
        .bs-slide-num {
          font-size: 10px; font-weight: 500; letter-spacing: .3em;
          text-transform: uppercase; opacity: .4; margin-bottom: 32px;
        }
        .bs-slide-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(40px, 5.5vw, 70px);
          letter-spacing: -.01em; line-height: .93;
          text-transform: uppercase; margin-bottom: 12px;
        }
        .bs-slide-subtitle {
          font-family: 'Playfair Display', serif; font-style: italic;
          font-size: clamp(18px, 2vw, 26px); opacity: .6; margin-bottom: 24px;
        }
        .bs-slide-body {
          font-size: 15px; font-weight: 300; line-height: 1.8;
          max-width: 380px; opacity: .8;
        }
        .bs-slide-panel.entering .bs-slide-title,
        .bs-slide-panel.entering .bs-slide-subtitle,
        .bs-slide-panel.entering .bs-slide-body {
          animation: bsUp .55s cubic-bezier(.16,1,.3,1) forwards;
        }
        .bs-slide-panel.entering .bs-slide-subtitle { animation-delay: .06s; }
        .bs-slide-panel.entering .bs-slide-body     { animation-delay: .12s; }
        @keyframes bsUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bs-dot-row { display: flex; gap: 10px; margin-top: 32px; }
        .bs-dot {
          border: none; cursor: pointer; padding: 0; height: 8px;
          border-radius: 4px; transition: width .3s, background .3s;
        }

        /* Nav list */
        .bs-slide-nav { display: flex; flex-direction: column; background: var(--black); }
        .bs-nav-item {
          flex: 1; padding: 28px 36px;
          border-bottom: 1px solid rgba(255,255,255,.07);
          cursor: pointer; position: relative; overflow: hidden;
          transition: background .3s; display: flex; align-items: center; gap: 20px;
        }
        .bs-nav-item:last-child { border-bottom: none; }
        .bs-nav-item:hover { background: rgba(255,255,255,.04); }
        .bs-nav-item.active { background: rgba(200,55,45,.1); }
        .bs-nav-item .bs-progress {
          position: absolute; bottom: 0; left: 0; height: 2px; background: var(--red); width: 0;
        }
        .bs-nav-item.active .bs-progress { animation: fillBar 4s linear forwards; }
        @keyframes fillBar { from { width: 0; } to { width: 100%; } }
        .bs-nav-num {
          font-size: 10px; font-weight: 500; letter-spacing: .2em;
          color: rgba(255,255,255,.3); flex-shrink: 0; transition: color .3s;
        }
        .bs-nav-item.active .bs-nav-num,
        .bs-nav-item:hover .bs-nav-num { color: var(--red); }
        .bs-nav-title {
          font-family: 'Anton', sans-serif; font-size: clamp(16px, 1.8vw, 22px);
          letter-spacing: .04em; text-transform: uppercase;
          color: rgba(255,255,255,.4); transition: color .3s;
        }
        .bs-nav-item.active .bs-nav-title,
        .bs-nav-item:hover .bs-nav-title { color: #fff; }
        .bs-nav-arrow {
          margin-left: auto; font-size: 18px;
          color: rgba(255,255,255,.2); transition: color .3s, transform .3s;
        }
        .bs-nav-item.active .bs-nav-arrow,
        .bs-nav-item:hover .bs-nav-arrow { color: var(--red); transform: translateX(4px); }

        /* Marquee */
        .bs-marquee-wrap {
          width: 100%; background: var(--black); overflow: hidden;
          padding: 22px 0; border-top: 1px solid rgba(255,255,255,.07);
        }
        .bs-marquee-track {
          display: flex; width: max-content;
          animation: bsMarquee 22s linear infinite;
        }
        .bs-marquee-track:hover { animation-play-state: paused; }
        @keyframes bsMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .bs-marquee-item {
          font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500;
          letter-spacing: .32em; text-transform: uppercase;
          color: rgba(255,255,255,.45); padding: 0 32px; white-space: nowrap; transition: color .2s;
        }
        .bs-marquee-item:hover { color: var(--red); }
        .bs-marquee-item.dot { color: var(--red); font-size: 9px; padding: 0 12px; letter-spacing: 0; }

        /* Scroll reveal */
        [data-reveal] {
          opacity: 0; transform: translateY(28px);
          transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1);
        }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        [data-reveal][data-d="2"] { transition-delay: .14s; }
        [data-reveal][data-d="3"] { transition-delay: .28s; }

        @media (max-width: 1000px) {
          .bs-header { grid-template-columns: 1fr; padding: 0 28px 56px; }
          .bs-carousel { grid-template-columns: 1fr; padding: 0 28px 80px; }
          .bs-label-row { padding: 0 28px; }
          .bs-slide-nav { flex-direction: row; overflow-x: auto; }
          .bs-nav-item { flex-direction: column; align-items: flex-start; gap: 6px; min-width: 140px; }
          .bs-nav-arrow { display: none; }
        }
        @media (max-width: 600px) {
          .bs-root::before { left: 24px; right: 24px; }
          .bs-slide-panel { padding: 36px 28px 32px; min-height: 380px; }
        }
      `}</style>

      <div className="bs-root">
        <section className="bs-section" ref={sectionRef}>

          <div className="bs-label-row" data-reveal>
            <span className="bs-label-l">Mountain Experience</span>
            <span className="bs-label-r">Est. 2021 — Alps</span>
          </div>

          <div className="bs-header">
            <div>
              {/* ── "Step" — char split, skewX entrance, hoverRoll left ── */}
              <div className="bs-headline-wrap">
                <SplitText
                  text="Step Into"
                  splitType="chars"
                  from={{ opacity: 0, y: 60, skewX: 4 }}
                  to={{ opacity: 1, y: 0, skewX: 0 }}
                  delay={40}
                  duration={1.25}
                  ease="power3.out"
                  threshold={0.15}
                  rootMargin="-80px"
                  hoverRoll
                  hoverRollDirection="left"
                />
              </div>

              {/* ── "Into" — char split, skewX entrance, hoverRoll right ── */}
              {/* <div className="bs-headline-wrap">
                <SplitText
                  text="Into"
                  splitType="chars"
                  from={{ opacity: 0, y: 60, skewX: 4 }}
                  to={{ opacity: 1, y: 0, skewX: 0 }}
                  delay={40}
                  duration={1.25}
                  ease="power3.out"
                  threshold={0.15}
                  rootMargin="-80px"
                  hoverRoll
                  hoverRollDirection="right"
                />
              </div> */}

              {/* ── "Mountain Calm" — accent / italic, words split, hoverRoll center ── */}
              <div className="bs-headline-accent-wrap">
                <SplitText
                  text="Mountain Calm"
                  splitType="words"
                  from={{ opacity: 0, y: 80 }}
                  to={{ opacity: 1, y: 0 }}
                  delay={120}
                  duration={1.4}
                  ease="power4.out"
                  threshold={0.15}
                  rootMargin="-80px"
                  hoverRoll
                  hoverRollDirection="center"
                />
              </div>
              
              
         
            </div>
          </div>


          <div className="bs-carousel">
            <div
              className="bs-slide-panel entering"
              key={current}
              style={{ background: slide.bg, color: slide.color }}
            >
              <div>
                <p className="bs-slide-num">{slide.number} / 0{SLIDES.length}</p>
                <h3 className="bs-slide-title">{slide.title}</h3>
                <p className="bs-slide-subtitle">{slide.subtitle}</p>
                <p className="bs-slide-body">{slide.body}</p>
              </div>
              <div className="bs-dot-row">
                {SLIDES.map((_, i) => (
                  <button
                    key={i} className="bs-dot"
                    onClick={() => { if (autoRef.current) clearInterval(autoRef.current); goTo(i); }}
                    style={{
                      width: i === current ? "28px" : "8px",
                      background: i === current ? "var(--red)" : "rgba(255,255,255,0.25)",
                    }}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="bs-slide-nav">
              {SLIDES.map((s, i) => (
                <div
                  key={s.number}
                  className={`bs-nav-item${i === current ? " active" : ""}`}
                  onClick={() => { if (autoRef.current) clearInterval(autoRef.current); goTo(i); }}
                >
                  <span className="bs-nav-num">{s.number}</span>
                  <span className="bs-nav-title">{s.title}</span>
                  <span className="bs-nav-arrow">→</span>
                  <span className="bs-progress" />
                </div>
              ))}
            </div>
          </div>

          <div className="bs-marquee-wrap">
            <div className="bs-marquee-track">
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                <span key={i} className={`bs-marquee-item${item === "✦" ? " dot" : ""}`}>{item}</span>
              ))}
            </div>
          </div>

        </section>
      </div>
    </>
  );
}