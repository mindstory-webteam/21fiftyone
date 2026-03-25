// "use client";

// import { useEffect, useRef, useState } from "react";

// export default function BugCursor() {
//   const wrapRef    = useRef<HTMLDivElement>(null);
//   const wingsRef   = useRef<HTMLDivElement>(null);
//   const glowRef    = useRef<HTMLDivElement>(null);

//   // Raw cursor position (snaps instantly)
//   const cursor  = useRef({ x: -300, y: -300 });
//   // Smoothed bug position (lags behind)
//   const bugPos  = useRef({ x: -300, y: -300 });
//   // Previous bug position — to compute heading angle
//   const prevBug = useRef({ x: -300, y: -300 });
//   // Current rotation — smoothed separately
//   const rotation = useRef(0);

//   // Is the mouse currently moving?
//   const moving     = useRef(false);
//   const moveTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const rafRef     = useRef<number>(0);

//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     /* ── Mouse events ── */
//     const onMove = (e: MouseEvent) => {
//       cursor.current = { x: e.clientX, y: e.clientY };

//       if (!visible) setVisible(true);

//       // Mark as moving — show wings
//       if (!moving.current) {
//         moving.current = true;
//         wingsRef.current?.classList.add("wings-moving");
//         glowRef.current?.classList.add("glow-active");
//       }

//       // Stop "moving" state 120ms after last movement
//       if (moveTimer.current) clearTimeout(moveTimer.current);
//       moveTimer.current = setTimeout(() => {
//         moving.current = false;
//         wingsRef.current?.classList.remove("wings-moving");
//         glowRef.current?.classList.remove("glow-active");
//       }, 120);
//     };

//     const onLeave = () => setVisible(false);
//     const onEnter = () => setVisible(true);

//     window.addEventListener("mousemove", onMove, { passive: true });
//     document.addEventListener("mouseleave", onLeave);
//     document.addEventListener("mouseenter", onEnter);

//     /* ── Animation loop ── */
//     const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

//     // Smooth angle interpolation (handles 360° wrap)
//     const lerpAngle = (a: number, b: number, t: number) => {
//       let diff = b - a;
//       while (diff > 180)  diff -= 360;
//       while (diff < -180) diff += 360;
//       return a + diff * t;
//     };

//     const loop = () => {
//       const wrap = wrapRef.current;
//       if (wrap) {
//         prevBug.current = { x: bugPos.current.x, y: bugPos.current.y };

//         // Very slow, lazy follow — 0.04 = extremely floaty insect drift
//         bugPos.current.x = lerp(bugPos.current.x, cursor.current.x, 0.04);
//         bugPos.current.y = lerp(bugPos.current.y, cursor.current.y, 0.04);

//         const dx = bugPos.current.x - prevBug.current.x;
//         const dy = bugPos.current.y - prevBug.current.y;
//         const speed = Math.sqrt(dx * dx + dy * dy);

//         // Only rotate if actually moving meaningfully
//         if (speed > 0.05) {
//           const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
//           rotation.current = lerpAngle(rotation.current, targetAngle, 0.08);
//         }

//         wrap.style.transform = `translate(${bugPos.current.x}px, ${bugPos.current.y}px) rotate(${rotation.current}deg)`;
//       }

//       rafRef.current = requestAnimationFrame(loop);
//     };
//     rafRef.current = requestAnimationFrame(loop);

//     return () => {
//       cancelAnimationFrame(rafRef.current);
//       if (moveTimer.current) clearTimeout(moveTimer.current);
//       window.removeEventListener("mousemove", onMove);
//       document.removeEventListener("mouseleave", onLeave);
//       document.removeEventListener("mouseenter", onEnter);
//     };
//   }, [visible]);

//   return (
//     <>
//       <style>{`
//         *, *::before, *::after { cursor: none !important; }

