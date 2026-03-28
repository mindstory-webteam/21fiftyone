"use client";

import { useEffect, useRef, useState, CSSProperties } from "react";
import type { ElementType } from "react";
import { motion } from "framer-motion";
import React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   SPLIT TEXT — inline (copy from SplitText.tsx)
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

const ROLL_STAGGER = 0.035;

interface TextRollProps {
  children: string;
  direction?: "left" | "right" | "center";
}

const TextRoll: React.FC<TextRollProps> = ({ children, direction = "left" }) => {
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
      style={{ position: "relative", display: "inline-block", overflow: "hidden", cursor: "pointer", lineHeight: 0.88, verticalAlign: "top", userSelect: "none" }}
    >
      <span aria-hidden style={{ display: "block" }}>
        {chars.map((l, i) => (
          <motion.span key={i} variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }} transition={{ ease: "easeInOut", delay: getDelay(i, chars.length) }} style={{ display: "inline-block" }}>
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </span>
      <span aria-hidden style={{ display: "block", position: "absolute", inset: 0 }}>
        {chars.map((l, i) => (
          <motion.span key={i} variants={{ initial: { y: "100%" }, hovered: { y: 0 } }} transition={{ ease: "easeInOut", delay: getDelay(i, chars.length) }} style={{ display: "inline-block" }}>
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );
};

function HoverRollSplitText({
  text, className = "", delay = 50, duration = 1.25, ease = "power3.out",
  splitType = "chars", from = { opacity: 0, y: 40 }, to = { opacity: 1, y: 0 },
  threshold = 0.1, rootMargin = "-100px", textAlign = "left",
  onLetterAnimationComplete, showCallback = false, hoverRollDirection = "left",
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const unitRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const units: string[] =
    splitType === "chars" ? text.split("") :
    splitType === "words" ? text.split(" ") :
    text.split("\n");

  useEffect(() => {
    const container = containerRef.current;
    const targets = unitRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!container || !targets.length) return;
    gsap.set(targets, { ...from });
    tlRef.current = gsap.timeline({
      paused: true,
      onComplete: () => { if (showCallback && onLetterAnimationComplete) onLetterAnimationComplete(); },
    });
    tlRef.current.to(targets, { ...to, duration, ease, stagger: delay / 1000 });
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { tlRef.current?.play(); observer.unobserve(container); } }); },
      { threshold, rootMargin }
    );
    observer.observe(container);
    return () => { observer.disconnect(); tlRef.current?.kill(); };
  }, [text, delay, duration, ease, splitType, threshold, rootMargin, showCallback]);

  return (
    <div ref={containerRef} className={className}
      style={{ textAlign, lineHeight: "inherit", display: "flex", flexWrap: "wrap", gap: splitType === "chars" ? "0" : "0.25em" }}
      aria-label={text}
    >
      {units.map((unit, i) => {
        if (unit === " " && splitType === "chars") {
          return <span key={i} ref={(el) => { unitRefs.current[i] = el; }} style={{ display: "inline-block" }}>&nbsp;</span>;
        }
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
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  if (hoverRoll) {
    return <HoverRollSplitText text={text} className={className} delay={delay} duration={duration} ease={ease} splitType={splitType} from={from} to={to} threshold={threshold} rootMargin={rootMargin} textAlign={textAlign} onLetterAnimationComplete={onLetterAnimationComplete} showCallback={showCallback} hoverRollDirection={hoverRollDirection} />;
  }

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
    tlRef.current = gsap.timeline({ paused: true, onComplete: () => { if (showCallback && onLetterAnimationComplete) onLetterAnimationComplete(); } });
    tlRef.current.to(targets, { ...to, duration, ease, stagger: delay / 1000 });
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { tlRef.current?.play(); observer.unobserve(container); } }); },
      { threshold, rootMargin }
    );
    observer.observe(container);
    return () => { observer.disconnect(); tlRef.current?.kill(); if (container) container.innerHTML = text; };
  }, [text, delay, duration, ease, splitType, threshold, rootMargin, showCallback]);

  return <Tag ref={containerRef as React.Ref<never>} className={className} style={{ textAlign, lineHeight: "inherit" }} aria-label={text} />;
}

