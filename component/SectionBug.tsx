"use client";

/**
 * SectionBug
 * ──────────
 * Drop this once in your root layout:
 *   import SectionBug from "@/components/SectionBug";
 *   <SectionBug />
 *
 * The bug automatically:
 *  • Watches ALL h1/h2/h3 elements on the page via IntersectionObserver
 *  • Flies (lerp) to the first visible heading's top-left corner
 *  • Sits still with a gentle idle bob when it arrives
 *  • Flaps wings only while in transit
 *  • Re-targets whenever a new heading enters the viewport (scroll)
 *
 * You can customise which headings it targets by changing HEADING_SELECTOR.
 */

import { useEffect, useRef, useCallback } from "react";

const HEADING_SELECTOR = "h1, h2, h3";

// How far left of the heading start the bug lands
const LAND_OFFSET_X = -36;
const LAND_OFFSET_Y = 4;

export default function SectionBug() {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const wingsRef = useRef<HTMLDivElement>(null);
  const glowRef  = useRef<HTMLDivElement>(null);

  // Current animated position
  const pos     = useRef({ x: -200, y: -200 });
  const prevPos = useRef({ x: -200, y: -200 });
  // Target heading position
  const target  = useRef({ x: -200, y: -200 });
  // Rotation
  const rotation = useRef(0);
  // Is the bug in transit (flying) or resting?
  const flying  = useRef(false);
  const rafRef  = useRef<number>(0);
  // Track current heading so we don't re-target the same one
  const currentHeading = useRef<Element | null>(null);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const lerpAngle = (a: number, b: number, t: number) => {
    let d = b - a;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    return a + d * t;
  };

  /* Set a new target heading */
  const flyTo = useCallback((el: Element) => {
    if (el === currentHeading.current) return;
    currentHeading.current = el;

    const rect = el.getBoundingClientRect();
    // Scroll-relative position
    const x = rect.left + window.scrollX + LAND_OFFSET_X;
    const y = rect.top  + window.scrollY + LAND_OFFSET_Y;

    target.current = { x, y };
    flying.current = true;

    // Show wings while flying
    wingsRef.current?.classList.add("sbug-wings-on");
    glowRef.current?.classList.add("sbug-glow-on");
  }, []);

  /* Animation loop */
  useEffect(() => {
    const loop = () => {
      const wrap = wrapRef.current;
      if (wrap) {
        prevPos.current = { ...pos.current };

        if (flying.current) {
          // Fly speed — slow, lazy approach
          pos.current.x = lerp(pos.current.x, target.current.x, 0.022);
          pos.current.y = lerp(pos.current.y, target.current.y, 0.022);

          const dx = pos.current.x - prevPos.current.x;
          const dy = pos.current.y - prevPos.current.y;
          const speed = Math.sqrt(dx * dx + dy * dy);

          if (speed > 0.08) {
            const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
            rotation.current = lerpAngle(rotation.current, targetAngle, 0.05);
          }

          // Close enough — land
          const remX = Math.abs(target.current.x - pos.current.x);
          const remY = Math.abs(target.current.y - pos.current.y);
          if (remX < 1.2 && remY < 1.2) {
            pos.current = { ...target.current };
            flying.current = false;
            // Tuck wings away
            wingsRef.current?.classList.remove("sbug-wings-on");
            glowRef.current?.classList.remove("sbug-glow-on");
            target.current = { ...pos.current };
            // Trigger landing ring pop
            const ring = document.getElementById("sbug-land-ring");
            if (ring) {
              ring.classList.remove("pop");
              void ring.offsetWidth; // force reflow
              ring.classList.add("pop");
            }
          }
        }

        // viewport-relative position for fixed positioning
        const vx = pos.current.x - window.scrollX;
        const vy = pos.current.y - window.scrollY;
        wrap.style.transform = `translate(${vx}px, ${vy}px) rotate(${rotation.current}deg)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* IntersectionObserver — watch all headings */
  useEffect(() => {
    // Give the DOM time to paint before observing
    const setup = () => {
      const headings = Array.from(
        document.querySelectorAll<HTMLElement>(HEADING_SELECTOR)
      ).filter((h) => h.offsetParent !== null); // skip hidden

      if (headings.length === 0) return;

      // On first load, fly to whichever heading is at the top
      const firstVisible = headings.find((h) => {
        const r = h.getBoundingClientRect();
        return r.top >= 0 && r.top < window.innerHeight;
      });
      if (firstVisible) flyTo(firstVisible);

      const io = new IntersectionObserver(
        (entries) => {
          // Pick the topmost intersecting heading
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => {
              return (
                a.target.getBoundingClientRect().top -
                b.target.getBoundingClientRect().top
              );
            });
          if (visible.length > 0) flyTo(visible[0].target);
        },
        {
          threshold: 0.6,
          rootMargin: "0px 0px -10% 0px",
        }
      );

      headings.forEach((h) => io.observe(h));

      return () => io.disconnect();
    };

    // Short delay to let Next.js hydrate
    const t = setTimeout(setup, 300);
    return () => clearTimeout(t);
  }, [flyTo]);

  /* Re-scan headings on route change (works with Next.js app router) */
  useEffect(() => {
    const onPop = () => {
      currentHeading.current = null;
      setTimeout(() => {
        const h = document.querySelector<HTMLElement>(HEADING_SELECTOR);
        if (h) flyTo(h);
      }, 400);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [flyTo]);

  return (
    <>
      <style>{`
        /* ── Bug root ─────────────────────────────── */
        .sbug-root {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 99999;
          pointer-events: none;
          /* Centre the 44px bug on its anchor point */
          margin-left: -22px;
          margin-top: -22px;
          will-change: transform;
        }

        .sbug-size {
          position: relative;
          width: 44px;
          height: 44px;
        }

        /* ── Glow ────────────────────────────────── */
        .sbug-glow {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          background: radial-gradient(circle,
            rgba(227,30,38,0.22) 0%,
            rgba(227,30,38,0.07) 55%,
            transparent 75%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .sbug-glow.sbug-glow-on {
          opacity: 1;
          animation: sbugGlowPulse 0.22s ease-in-out infinite alternate;
        }
        @keyframes sbugGlowPulse {
          from { transform: scale(1);    opacity: 0.8; }
          to   { transform: scale(1.3);  opacity: 1; }
        }

        /* ── Wings ───────────────────────────────── */
        .sbug-wings {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.18s ease;
          pointer-events: none;
        }
        .sbug-wings.sbug-wings-on { opacity: 1; }

        .sbug-wing {
          position: absolute;
          transform-origin: 50% 100%;
        }
        .sbug-wing-l {
          left: -16px;
          top: 1px;
          width: 20px;
          height: 30px;
        }
        .sbug-wing-r {
          right: -16px;
          top: 1px;
          width: 20px;
          height: 30px;
        }

        /* Membrane */
        .sbug-membrane {
          position: absolute;
          inset: 0;
          border-radius: 80% 20% 20% 80% / 65% 65% 35% 35%;
          background: linear-gradient(135deg,
            rgba(210,235,255,0.72) 0%,
            rgba(175,215,255,0.45) 45%,
            rgba(140,190,255,0.18) 100%
          );
          border: 1px solid rgba(150,195,255,0.55);
          box-shadow:
            inset 0 1px 4px rgba(255,255,255,0.55),
            0 2px 8px rgba(90,150,255,0.18);
          backdrop-filter: blur(1.5px);
        }
        .sbug-wing-r .sbug-membrane {
          border-radius: 20% 80% 80% 20% / 65% 65% 35% 35%;
        }

        /* Veins */
        .sbug-vein {
          position: absolute;
          background: rgba(110,165,228,0.38);
          border-radius: 4px;
          transform-origin: bottom center;
        }
        .sbug-wing-l .sv1 { width:1px; height:64%; bottom:4px; left:40%; transform:rotate(-8deg); }
        .sbug-wing-l .sv2 { width:1px; height:44%; bottom:4px; left:62%; transform:rotate(-20deg); }
        .sbug-wing-l .sv3 { width:1px; height:28%; bottom:4px; left:20%; transform:rotate(6deg); }
        .sbug-wing-l .svh { width:68%; height:1px; bottom:38%; left:14%; }

        .sbug-wing-r .sv1 { width:1px; height:64%; bottom:4px; right:40%; transform:rotate(8deg); }
        .sbug-wing-r .sv2 { width:1px; height:44%; bottom:4px; right:62%; transform:rotate(20deg); }
        .sbug-wing-r .sv3 { width:1px; height:28%; bottom:4px; right:20%; transform:rotate(-6deg); }
        .sbug-wing-r .svh { width:68%; height:1px; bottom:38%; right:14%; }

        /* Flap — only plays when wings are visible */
        .sbug-wings.sbug-wings-on .sbug-wing-l {
          animation: sbugFlapL 0.13s ease-in-out infinite alternate;
        }
        .sbug-wings.sbug-wings-on .sbug-wing-r {
          animation: sbugFlapR 0.13s ease-in-out infinite alternate;
          animation-delay: 0.065s;
        }
        @keyframes sbugFlapL {
          0%   { transform: rotateY(0deg)   rotateZ(-6deg)  scaleX(1);   opacity:0.88; }
          100% { transform: rotateY(62deg)  rotateZ(-28deg) scaleX(0.68); opacity:0.28; }
        }
        @keyframes sbugFlapR {
          0%   { transform: rotateY(0deg)   rotateZ(6deg)   scaleX(1);   opacity:0.88; }
          100% { transform: rotateY(-62deg) rotateZ(28deg)  scaleX(0.68); opacity:0.28; }
        }

        /* ── Bug SVG body ────────────────────────── */
        .sbug-body {
          position: relative;
          z-index: 2;
          display: block;
          width: 44px;
          height: 44px;
          /* Gentle idle hover when sitting */
          animation: sbugIdle 3.5s ease-in-out infinite;
        }
        @keyframes sbugIdle {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          25%      { transform: translateY(-2px) rotate(1.5deg); }
          75%      { transform: translateY(-1px) rotate(-1deg); }
        }

        /* Small landing dot */
        .sbug-land-ring {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) scale(0);
          width: 28px; height: 28px;
          border: 1.5px solid rgba(227,30,38,0.5);
          border-radius: 50%;
          pointer-events: none;
          opacity: 0;
        }
        .sbug-land-ring.pop {
          animation: sbugLandPop 0.5s ease forwards;
        }
        @keyframes sbugLandPop {
          0%   { transform:translate(-50%,-50%) scale(0.3); opacity:0.8; }
          60%  { transform:translate(-50%,-50%) scale(1.4); opacity:0.4; }
          100% { transform:translate(-50%,-50%) scale(1.8); opacity:0; }
        }
      `}</style>

      <div ref={wrapRef} className="sbug-root" aria-hidden="true">
        {/* Glow */}
        <div ref={glowRef} className="sbug-glow" />

        <div className="sbug-size">
          {/* Wings */}
          <div ref={wingsRef} className="sbug-wings">
            <div className="sbug-wing sbug-wing-l">
              <div className="sbug-membrane" />
              <div className="sbug-vein sv1" /><div className="sbug-vein sv2" />
              <div className="sbug-vein sv3" /><div className="sbug-vein svh" />
            </div>
            <div className="sbug-wing sbug-wing-r">
              <div className="sbug-membrane" />
              <div className="sbug-vein sv1" /><div className="sbug-vein sv2" />
              <div className="sbug-vein sv3" /><div className="sbug-vein svh" />
            </div>
          </div>

          {/* Body */}
          <svg className="sbug-body" viewBox="0 0 799.92 799.92" xmlns="http://www.w3.org/2000/svg">
            <path d="M507.22,550.26c-4.76-5.34-13.3,2.27-8.54,7.61" style={{fill:"#e31e26",fillRule:"evenodd"}}/>
            <path d="M453.94,482.81c-17.65,7.73-25.66,28.3-17.93,45.94,7.73,17.62,28.3,25.64,45.93,17.92,17.63-7.75,25.66-28.3,17.93-45.94-7.75-17.63-28.31-25.65-45.93-17.92h0Z" style={{fill:"#e31e26",fillRule:"evenodd"}}/>
            <path d="M338.31,556.42c-16.63-9.72-22.22-31.07-12.51-47.7,9.72-16.61,31.08-22.21,47.69-12.49,16.63,9.72,22.22,31.07,12.51,47.7-9.72,16.61-31.08,22.21-47.69,12.49h0Z" style={{fill:"#e31e26",fillRule:"evenodd"}}/>
            <g>
              <path d="M516.63,597.03c-74.43,53.27-181.4,39.96-246.97-33.67-65.57-73.63-66.43-181.42-4.92-249.2,2.27-2.49,5.16-3.75,8.52-3.74,3.36.01,6.25,1.33,8.48,3.83l146.91,164.98c4.75,5.33,13.29-2.28,8.54-7.61l-146.91-164.98c-2.23-2.5-3.2-5.53-2.82-8.87.38-3.34,1.98-6.07,4.7-8.03,74.43-53.27,181.4-39.96,246.97,33.67,65.57,73.63,66.43,181.42,4.92,249.2" style={{fill:"#e31e26",fillRule:"evenodd"}}/>
              <path d="M524.3,390.79c7.73,17.62-.28,38.18-17.92,45.93-17.64,7.73-38.19-.3-45.94-17.93-7.72-17.63.3-38.19,17.92-45.93,17.64-7.73,38.21.29,45.94,17.93h0Z" style={{fill:"#e31e26",fillRule:"evenodd"}}/>
              <path d="M276.47,415.45c4.1-18.82,22.68-30.74,41.49-26.62,18.82,4.1,30.74,22.68,26.64,41.5-4.11,18.81-22.69,30.72-41.5,26.61-18.82-4.1-30.74-22.68-26.62-41.49h0Z" style={{fill:"#e31e26",fillRule:"evenodd"}}/>
              <path d="M391.42,313.09c19.16-1.91,36.24,12.07,38.15,31.22,1.9,19.17-12.08,36.25-31.24,38.16-19.17,1.9-36.23-12.09-38.15-31.25-1.91-19.16,12.08-36.25,31.24-38.13h0Z" style={{fill:"#e31e26",fillRule:"evenodd"}}/>
              <path d="M222.96,239.64c8.52-7.58,18.36-13.07,28.78-16.49,3.72-1.22,5.91-5.01,5.07-8.85-1.16-5.37-1-11.05.66-16.52,1.73-5.8,4.98-10.89,9.28-14.86.55-.52,1.14-1.02,1.74-1.5,2.02-1.63,3.38-3.5,4.28-5.95.62-1.66,1.63-3.2,3.05-4.46,4.59-4.09,11.64-3.69,15.74.91,4.09,4.59,3.66,11.64-.92,15.72-3.21,2.86-7.62,3.53-11.36,2.09-3.12-1.18-6.48-.28-8.61,2.28-1.99,2.44-3.52,5.25-4.46,8.38-1.26,4.2-1.32,8.59-.31,12.69.02.08.03.14.05.22.93,3.56,4.15,5.91,7.84,5.7,20.86-1.21,42.03,5.01,58.21,18.26,7.35,6.01,6.01,17.06-3,20.11-21.45,7.23-41.68,18.72-59.47,34.56-17.79,15.84-31.54,34.61-41.18,55.07-4.08,8.61-15.21,8.67-20.34.67-11.29-17.6-15.04-39.34-11.41-59.94.63-3.64-1.33-7.11-4.77-8.43-.08-.03-.14-.05-.22-.08-3.95-1.48-8.32-1.93-12.64-1.16-3.2.56-6.19,1.77-8.84,3.46-2.79,1.82-4.07,5.05-3.24,8.28.99,3.9-.19,8.2-3.4,11.06-4.59,4.09-11.63,3.68-15.71-.91-4.1-4.6-3.69-11.64.9-15.72,1.41-1.26,3.07-2.09,4.78-2.51,2.54-.61,4.56-1.74,6.41-3.56.55-.54,1.12-1.07,1.71-1.57,4.43-3.8,9.86-6.44,15.83-7.5,5.61-1,11.27-.51,16.49,1.25,3.72,1.27,7.73-.45,9.38-4.02,4.59-9.95,11.18-19.09,19.69-26.67h0Z" style={{fillRule:"evenodd"}}/>
              <path d="M318.1,388.27c-19.13-4.17-38.02,7.95-42.19,27.05-4.17,19.13,7.95,38.02,27.06,42.2,19.12,4.16,38.01-7.96,42.18-27.07,4.17-19.13-7.93-38.01-27.05-42.19h0Z" style={{fillRule:"evenodd"}}/>
              <path d="M402.44,313.16c-19.12-4.18-38.01,7.93-42.19,27.05-4.17,19.13,7.95,38.02,27.08,42.19,19.11,4.17,37.99-7.95,42.18-27.07,4.17-19.13-7.95-37.99-27.07-42.18h0Z" style={{fillRule:"evenodd"}}/>
              <path d="M499.94,370.18c-19.12-4.18-38.01,7.93-42.19,27.05-4.17,19.13,7.96,38.01,27.07,42.18,19.13,4.17,38.01-7.93,42.19-27.05,4.17-19.13-7.95-38.02-27.07-42.18h0Z" style={{fillRule:"evenodd"}}/>
            </g>
            <path d="M475.5,480.11c-19.13-4.17-38.01,7.93-42.18,27.07-4.18,19.12,7.93,38.01,27.05,42.19,19.13,4.17,38.01-7.96,42.19-27.08,4.17-19.11-7.95-37.99-27.07-42.18h0Z" style={{fillRule:"evenodd"}}/>
            <path d="M363.46,491.71c-19.12-4.18-38.01,7.93-42.19,27.05-4.17,19.13,7.95,38.02,27.07,42.18,19.12,4.18,38.01-7.93,42.19-27.05,4.17-19.13-7.95-38.02-27.07-42.18h0Z" style={{fillRule:"evenodd"}}/>
          </svg>

          {/* Landing ring — pops on arrival */}
          <div className="sbug-land-ring" id="sbug-land-ring" />
        </div>
      </div>
    </>
  );
}