//         /* ── Outer wrapper — positioned at bug coords ── */
//         .bug-root {
//           position: fixed;
//           top: 0;
//           left: 0;
//           z-index: 99999;
//           pointer-events: none;
//           /* Center the 48px bug on its position */
//           margin-left: -24px;
//           margin-top: -24px;
//           will-change: transform;
//           opacity: 0;
//           transition: opacity 0.4s ease;
//         }
//         .bug-root.is-visible { opacity: 1; }

//         /* ── Bug size container ── */
//         .bug-size {
//           width: 48px;
//           height: 48px;
//           position: relative;
//         }

//         /* ════════════════════════════════════════════
//            WINGS — hidden by default, shown while moving
//         ════════════════════════════════════════════ */
//         .bug-wings {
//           position: absolute;
//           inset: 0;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           /* Wings start hidden */
//           opacity: 0;
//           transition: opacity 0.12s ease;
//         }
//         /* Wings appear while cursor moves */
//         .bug-wings.wings-moving { opacity: 1; }

//         /* Each wing is a layered realistic shape */
//         .wing {
//           position: absolute;
//           transform-origin: 50% 100%;
//         }

//         /* ── LEFT WING ── */
//         .wing-left {
//           left: -14px;
//           top: 2px;
//           width: 22px;
//           height: 32px;
//           /* Stagger: wing-left leads slightly */
//           animation: none;
//         }
//         .wings-moving .wing-left {
//           animation: flapL 0.14s ease-in-out infinite alternate;
//         }

//         /* ── RIGHT WING ── */
//         .wing-right {
//           right: -14px;
//           top: 2px;
//           width: 22px;
//           height: 32px;
//           animation: none;
//         }
//         .wings-moving .wing-right {
//           animation: flapR 0.14s ease-in-out infinite alternate;
//           animation-delay: 0.07s; /* half-cycle offset so they alternate */
//         }

//         /* Wing shape — outer membrane */
//         .wing-membrane {
//           position: absolute;
//           inset: 0;
//           border-radius: 80% 20% 20% 80% / 60% 60% 40% 40%;
//           background: linear-gradient(
//             135deg,
//             rgba(210, 235, 255, 0.70) 0%,
//             rgba(180, 215, 255, 0.45) 40%,
//             rgba(150, 195, 255, 0.20) 100%
//           );
//           border: 1px solid rgba(160, 200, 255, 0.55);
//           box-shadow:
//             inset 0 1px 3px rgba(255,255,255,0.6),
//             0 2px 8px rgba(100, 160, 255, 0.18);
//           backdrop-filter: blur(1px);
//         }
//         .wing-right .wing-membrane {
//           border-radius: 20% 80% 80% 20% / 60% 60% 40% 40%;
//         }

//         /* Wing vein lines */
//         .wing-vein {
//           position: absolute;
//           background: rgba(120, 170, 230, 0.35);
//           border-radius: 4px;
//           transform-origin: bottom center;
//         }

//         /* Left wing veins */
//         .wing-left .vein-1 {
//           width: 1px; height: 65%;
//           bottom: 4px; left: 40%;
//           transform: rotate(-8deg);
//         }
//         .wing-left .vein-2 {
//           width: 1px; height: 45%;
//           bottom: 4px; left: 60%;
//           transform: rotate(-18deg);
//         }
//         .wing-left .vein-3 {
//           width: 1px; height: 30%;
//           bottom: 4px; left: 22%;
//           transform: rotate(5deg);
//         }
//         /* Horizontal cross-vein */
//         .wing-left .vein-h {
//           width: 70%; height: 1px;
//           bottom: 40%; left: 15%;
//         }

//         /* Right wing veins (mirrored) */
//         .wing-right .vein-1 {
//           width: 1px; height: 65%;
//           bottom: 4px; right: 40%; left: auto;
//           transform: rotate(8deg);
//         }
//         .wing-right .vein-2 {
//           width: 1px; height: 45%;
//           bottom: 4px; right: 60%; left: auto;
//           transform: rotate(18deg);
//         }
//         .wing-right .vein-3 {
//           width: 1px; height: 30%;
//           bottom: 4px; right: 22%; left: auto;
//           transform: rotate(-5deg);
//         }
//         .wing-right .vein-h {
//           width: 70%; height: 1px;
//           bottom: 40%; right: 15%; left: auto;
//         }

