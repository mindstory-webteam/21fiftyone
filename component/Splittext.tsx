"use client";

import { useEffect, useRef, CSSProperties } from "react";
import type { ElementType } from "react";
import { motion } from "framer-motion";
import React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
   TEXT ROLL — hover roll-up animation per character
   Pure presentational: no hooks, no side effects.
═══════════════════════════════════════════════════════════ */
const ROLL_STAGGER = 0.035;

export const TextRoll: React.FC<{
  children: string;
  direction?: "left" | "right" | "center";
}> = ({ children, direction = "left" }) => {
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
      {/* visible row — scrolls up on hover */}
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

      {/* hidden row — slides in from below */}
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

/* ═══════════════════════════════════════════════════════════
   HOVER ROLL SPLIT TEXT  (leaf — only called when hoverRoll=true)
   Scroll-reveals each unit with GSAP, then each unit has
   TextRoll hover via Framer Motion.
   ⚠  No conditional hooks — useEffect always runs here.
═══════════════════════════════════════════════════════════ */
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
}: Omit<SplitTextProps, "tag">) {
  const containerRef = useRef<HTMLDivElement>(null);
  const unitRefs     = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef        = useRef<gsap.core.Timeline | null>(null);

  const units: string[] =
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

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          tlRef.current?.play();
          io.unobserve(container);
        }
      }),
      { threshold, rootMargin }
    );
    io.observe(container);

    return () => {
      io.disconnect();
      tlRef.current?.kill();
    };
  // text is the only dep that meaningfully changes between mounts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-label={text}
      style={{
        textAlign,
        lineHeight: "inherit",
        display: "flex",
        flexWrap: "wrap",
        // chars: no gap; words/lines: small space between units
        gap: splitType === "chars" ? "0" : "0.25em",
      }}
    >
      {units.map((unit, i) => {
        // preserve explicit space characters in char-split mode
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
   STANDARD SPLIT TEXT  (leaf — only called when hoverRoll=false)
   Uses innerHTML DOM splitting so GSAP can target each span.
   ⚠  No conditional hooks — useEffect always runs here.
═══════════════════════════════════════════════════════════ */
function StandardSplitText({
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
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const tlRef        = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* Build span elements from text, respecting splitType */
    const buildSpans = (): HTMLElement[] => {
      container.innerHTML = "";

      if (splitType === "chars") {
        const spans: HTMLElement[] = [];
        text.split(" ").forEach((word, wi, arr) => {
          const wordEl = document.createElement("span");
          wordEl.style.display    = "inline-block";
          wordEl.style.whiteSpace = "nowrap";

          word.split("").forEach((char) => {
            const el = document.createElement("span");
            el.textContent        = char;
            el.style.display      = "inline-block";
            el.style.willChange   = "transform, opacity";
            wordEl.appendChild(el);
            spans.push(el);
          });

          container.appendChild(wordEl);

          if (wi < arr.length - 1) {
            const sp = document.createElement("span");
            sp.innerHTML       = "&nbsp;";
            sp.style.display   = "inline-block";
            container.appendChild(sp);
          }
        });
        return spans;
      }

      if (splitType === "words") {
        return text.split(" ").map((word, wi, arr) => {
          const el = document.createElement("span");
          el.textContent      = word + (wi < arr.length - 1 ? "\u00A0" : "");
          el.style.display    = "inline-block";
          el.style.willChange = "transform, opacity";
          container.appendChild(el);
          return el;
        });
      }

      // lines
      return text.split("\n").map((line) => {
        const el = document.createElement("span");
        el.textContent      = line;
        el.style.display    = "block";
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

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          tlRef.current?.play();
          io.unobserve(container);
        }
      }),
      { threshold, rootMargin }
    );
    io.observe(container);

    return () => {
      io.disconnect();
      tlRef.current?.kill();
      // restore plain text so next mount starts clean
      if (container) container.innerHTML = text;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

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
   PUBLIC ENTRY POINT — pure router, zero hooks of its own.
   React's rules of hooks are satisfied because the two leaf
   components always call their hooks unconditionally.
═══════════════════════════════════════════════════════════ */
export default function SplitText(props: SplitTextProps) {
  if (props.hoverRoll) {
    return <HoverRollSplitText {...props} />;
  }
  return <StandardSplitText {...props} />;
}