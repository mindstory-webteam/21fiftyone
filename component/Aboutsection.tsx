"use client";

import { useEffect, useRef } from "react";
import SplitText from "./Splittext"; // adjust path as needed
import RollButton from "./Rollbutton";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  /* Scroll reveal for non-heading elements */
  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("revealed");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --cream: #f2ede6;
          --black: #0c0c0c;
          --red:   #c8372d;
          --muted: #8a8480;
          --line:  rgba(12,12,12,0.12);
        }

        /* ─── Base Section ─────────────────────────────────────────── */
        .about {
          width: 100%;
          background: var(--cream);
          padding: 120px 0 140px;
          overflow: hidden;
          position: relative;
          text-align: justify;
          box-sizing: border-box;
        }
        .about::before {
          content: '';
          position: absolute;
          top: 0; left: 64px; right: 64px;
          height: 1px;
          background: var(--line);
        }
        .about-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 64px;
          box-sizing: border-box;
        }

        /* ─── Label row ─────────────────────────────────────────────── */
        .about-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 56px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .about-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--red);
        }
        .about-label-right {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
        }

        /* ─── Hero grid ─────────────────────────────────────────────── */
        .about-hero {
          display: grid;
          grid-template-columns: 1fr 580px;
          gap: 0;
          align-items: end;
          margin-bottom: 96px;
        }

        /* ─── SplitText headings ────────────────────────────────────── */
        .about-headline {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(56px, 12vw, 168px) !important;
          line-height: 0.88 !important;
          letter-spacing: -0.02em !important;
          color: var(--black) !important;
          text-transform: uppercase;
          padding-bottom: 10px;
          display: block;
          overflow: visible;
        }
        .about-headline-accent {
          font-family: 'Playfair Display', serif !important;
          font-style: italic !important;
          font-size: clamp(40px, 8.5vw, 120px) !important;
          color: var(--red) !important;
          line-height: 1 !important;
          letter-spacing: -0.01em !important;
          display: block;
          margin-top: 8px;
          overflow: visible;
        }
        .about-headline [data-roll-unit],
        .about-headline-accent [data-roll-unit] {
          overflow: hidden;
        }

        /* ─── Dark intro card ───────────────────────────────────────── */
        .about-intro-card {
          background: var(--black);
          padding: 48px 44px 44px;
          position: relative;
          align-self: end;
          margin-left: 64px;
          box-sizing: border-box;
        }
        .about-intro-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 48px;
          background: var(--red);
        }
        .about-intro-card p {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          line-height: 1.8;
          color: #b0a99e;
          margin-bottom: 28px;
          font-weight: 300;
        }
        .card-stat {
          display: flex;
          gap: 48px;
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.08);
          flex-wrap: wrap;
        }
        .stat-num {
          font-family: 'Anton', sans-serif;
          font-size: 44px;
          line-height: 1;
          color: #fff;
          display: block;
        }
        .stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #666;
          margin-top: 6px;
          display: block;
        }

        /* ─── Body grid ─────────────────────────────────────────────── */
        .about-body-grid {
          display: grid;
          grid-template-columns: 380px 1fr 300px;
          gap: 56px;
          align-items: start;
        }

        /* ─── Image ─────────────────────────────────────────────────── */
        .image-stack { position: relative; }
        .image-main {
          width: 100%;
          aspect-ratio: 3/4;
          overflow: hidden;
        }
        .image-main img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          filter: grayscale(15%);
          transition: filter 0.6s ease, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .image-main:hover img { filter: grayscale(0%); transform: scale(1.04); }
        .image-accent {
          position: absolute;
          bottom: -28px; right: -28px;
          width: 140px; height: 100px;
          overflow: hidden;
          border: 3px solid var(--cream);
        }
        .image-accent img { width: 100%; height: 100%; object-fit: cover; }
        .image-caption {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--line);
        }

        /* ─── Text column ───────────────────────────────────────────── */
        .about-text-col { padding-top: 8px; }
        .about-section-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 24px;
        }
        .about-paragraph {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          line-height: 1.82;
          color: #3a3735;
          font-weight: 300;
          margin-bottom: 24px;
        }
        .about-quote-block {
          margin: 44px 0;
          padding: 36px 40px;
          background: #eae4db;
          position: relative;
        }
        .about-quote-block::before {
          content: '\u201C';
          font-family: 'Playfair Display', serif;
          font-size: 120px;
          color: var(--red);
          opacity: 0.18;
          position: absolute;
          top: -16px; left: 24px;
          line-height: 1;
        }
        .about-quote-block blockquote {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 22px;
          line-height: 1.5;
          color: var(--black);
          position: relative;
          z-index: 1;
          margin: 0;
        }
        .about-quote-block cite {
          font-family: 'DM Sans', sans-serif;
          font-style: normal;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 20px;
          display: block;
        }

        /* ─── Tags ──────────────────────────────────────────────────── */
        .about-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 36px; }
        .tag {
          border: 1px solid rgba(12,12,12,0.18);
          padding: 8px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--black);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: color 0.25s;
        }
        .tag::after {
          content: '';
          position: absolute; inset: 0;
          background: #c8372d;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
          z-index: -1;
        }
        .tag:hover { color: var(--cream); border-color: var(--black); }
        .tag:hover::after { transform: scaleX(1); }

        /* ─── Right col ─────────────────────────────────────────────── */
        .about-right-col { display: flex; flex-direction: column; gap: 32px; padding-top: 8px; }
        .v-marquee-wrap {
          height: 160px;
          overflow: hidden;
          border-left: 1px solid var(--line);
          padding-left: 24px;
        }
        .v-marquee {
          display: flex;
          flex-direction: column;
          animation: marqueeUp 10s linear infinite;
        }
        .v-marquee-item {
          font-family: 'Anton', sans-serif;
          font-size: 13px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--muted);
          padding: 10px 0;
          white-space: nowrap;
          transition: color 0.2s;
        }
        .v-marquee-item:hover { color: var(--red); }
        @keyframes marqueeUp {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }

        /* ─── Process strip ─────────────────────────────────────────── */
        .about-hr { border: none; border-top: 1px solid var(--line); margin: 80px 0 0; }
        .process-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          padding-top: 56px;
        }
        .process-item {
          padding: 0 32px 0 0;
          transition: transform 0.3s ease;
        }
        .process-item:first-child { padding-left: 0; }
        .process-item:last-child { border-right: none; padding-right: 0; }
        .process-item:hover { transform: translateY(-4px); }
        .process-num {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          color: var(--red);
          margin-bottom: 16px;
        }
        .process-title {
          font-family: 'Anton', sans-serif;
          font-size: 22px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--black);
          margin-bottom: 12px;
          transition: color 0.2s;
        }
        .process-item:hover .process-title { color: var(--red); }
        .process-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          line-height: 1.7;
          color: var(--muted);
          font-weight: 300;
        }

        /* ─── Scroll reveal ─────────────────────────────────────────── */
        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1),
                      transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        [data-reveal][data-d="1"] { transition-delay: 0.08s; }
        [data-reveal][data-d="2"] { transition-delay: 0.18s; }
        [data-reveal][data-d="3"] { transition-delay: 0.3s; }
        [data-reveal][data-d="4"] { transition-delay: 0.44s; }
        [data-reveal][data-d="5"] { transition-delay: 0.58s; }
        [data-reveal][data-d="6"] { transition-delay: 0.72s; }
        [data-reveal][data-d="7"] { transition-delay: 0.86s; }
        .image-stack[data-reveal] { transform: translateY(40px) scale(0.97); }
        .image-stack[data-reveal].revealed { transform: translateY(0) scale(1); }

        /* ════════════════════════════════════════════════════════════
           RESPONSIVE BREAKPOINTS
           ════════════════════════════════════════════════════════════ */

        /* ─── Large desktop: 1280px–1440px ─────────────────────────── */
        @media (max-width: 1440px) {
          .about-hero {
            grid-template-columns: 1fr 500px;
          }
          .about-body-grid {
            grid-template-columns: 340px 1fr 280px;
            gap: 48px;
          }
        }

        /* ─── Medium desktop: 1100px–1280px ────────────────────────── */
        @media (max-width: 1280px) {
          .about-inner { padding: 0 48px; }
          .about::before { left: 48px; right: 48px; }
          .about-hero {
            grid-template-columns: 1fr 440px;
          }
          .about-intro-card {
            margin-left: 40px;
            padding: 40px 36px 36px;
          }
          .about-body-grid {
            grid-template-columns: 300px 1fr 260px;
            gap: 40px;
          }
          .card-stat { gap: 32px; }
          .stat-num { font-size: 38px; }
        }

        /* ─── Tablet landscape / small desktop: 1024px–1100px ──────── */
        @media (max-width: 1100px) {
          .about-body-grid {
            grid-template-columns: 280px 1fr;
            gap: 40px;
          }
          .about-right-col { display: none; }
          .about-hero {
            grid-template-columns: 1fr 400px;
          }
        }

        /* ─── Tablet portrait: 768px–1024px ────────────────────────── */
        @media (max-width: 1024px) {
          .about { padding: 80px 0 100px; }
          .about-inner { padding: 0 40px; }
          .about::before { left: 40px; right: 40px; }

          .about-label-row { margin-bottom: 40px; }

          .about-hero {
            grid-template-columns: 1fr;
            gap: 0;
            margin-bottom: 64px;
          }
          .about-intro-card {
            margin-left: 0;
            margin-top: 40px;
            padding: 36px 32px 32px;
          }

          .about-body-grid {
            grid-template-columns: 260px 1fr;
            gap: 36px;
          }
          .about-right-col { display: none; }

          .process-strip {
            grid-template-columns: repeat(2, 1fr);
            gap: 48px 32px;
            padding-top: 48px;
          }
          .process-item {
            padding: 0;
            border-right: none;
          }

          .about-hr { margin: 64px 0 0; }
        }

        /* ─── Large mobile / small tablet: 600px–768px ─────────────── */
        @media (max-width: 768px) {
          .about { padding: 64px 0 80px; }
          .about-inner { padding: 0 28px; }
          .about::before { left: 28px; right: 28px; }

          .about-label-row { margin-bottom: 32px; }

          .about-hero {
            grid-template-columns: 1fr;
            margin-bottom: 48px;
          }
          .about-intro-card {
            margin-left: 0;
            margin-top: 32px;
            padding: 32px 28px 28px;
          }
          .about-intro-card p { font-size: 14px; }
          .card-stat { gap: 24px; }
          .stat-num { font-size: 36px; }

          .about-body-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .about-right-col { display: none; }

          .image-main { aspect-ratio: 4/3; }

          .about-quote-block {
            padding: 28px 28px;
            margin: 32px 0;
          }
          .about-quote-block blockquote { font-size: 19px; }

          .process-strip {
            grid-template-columns: repeat(2, 1fr);
            gap: 36px 24px;
            padding-top: 40px;
          }
          .process-item { padding: 0; border-right: none; }
          .process-title { font-size: 18px; }

          .about-hr { margin: 48px 0 0; }
        }

        /* ─── Mobile: 480px–600px ───────────────────────────────────── */
        @media (max-width: 600px) {
          .about { padding: 56px 0 72px; }
          .about-inner { padding: 0 20px; }
          .about::before { left: 20px; right: 20px; }

          .about-label-row { margin-bottom: 28px; }

          .about-hero { margin-bottom: 40px; }
          .about-intro-card {
            padding: 28px 24px 24px;
            margin-top: 28px;
          }
          .about-intro-card p { font-size: 13.5px; line-height: 1.75; }
          .card-stat { gap: 20px; flex-wrap: nowrap; }
          .stat-num { font-size: 32px; }
          .stat-label { font-size: 9px; }

          .about-paragraph { font-size: 15px; }

          .about-quote-block {
            padding: 24px 20px;
            margin: 28px 0;
          }
          .about-quote-block::before { font-size: 88px; top: -10px; left: 16px; }
          .about-quote-block blockquote { font-size: 17px; line-height: 1.55; }

          .process-strip {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px 20px;
            padding-top: 36px;
          }
          .process-title { font-size: 17px; }
          .process-desc { font-size: 12px; }

          .about-hr { margin: 40px 0 0; }
          .about-tags { gap: 6px; }
          .tag { padding: 7px 13px; }
        }

        /* ─── Small mobile: 360px–480px ─────────────────────────────── */
        @media (max-width: 480px) {
          .about { padding: 48px 0 64px; }
          .about-inner { padding: 0 16px; }
          .about::before { left: 16px; right: 16px; }

          .about-label-row { margin-bottom: 24px; gap: 6px; }
          .about-label, .about-label-right { font-size: 9px; letter-spacing: 0.2em; }

          .about-hero { margin-bottom: 32px; }
          .about-intro-card {
            padding: 24px 20px 20px;
            margin-top: 24px;
          }
          .about-intro-card p { font-size: 13px; margin-bottom: 20px; }
          .card-stat { gap: 16px; padding-top: 20px; }
          .stat-num { font-size: 28px; }

          .about-section-title { font-size: 9px; margin-bottom: 16px; }
          .about-paragraph { font-size: 14px; line-height: 1.78; margin-bottom: 20px; }

          .about-quote-block {
            padding: 20px 16px;
            margin: 24px 0;
          }
          .about-quote-block::before { font-size: 72px; top: -8px; left: 12px; }
          .about-quote-block blockquote { font-size: 16px; }
          .about-quote-block cite { font-size: 9px; margin-top: 14px; }

          .image-main { aspect-ratio: 4/3; }
          .image-caption { font-size: 9px; }

          .process-strip {
            grid-template-columns: 1fr;
            gap: 32px;
            padding-top: 32px;
          }
          .process-title { font-size: 20px; }
          .process-desc { font-size: 13px; }

          .about-hr { margin: 36px 0 0; }
        }

        /* ─── Extra small mobile: < 360px ───────────────────────────── */
        @media (max-width: 360px) {
          .about-inner { padding: 0 14px; }
          .about-intro-card { padding: 20px 16px 18px; }
          .card-stat { gap: 12px; }
          .stat-num { font-size: 26px; }
          .about-paragraph { font-size: 13.5px; }
          .about-quote-block blockquote { font-size: 15px; }
          .process-strip { gap: 28px; }
        }
      `}</style>

      <section className="about" ref={sectionRef}>
        <div className="about-inner">

          {/* Label row */}
          <div className="about-label-row" data-reveal>
            <span className="about-label">Detroit Studio</span>
            <span className="about-label-right">Est. 2021 — Paris</span>
          </div>

          {/* Hero: SplitText headings + dark card */}
          <div className="about-hero">
            <div>
              <SplitText
                text="WE MAKE"
                tag="div"
                className="about-headline"
                delay={45}
                duration={1.25}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 60 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-60px"
                textAlign="left"
                onLetterAnimationComplete={handleAnimationComplete}
                showCallback
                hoverRoll
                hoverRollDirection="center"
              />

              <SplitText
                text="Stories"
                tag="div"
                className="about-headline-accent"
                delay={35}
                duration={1.4}
                ease="power4.out"
                splitType="words"
                from={{ opacity: 0, y: 80, skewX: 8 }}
                to={{ opacity: 1, y: 0, skewX: 0 }}
                threshold={0.1}
                rootMargin="-60px"
                textAlign="left"
                hoverRoll
                hoverRollDirection="left"
              />
            </div>

            {/* Dark card */}
            <div className="about-intro-card" data-reveal data-d="2">
              <p>
                We are a visual production studio driven by storytelling, creativity, and precision.
                At the intersection of cinematic craft and modern technology, we create content that connects, engages, and leaves a lasting impact.
                From films to brand visuals, every project is designed to elevate your story and transform ideas into powerful visual experiences.
              </p>
              <div className="card-stat">
                <div>
                  <span className="stat-num">100+</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div>
                  <span className="stat-num">25+</span>
                  <span className="stat-label">Brands</span>
                </div>
                <div>
                  <span className="stat-num">10+</span>
                  <span className="stat-label">Studio</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body grid */}
          <div className="about-body-grid">

            {/* Image stack */}
            <div className="image-stack" data-reveal data-d="3">
              <div className="image-main">
                <img src="/image/about-4.jpg" alt="Studio portrait" />
              </div>
              <p className="image-caption">Studio — Paris, 2024</p>
            </div>

            {/* Text column */}
            <div className="about-text-col">
              <p className="about-section-title" data-reveal data-d="3">The Origin</p>
              <p className="about-paragraph" data-reveal data-d="4">
                Founded with a passion for storytelling, 21 fiftyone was built on a simple belief — every idea holds the potential to become something extraordinary.
                In a world full of content, we focus on creating visuals that stand out, connect emotionally, and stay memorable.
              </p>

              <div className="about-quote-block" data-reveal data-d="5">
                <blockquote>
                  &ldquo;We don&rsquo;t build campaigns. We engineer cultural
                  moments that outlive the season.&rdquo;
                </blockquote>
                <cite>— Jonathan Gilbert, Founder</cite>
              </div>
            </div>

            {/* Right col — hidden below 1100px */}
            <div className="about-right-col" data-reveal data-d="4">
              <div className="about-tags" data-reveal data-d="6">
                {["Luxury", "AI Production", "3D & CGI", "Print & Film", "Editorial", "Paris"].map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              <p className="about-paragraph" data-reveal data-d="5">
                We blend cinematic storytelling with modern production techniques to craft content that is both visually striking and meaningful.
              </p>
              <div className="v-marquee-wrap">
                <div className="v-marquee">
                  {[
                    "VISUAL PRODUCTION","FILM & CINEMA","BRAND STORYTELLING","AI CONTENT","EVENTS","CREATIVE DIRECTION",
                    "VISUAL PRODUCTION","FILM & CINEMA","BRAND STORYTELLING","AI CONTENT","EVENTS","CREATIVE DIRECTION",
                  ].map((brand, i) => (
                    <div key={i} className="v-marquee-item">{brand}</div>
                  ))}
                </div>
              </div>
              <RollButton label="About Us" href="/projects" />
            </div>
          </div>

          {/* Process strip */}
          <hr className="about-hr" data-reveal data-d="5" />
          <div className="process-strip">
            {[
              { num: "01", title: "CONCEIVE", desc: "We dive deep into your vision—understanding your brand, audience, and story to uncover ideas that truly stand out." },
              { num: "02", title: "DESIGN",   desc: "We shape concepts into visual direction through storyboards, creative planning, and pre-visualization with precision." },
              { num: "03", title: "PRODUCE",  desc: "From shoot to execution, we bring ideas to life—blending cinematic craft, technology, and creative excellence." },
              { num: "04", title: "DELIVER",  desc: "We refine every frame and deliver high-quality content optimized for impact across all platforms." },
            ].map(({ num, title, desc }, i) => (
              <div key={num} className="process-item" data-reveal data-d={String(i + 4)}>
                <p className="process-num">{num}</p>
                <h3 className="process-title">{title}</h3>
                <p className="process-desc">{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}