//         /* Flap keyframes — asymmetric for organic feel */
//         @keyframes flapL {
//           0%   { transform: rotateY(0deg) rotateZ(-5deg) scaleX(1);    opacity: 0.85; }
//           40%  { transform: rotateY(40deg) rotateZ(-18deg) scaleX(0.9); opacity: 0.55; }
//           100% { transform: rotateY(65deg) rotateZ(-28deg) scaleX(0.7); opacity: 0.30; }
//         }
//         @keyframes flapR {
//           0%   { transform: rotateY(0deg) rotateZ(5deg) scaleX(1);     opacity: 0.85; }
//           40%  { transform: rotateY(-40deg) rotateZ(18deg) scaleX(0.9); opacity: 0.55; }
//           100% { transform: rotateY(-65deg) rotateZ(28deg) scaleX(0.7); opacity: 0.30; }
//         }

//         /* ════════════════════════════════════════════
//            GLOW — subtle red aura, pulses while moving
//         ════════════════════════════════════════════ */
//         .bug-glow {
//           position: absolute;
//           inset: -10px;
//           border-radius: 50%;
//           background: radial-gradient(
//             circle,
//             rgba(227, 30, 38, 0.22) 0%,
//             rgba(227, 30, 38, 0.08) 50%,
//             transparent 75%
//           );
//           opacity: 0.4;
//           transition: opacity 0.15s ease;
//           pointer-events: none;
//         }
//         .bug-glow.glow-active {
//           opacity: 1;
//           animation: glowFlicker 0.14s ease-in-out infinite alternate;
//         }
//         @keyframes glowFlicker {
//           from { transform: scale(1);    opacity: 0.85; }
//           to   { transform: scale(1.25); opacity: 1; }
//         }

//         /* ── Bug SVG body ── */
//         .bug-body-svg {
//           position: relative;
//           z-index: 2;
//           display: block;
//           width: 48px;
//           height: 48px;
//           /* Subtle idle hover when not moving */
//           animation: idleHover 2.8s ease-in-out infinite;
//         }
//         @keyframes idleHover {
//           0%,100% { transform: translateY(0px); }
//           50%      { transform: translateY(-2px); }
//         }

//         /* ── Trail dots ── */
//         .bug-trail-dot {
//           position: fixed;
//           border-radius: 50%;
//           background: #e31e26;
//           pointer-events: none;
//           z-index: 99998;
//           opacity: 0;
//           transform: scale(1);
//           animation: dotFade 0.8s ease forwards;
//         }
//         @keyframes dotFade {
//           0%   { opacity: 0.45; transform: scale(1); }
//           100% { opacity: 0;   transform: scale(0.1); }
//         }
//       `}</style>

//       {/* Bug wrapper */}
//       <div ref={wrapRef} className={`bug-root${visible ? " is-visible" : ""}`}>

//         {/* Glow halo */}
//         <div ref={glowRef} className="bug-glow" />

//         <div className="bug-size">
//           {/* Wings — only animate while cursor moves */}
//           <div ref={wingsRef} className="bug-wings">

//             {/* Left wing */}
//             <div className="wing wing-left">
//               <div className="wing-membrane" />
//               <div className="wing-vein vein-1" />
//               <div className="wing-vein vein-2" />
//               <div className="wing-vein vein-3" />
//               <div className="wing-vein vein-h" />
//             </div>

//             {/* Right wing */}
//             <div className="wing wing-right">
//               <div className="wing-membrane" />
//               <div className="wing-vein vein-1" />
//               <div className="wing-vein vein-2" />
//               <div className="wing-vein vein-3" />
//               <div className="wing-vein vein-h" />
//             </div>

//           </div>