/* ═══════════════════════════════════════════════════════════
   BREAK THE MOLD
═══════════════════════════════════════════════════════════ */

export default function BreakTheMold() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@300;400;600;700&display=swap');

        .btm-section {
          position: relative;
          width: 100%;
          min-height: 520px;
          background: #0d0d0d;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .btm-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 60% at 40% 55%, rgba(212,43,43,0.09) 0%, transparent 70%);
          pointer-events: none;
        }

        .btm-bg-num {
          position: absolute;
          right: -24px;
          bottom: -60px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(200px, 28vw, 340px);
          font-weight: 900;
          color: rgba(255,255,255,0.03);
          line-height: 1;
          letter-spacing: -0.05em;
          pointer-events: none;
          user-select: none;
        }

        .btm-top-rule {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent 100%);
        }
        .btm-bottom-rule {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent 100%);
        }

        .btm-corner {
          position: absolute;
          width: 18px; height: 18px;
          pointer-events: none; opacity: 0.2;
        }
        .btm-corner.tl { top: 22px; left: 36px; border-top: 1px solid #fff; border-left: 1px solid #fff; }
        .btm-corner.tr { top: 22px; right: 36px; border-top: 1px solid #fff; border-right: 1px solid #fff; }
        .btm-corner.bl { bottom: 22px; left: 36px; border-bottom: 1px solid #fff; border-left: 1px solid #fff; }
        .btm-corner.br { bottom: 22px; right: 36px; border-bottom: 1px solid #fff; border-right: 1px solid #fff; }

        .btm-meta-left {
          position: absolute;
          bottom: 30px; left: 48px;
          display: flex; align-items: center; gap: 10px;
          opacity: 0; transition: opacity 0.8s ease 0.9s;
        }
        .btm-meta-left.show { opacity: 0.28; }
        .btm-meta-left-line { width: 22px; height: 1px; background: #fff; flex-shrink: 0; }
        .btm-meta-left-text {
          font-family: 'Barlow', sans-serif;
          font-size: 8.5px; font-weight: 600;
          letter-spacing: 0.3em; color: #fff; text-transform: uppercase;
        }

        .btm-meta-right {
          position: absolute;
          bottom: 30px; right: 48px;
          opacity: 0; transition: opacity 0.8s ease 1s;
        }
        .btm-meta-right.show { opacity: 0.2; }
        .btm-meta-right-text {
          font-family: 'Barlow', sans-serif;
          font-size: 8.5px; font-weight: 600;
          letter-spacing: 0.3em; color: #fff; text-transform: uppercase;
        }

        /* ══ CENTER CONTENT ══ */
        .btm-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 80px 40px;
          max-width: 760px;
          width: 100%;
        }

        /* Eyebrow */
        .btm-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 36px;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.6s ease 0.1s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s;
        }
        .btm-eyebrow.show { opacity: 1; transform: translateY(0); }
        .btm-eyebrow-line { width: 28px; height: 1px; background: rgba(212,43,43,0.75); flex-shrink: 0; }
        .btm-eyebrow-text {
          font-family: 'Barlow', sans-serif;
          font-size: 9.5px; font-weight: 600;
          letter-spacing: 0.34em; color: #d42b2b; text-transform: uppercase;
        }

        /* ── SplitText headline wrappers ── */
        .btm-headline-wrap {
          margin: 0 0 32px;
          line-height: 0.88;
        }

        /* Line 1: solid white */
        .btm-split-solid {
          font-family: 'Barlow Condensed', sans-serif !important;
          font-weight: 900 !important;
          font-size: clamp(56px, 9vw, 108px) !important;
          text-transform: uppercase !important;
          line-height: 0.88 !important;
          letter-spacing: -0.03em !important;
          color: #ffffff !important;
          display: flex;
          justify-content: center;
        }

        /* Line 2: outline / ghost */
        .btm-split-outline {
          font-family: 'Barlow Condensed', sans-serif !important;
          font-weight: 900 !important;
          font-size: clamp(56px, 9vw, 108px) !important;
          text-transform: uppercase !important;
          line-height: 0.88 !important;
          letter-spacing: -0.03em !important;
          color: transparent !important;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.22) !important;
          display: flex;
          justify-content: center;
          margin-top: 4px;
        }

        /* ── SplitText subtext ── */
        .btm-split-sub {
          font-family: 'Barlow', sans-serif !important;
          font-size: 14px !important;
          font-weight: 400 !important;
          line-height: 1.82 !important;
          color: rgba(255,255,255,0.42) !important;
          max-width: 420px;
          margin: 0 auto 44px !important;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.28em;
        }

        /* CTA */
        .btm-cta-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.6s ease 0.52s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.52s;
        }
        .btm-cta-wrap.show { opacity: 1; transform: translateY(0); }

        .btm-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          background: #d42b2b;
          color: #ffffff;
          font-family: 'Barlow', sans-serif;
          font-size: 9.5px; font-weight: 700;
          letter-spacing: 0.26em; text-transform: uppercase;
          text-decoration: none;
          padding: 15px 28px;
          border-radius: 2px;
          border: none; cursor: pointer;
          transition: background 0.25s ease, gap 0.28s cubic-bezier(0.16,1,0.3,1);
        }
        .btm-btn-primary:hover { background: #b82020; gap: 22px; }
        .btm-btn-primary svg { flex-shrink: 0; transition: transform 0.28s cubic-bezier(0.16,1,0.3,1); }
        .btm-btn-primary:hover svg { transform: translateX(4px); }

        .btm-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: none;
          color: rgba(255,255,255,0.55);
          font-family: 'Barlow', sans-serif;
          font-size: 9.5px; font-weight: 600;
          letter-spacing: 0.24em; text-transform: uppercase;
          text-decoration: none; padding: 15px 0;
          border: none; cursor: pointer;
          transition: color 0.22s ease;
        }
        .btm-btn-ghost:hover { color: rgba(255,255,255,0.9); }

        @media (max-width: 640px) {
          .btm-content { padding: 64px 24px; }
          .btm-cta-wrap { flex-direction: column; gap: 8px; }
          .btm-corner { display: none; }
          .btm-meta-left, .btm-meta-right { display: none; }
        }
      `}</style>

      <section className="btm-section" ref={sectionRef}>

        <div className="btm-glow" />
        <div className="btm-bg-num">1</div>
        <div className="btm-top-rule" />
        <div className="btm-bottom-rule" />

        <div className="btm-corner tl" />
        <div className="btm-corner tr" />
        <div className="btm-corner bl" />
        <div className="btm-corner br" />

        <div className={`btm-meta-left${visible ? " show" : ""}`}>
          <div className="btm-meta-left-line" />
          <span className="btm-meta-left-text">Studio 2025</span>
        </div>
        <div className={`btm-meta-right${visible ? " show" : ""}`}>
          <span className="btm-meta-right-text">Based Worldwide</span>
        </div>

        <div className="btm-content">

          {/* Eyebrow */}
          <div className={`btm-eyebrow${visible ? " show" : ""}`}>
            <div className="btm-eyebrow-line" />
            <span className="btm-eyebrow-text">Let's Create Together</span>
            <div className="btm-eyebrow-line" />
          </div>

          {/* ── Headline via SplitText ── */}
          <div className="btm-headline-wrap">
            {/* Line 1 — solid, char-by-char reveal with hover roll */}
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
            />

            {/* Line 2 — outline, word-by-word reveal with hover roll */}
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

          {/* ── Subtext via SplitText ── */}
          <SplitText
            text="Let's collaborate on your next masterpiece. Our studio doors are always open for the brave."
            className="btm-split-sub"
            splitType="words"
            delay={28}
            duration={0.9}
            ease="power2.out"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
            rootMargin="-20px"
            textAlign="center"
          />

          {/* CTAs */}
          <div className={`btm-cta-wrap${visible ? " show" : ""}`}>
            <button type="button" className="btm-btn-primary">
              Connect With The Studio
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5H13M9 1L13 5L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" className="btm-btn-ghost">
              View Our Work
            </button>
          </div>

        </div>
      </section>
    </>
  );
}