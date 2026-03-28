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

        .about {
          width: 100%;
          background: var(--cream);
          padding: 120px 0 140px;
          overflow: hidden;
          position: relative;
          text-align: justify;
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
        }

        /* Label row */
        .about-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 56px;
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

        /* Hero grid */
        .about-hero {
          display: grid;
          grid-template-columns: 1fr 580px;
          gap: 0;
          align-items: end;
          margin-bottom: 96px;
        }

        /* SplitText heading styles */
        .about-headline {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(88px, 12vw, 168px) !important;
          line-height: 0.88 !important;
          letter-spacing: -0.02em !important;
          color: var(--black) !important;
          text-transform: uppercase;
          padding-bottom: 10px;
          display: block;
          /* allow TextRoll overflow to clip correctly */
          overflow: visible;
        }
        .about-headline-accent {
          font-family: 'Playfair Display', serif !important;
          font-style: italic !important;
          font-size: clamp(64px, 8.5vw, 120px) !important;
          color: var(--red) !important;
          line-height: 1 !important;
          letter-spacing: -0.01em !important;
          display: block;
          margin-top: 8px;
          overflow: visible;
        }

        /* ── TextRoll sits inside HoverRollSplitText flex container ──
           Make each character unit clip its own roll animation        */
        .about-headline [data-roll-unit],
        .about-headline-accent [data-roll-unit] {
          overflow: hidden;
        }

        /* Dark intro card */
        .about-intro-card {
          background: var(--black);
          padding: 48px 44px 44px;
          position: relative;
          align-self: end;
          margin-left: 64px;
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

        /* Body grid */
        .about-body-grid {
          display: grid;
          grid-template-columns: 380px 1fr 300px;
          gap: 56px;
          align-items: start;
        }

        /* Image */
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

        /* Text column */
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

        /* Tags */
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

        /* Right col */
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
        .about-cta {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          background: var(--red);
          color: #fff;
          padding: 18px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          text-decoration: none;
          font-weight: 500;
          transition: gap 0.3s;
        }
        .about-cta:hover { gap: 24px; }
        .about-cta svg { transition: transform 0.3s; }
        .about-cta:hover svg { transform: translateX(4px); }

        /* Process strip */
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

        /* Scroll reveal */
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

        @media (max-width: 1100px) {
          .about-body-grid { grid-template-columns: 300px 1fr; }
          .about-right-col { display: none; }
        }
        @media (max-width: 800px) {
          .about-inner { padding: 0 24px; }
          .about::before { left: 24px; right: 24px; }
          .about-hero { grid-template-columns: 1fr; }
          .about-intro-card { margin-top: 32px; }
          .about-body-grid { grid-template-columns: 1fr; }
          .process-strip { grid-template-columns: 1fr 1fr; gap: 40px; }
          .process-item { border-right: none; padding-right: 0; }
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
              {/* "We" — line 1, with TextRoll hover */}
              <SplitText
                text="We Make"
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

              {/* "Make" — line 2, with TextRoll hover */}
              {/* <SplitText
                text="Make"
                tag="div"
                className="about-headline"
                delay={40}
                duration={1.25}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 60 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-60px"
                textAlign="left"
                hoverRoll
                hoverRollDirection="center"
              /> */}

              {/* "Culture" — italic accent, line 3, with TextRoll hover */}
              <SplitText
                text="Culture"
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
                Detroit is an AI Production House in Paris, obsessed with crafting
                culture for luxury brands. We sit at the intersection of human
                artistry and machine precision.
              </p>
              <div className="card-stat">
                <div>
                  <span className="stat-num">120+</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div>
                  <span className="stat-num">48</span>
                  <span className="stat-label">Brands</span>
                </div>
                <div>
                  <span className="stat-num">4yr</span>
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
                <img
                  src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=90"
                  alt="Studio portrait"
                />
              </div>
              <div className="image-accent">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
                  alt="Luxury shoot"
                />
              </div>
              <p className="image-caption">Studio — Paris, 2024</p>
            </div>

            {/* Text column */}
            <div className="about-text-col">
              <p className="about-section-title" data-reveal data-d="3">The Origin</p>
              <p className="about-paragraph" data-reveal data-d="4">
                Founded in the quiet hours of 2021, our agency was born from a
                singular obsession: the belief that the digital world has grown too
                predictable, too &ldquo;safe.&rdquo; We sought a return to the
                bold&mdash;the dramatic&mdash;the cinematic.
              </p>
              <p className="about-paragraph" data-reveal data-d="4">
                Detroit merges the raw energy of editorial photography with the
                infinite possibilities of AI and CGI. Every frame is a deliberate
                act. Every pixel, a decision.
              </p>

              <div className="about-quote-block" data-reveal data-d="5">
                <blockquote>
                  &ldquo;We don&rsquo;t build campaigns. We engineer cultural
                  moments that outlive the season.&rdquo;
                </blockquote>
                <cite>— Jonathan Gilbert, Founder</cite>
              </div>
            </div>

            {/* Right col */}
            <div className="about-right-col" data-reveal data-d="4">
              <div className="about-tags" data-reveal data-d="6">
                {["Luxury", "AI Production", "3D & CGI", "Print & Film", "Editorial", "Paris"].map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              <p className="about-paragraph" data-reveal data-d="5">
                Our studio partners with Louis Vuitton, Hermès, Dom Pérignon and
                Chanel to tell stories that feel both timeless and radically now.
              </p>

              <div className="v-marquee-wrap">
                <div className="v-marquee">
                  {[
                    "Louis Vuitton","Hermès","Dom Pérignon","Chanel",
                    "La Mer","Google","Taittinger","Marly Garden",
                    "Louis Vuitton","Hermès","Dom Pérignon","Chanel",
                    "La Mer","Google","Taittinger","Marly Garden",
                  ].map((brand, i) => (
                    <div key={i} className="v-marquee-item">{brand}</div>
                  ))}
                </div>
              </div>

            <RollButton label="Connect us" href="/contact" />

              {/* <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                color: "var(--muted)",
                letterSpacing: "0.12em",
                lineHeight: "1.8",
              }}>
                We accept a limited number of new partners each quarter.{" "}
                <strong style={{ color: "var(--black)" }}>2 slots open</strong> for Q3 2025.
              </p> */}
            </div>
          </div>

          {/* Process strip */}
          <hr className="about-hr" data-reveal data-d="5" />
          <div className="process-strip">
            {[
              { num: "01", title: "Conceive", desc: "Deep immersion in your brand world — uncovering the tension between heritage and the unexpected." },
              { num: "02", title: "Design",   desc: "Storyboards, art direction and AI pre-visualization built in parallel — at speed." },
              { num: "03", title: "Produce",  desc: "On-location or studio. Physical and digital. Human talent and machine intelligence — unified." },
              { num: "04", title: "Deliver",  desc: "Print-ready masters, film cuts and 3D assets — all from one studio, one creative vision." },
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