//           {/* Bug SVG body */}
//           <svg
//             className="bug-body-svg"
//             viewBox="0 0 799.92 799.92"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path d="M507.22,550.26c-4.76-5.34-13.3,2.27-8.54,7.61"
//               style={{ fill: "#e31e26", fillRule: "evenodd" }}/>
//             <path d="M453.94,482.81c-17.65,7.73-25.66,28.3-17.93,45.94,7.73,17.62,28.3,25.64,45.93,17.92,17.63-7.75,25.66-28.3,17.93-45.94-7.75-17.63-28.31-25.65-45.93-17.92h0Z"
//               style={{ fill: "#e31e26", fillRule: "evenodd" }}/>
//             <path d="M338.31,556.42c-16.63-9.72-22.22-31.07-12.51-47.7,9.72-16.61,31.08-22.21,47.69-12.49,16.63,9.72,22.22,31.07,12.51,47.7-9.72,16.61-31.08,22.21-47.69,12.49h0Z"
//               style={{ fill: "#e31e26", fillRule: "evenodd" }}/>
//             <g>
//               <path d="M516.63,597.03c-74.43,53.27-181.4,39.96-246.97-33.67-65.57-73.63-66.43-181.42-4.92-249.2,2.27-2.49,5.16-3.75,8.52-3.74,3.36.01,6.25,1.33,8.48,3.83l146.91,164.98c4.75,5.33,13.29-2.28,8.54-7.61l-146.91-164.98c-2.23-2.5-3.2-5.53-2.82-8.87.38-3.34,1.98-6.07,4.7-8.03,74.43-53.27,181.4-39.96,246.97,33.67,65.57,73.63,66.43,181.42,4.92,249.2"
//               style={{ fill: "#e31e26", fillRule: "evenodd" }}/>
//               <path d="M524.3,390.79c7.73,17.62-.28,38.18-17.92,45.93-17.64,7.73-38.19-.3-45.94-17.93-7.72-17.63.3-38.19,17.92-45.93,17.64-7.73,38.21.29,45.94,17.93h0Z"
//               style={{ fill: "#e31e26", fillRule: "evenodd" }}/>
//               <path d="M276.47,415.45c4.1-18.82,22.68-30.74,41.49-26.62,18.82,4.1,30.74,22.68,26.64,41.5-4.11,18.81-22.69,30.72-41.5,26.61-18.82-4.1-30.74-22.68-26.62-41.49h0Z"
//               style={{ fill: "#e31e26", fillRule: "evenodd" }}/>
//               <path d="M391.42,313.09c19.16-1.91,36.24,12.07,38.15,31.22,1.9,19.17-12.08,36.25-31.24,38.16-19.17,1.9-36.23-12.09-38.15-31.25-1.91-19.16,12.08-36.25,31.24-38.13h0Z"
//               style={{ fill: "#e31e26", fillRule: "evenodd" }}/>
//               <path d="M222.96,239.64c8.52-7.58,18.36-13.07,28.78-16.49,3.72-1.22,5.91-5.01,5.07-8.85-1.16-5.37-1-11.05.66-16.52,1.73-5.8,4.98-10.89,9.28-14.86.55-.52,1.14-1.02,1.74-1.5,2.02-1.63,3.38-3.5,4.28-5.95.62-1.66,1.63-3.2,3.05-4.46,4.59-4.09,11.64-3.69,15.74.91,4.09,4.59,3.66,11.64-.92,15.72-3.21,2.86-7.62,3.53-11.36,2.09-3.12-1.18-6.48-.28-8.61,2.28-1.99,2.44-3.52,5.25-4.46,8.38-1.26,4.2-1.32,8.59-.31,12.69.02.08.03.14.05.22.93,3.56,4.15,5.91,7.84,5.7,20.86-1.21,42.03,5.01,58.21,18.26,7.35,6.01,6.01,17.06-3,20.11-21.45,7.23-41.68,18.72-59.47,34.56-17.79,15.84-31.54,34.61-41.18,55.07-4.08,8.61-15.21,8.67-20.34.67-11.29-17.6-15.04-39.34-11.41-59.94.63-3.64-1.33-7.11-4.77-8.43-.08-.03-.14-.05-.22-.08-3.95-1.48-8.32-1.93-12.64-1.16-3.2.56-6.19,1.77-8.84,3.46-2.79,1.82-4.07,5.05-3.24,8.28.99,3.9-.19,8.2-3.4,11.06-4.59,4.09-11.63,3.68-15.71-.91-4.1-4.6-3.69-11.64.9-15.72,1.41-1.26,3.07-2.09,4.78-2.51,2.54-.61,4.56-1.74,6.41-3.56.55-.54,1.12-1.07,1.71-1.57,4.43-3.8,9.86-6.44,15.83-7.5,5.61-1,11.27-.51,16.49,1.25,3.72,1.27,7.73-.45,9.38-4.02,4.59-9.95,11.18-19.09,19.69-26.67h0Z"
//               style={{ fillRule: "evenodd" }}/>
//               <path d="M318.1,388.27c-19.13-4.17-38.02,7.95-42.19,27.05-4.17,19.13,7.95,38.02,27.06,42.2,19.12,4.16,38.01-7.96,42.18-27.07,4.17-19.13-7.93-38.01-27.05-42.19h0Z"
//               style={{ fillRule: "evenodd" }}/>
//               <path d="M402.44,313.16c-19.12-4.18-38.01,7.93-42.19,27.05-4.17,19.13,7.95,38.02,27.08,42.19,19.11,4.17,37.99-7.95,42.18-27.07,4.17-19.13-7.95-37.99-27.07-42.18h0Z"
//               style={{ fillRule: "evenodd" }}/>
//               <path d="M499.94,370.18c-19.12-4.18-38.01,7.93-42.19,27.05-4.17,19.13,7.96,38.01,27.07,42.18,19.13,4.17,38.01-7.93,42.19-27.05,4.17-19.13-7.95-38.02-27.07-42.18h0Z"
//               style={{ fillRule: "evenodd" }}/>
//             </g>
//             <path d="M475.5,480.11c-19.13-4.17-38.01,7.93-42.18,27.07-4.18,19.12,7.93,38.01,27.05,42.19,19.13,4.17,38.01-7.96,42.19-27.08,4.17-19.11-7.95-37.99-27.07-42.18h0Z"
//               style={{ fillRule: "evenodd" }}/>
//             <path d="M363.46,491.71c-19.12-4.18-38.01,7.93-42.19,27.05-4.17,19.13,7.95,38.02,27.07,42.18,19.12,4.18,38.01-7.93,42.19-27.05,4.17-19.13-7.95-38.02-27.07-42.18h0Z"
//               style={{ fillRule: "evenodd" }}/>
//           </svg>
//         </div>
//       </div>

