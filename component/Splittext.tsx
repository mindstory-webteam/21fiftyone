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
  /** When true, wraps each split unit in a TextRoll hover effect */
  hoverRoll?: boolean;
  /** Stagger direction for TextRoll: "left" | "right" | "center" */
  hoverRollDirection?: "left" | "right" | "center";
}

/* ═══════════════════════════════════════════════════════════
   TEXT ROLL — hover roll-up animation per unit
═══════════════════════════════════════════════════════════ */

const ROLL_STAGGER = 0.035;

interface TextRollProps {
  children: string;
  className?: string;
  direction?: "left" | "right" | "center";
}

export const TextRoll: React.FC<TextRollProps> = ({
  children,
  className,
  direction = "left",
}) => {
  const chars = children.split("");

  const getDelay = (i: number, total: number) => {
    if (direction === "center")
      return ROLL_STAGGER * Math.abs(i - (total - 1) / 2);
    if (direction === "right") return ROLL_STAGGER * (total - 1 - i);
    return ROLL_STAGGER * i; // left
  };

  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={`relative inline-block overflow-hidden cursor-pointer select-none ${className ?? ""}`}
      style={{ lineHeight: 0.82, verticalAlign: "top" }}
    >
      {/* visible row — scrolls up */}
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

      {/* hidden row — slides in from below */}
      <span
        aria-hidden
        style={{ display: "block", position: "absolute", inset: 0 }}
      >
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
   SPLIT TEXT — scroll-reveal + optional hover roll
═══════════════════════════════════════════════════════════ */

export default function SplitText({
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

  /* ── hoverRoll mode: render via React, animate with GSAP on mount ── */
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

  /* ── standard mode: innerHTML splitting ── */
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
        if (showCallback && onLetterAnimationComplete) {
          onLetterAnimationComplete();
        }
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
   HOVER ROLL SPLIT TEXT
   Scroll-reveals each unit, then each unit has TextRoll hover.
   Uses React rendering (not innerHTML) so Framer Motion works.
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
  tag: Tag = "div",
  hoverRollDirection = "left",
}: HoverRollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const unitRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  /* Build units based on splitType */
  const units: string[] =
    splitType === "chars"
      ? text.split("") // each character is a unit
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
        if (showCallback && onLetterAnimationComplete) {
          onLetterAnimationComplete();
        }
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
      style={{ textAlign, lineHeight: "inherit", display: "flex", flexWrap: "wrap", gap: splitType === "chars" ? "0" : "0.25em" }}
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
            <TextRoll direction={hoverRollDirection}>
              {unit}
            </TextRoll>
          </span>
        );
      })}
    </div>
  );
}