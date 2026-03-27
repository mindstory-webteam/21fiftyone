"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ─── Design tokens — defined locally in this file ─── */
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

/* ─── Data ──────────────────────────────────────────── */
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

export default function BenefitSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const h0 = useRef<HTMLDivElement>(null);
  const h1 = useRef<HTMLDivElement>(null);
  const h2 = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
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

  /* Char-by-char animation (reference style: y:60, skewX) */
  useEffect(() => {
    const splits: InstanceType<typeof SplitText>[] = [];

    ([
      [h0.current, 4, 0],
      [h1.current, 4, 0.12],
      [h2.current, 8, 0.24],
    ] as [HTMLElement | null, number, number][]).forEach(([el, skewX, delay], i) => {
      if (!el) return;
      const s = new SplitText(el, { type: "chars", charsClass: "bs-char" });
      splits.push(s);
      gsap.set(s.chars, { opacity: 0, y: 60, skewX });
      gsap.to(s.chars, {
        opacity: 1, y: 0, skewX: 0,
        stagger: i === 2 ? 0.035 : 0.04,
        duration: i === 2 ? 1.4 : 1.25,
        ease: i === 2 ? "power4.out" : "power3.out",
        delay,
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });

    if (subRef.current) {
      const s = new SplitText(subRef.current, { type: "words", wordsClass: "bs-word" });
      splits.push(s);
      gsap.set(s.words, { opacity: 0, y: 20 });
      gsap.to(s.words, {
        opacity: 1, y: 0, stagger: 0.06, duration: 0.9,
        ease: "power2.out", delay: 0.4,
        scrollTrigger: { trigger: subRef.current, start: "top 85%" },
      });
    }

    return () => splits.forEach(s => s.revert());
  }, []);

  /* Scroll reveal */
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
          display: grid; grid-template-columns: 1fr 480px; gap: 40px; align-items: end;
        }

        .bs-headline {
          font-family: 'Anton', sans-serif;
          font-size: clamp(88px, 11vw, 158px);
          line-height: .88;
          letter-spacing: -.02em;
          color: var(--black);
          text-transform: uppercase;
          display: block;
          overflow: hidden;
        }
        .bs-headline-accent {
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
        .bs-char { display: inline-block; }

        /* Dark intro card */
        .bs-intro-card {
          background: var(--black); padding: 48px 44px 44px;
          position: relative; align-self: end;
        }
        .bs-intro-card::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 3px; height: 48px; background: var(--red);
        }
        .bs-sub {
          font-size: 15px; line-height: 1.8; color: #b0a99e;
          font-weight: 300; margin-bottom: 28px;
        }
        .bs-word { display: inline-block; }
        .bs-card-stats {
          display: flex; gap: 48px; padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,.08);
        }
        .bs-stat-num {
          font-family: 'Anton', sans-serif; font-size: 44px;
          line-height: 1; color: #fff; display: block;
        }
        .bs-stat-label {
          font-size: 10px; letter-spacing: .2em; text-transform: uppercase;
          color: #666; margin-top: 6px; display: block;
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
              <div className="bs-headline" ref={h0}>Step</div>
              <div className="bs-headline" ref={h1}>Into</div>
              <div className="bs-headline-accent" ref={h2}>Mountain Calm</div>
            </div>
            <div className="bs-intro-card" data-reveal data-d="2">
              <p className="bs-sub" ref={subRef}>
                Where altitude becomes attitude. Every peak we visit is a lesson
                in patience, presence and the kind of peace that only nature
                can teach. Scroll down and let the mountain show you the way.
              </p>
              <div className="bs-card-stats">
                <div><span className="bs-stat-num">12+</span><span className="bs-stat-label">Retreats</span></div>
                <div><span className="bs-stat-num">3.2k</span><span className="bs-stat-label">Climbers</span></div>
                <div><span className="bs-stat-num">4yr</span><span className="bs-stat-label">Running</span></div>
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