//       {/* Trail dots */}
//       <TrailDots cursorRef={cursor} movingRef={moving} />
//     </>
//   );
// }

// /* ── Red trail dots — only while moving ─────────── */
// function TrailDots({
//   cursorRef,
//   movingRef,
// }: {
//   cursorRef: React.MutableRefObject<{ x: number; y: number }>;
//   movingRef: React.MutableRefObject<boolean>;
// }) {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     let frame = 0;
//     let tick  = 0;

//     const run = () => {
//       tick++;
//       // Spawn a dot every 5 frames while moving
//       if (movingRef.current && tick % 5 === 0) {
//         const dot = document.createElement("div");
//         dot.className = "bug-trail-dot";
//         // Slight random scatter around cursor
//         const jx = (Math.random() - 0.5) * 6;
//         const jy = (Math.random() - 0.5) * 6;
//         const sz = 2 + Math.random() * 3;
//         dot.style.cssText = `
//           width:${sz}px;
//           height:${sz}px;
//           left:${cursorRef.current.x + jx - sz / 2}px;
//           top:${cursorRef.current.y  + jy - sz / 2}px;
//         `;
//         container.appendChild(dot);
//         setTimeout(() => dot.remove(), 820);
//       }
//       frame = requestAnimationFrame(run);
//     };
//     frame = requestAnimationFrame(run);
//     return () => cancelAnimationFrame(frame);
//   }, [cursorRef, movingRef]);

//   return (
//     <div
//       ref={containerRef}
//       style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99998 }}
//     />
//   );
// }