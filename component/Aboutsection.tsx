"use client";

import { useEffect, useRef } from "react";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  /* Intersection Observer — fade-in on scroll */
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
      { threshold: 0.15 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Barlow:wght@400;500;600&display=swap');

        .about {
          width: 100%;
          background: #f8f7f5;
          padding: 100px 0;
          overflow: hidden;
        }

        .about-inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 64px;
          display: grid;
          grid-template-columns: 420px 1fr;
          gap: 80px;
          align-items: start;
        }

        /* ── Left image ──────────────────────── */
        .about-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          border-radius: 2px;
        }

        .about-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .about-image-wrap:hover img {
          transform: scale(1.04);
        }

        /* Thin accent line on image bottom-left corner */
        .about-image-wrap::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 3px;
          background: #d42b2b;
        }

        /* ── Right content ───────────────────── */
        .about-content {
          padding-top: 8px;
        }

        /* Heading */
        .about-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 600;
          color: #0d0d0d;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .about-title-icon {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          flex-shrink: 0;
        }

        /* Sparkle icon — pure CSS */
        .sparkle {
          position: relative;
          width: 22px;
          height: 22px;
          flex-shrink: 0;
        }
        .sparkle::before,
        .sparkle::after {
          content: '';
          position: absolute;
          background: #d42b2b;
          border-radius: 1px;
        }
        /* Vertical bar */
        .sparkle::before {
          width: 3px;
          height: 100%;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          clip-path: polygon(50% 0%, 60% 35%, 100% 50%, 60% 65%, 50% 100%, 40% 65%, 0% 50%, 40% 35%);
        }
        /* The sparkle shape */
        .sparkle::after {
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          clip-path: polygon(50% 0%, 60% 35%, 100% 50%, 60% 65%, 50% 100%, 40% 65%, 0% 50%, 40% 35%);
        }

        /* Body paragraphs */
        .about-body {
          margin-bottom: 36px;
        }

        .about-p {
          font-family: 'Barlow', sans-serif;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.78;
          color: #444;
          margin-bottom: 20px;
          letter-spacing: 0.005em;
        }
        .about-p:last-child { margin-bottom: 0; }

        /* Quote block */
        .about-quote {
          border-left: 2px solid #d42b2b;
          padding-left: 24px;
          margin-top: 40px;
        }

        .about-quote-label {
          font-family: 'Barlow', sans-serif;
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.22em;
          color: #aaa;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .about-quote-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(20px, 2.2vw, 28px);
          font-weight: 600;
          color: #0d0d0d;
          line-height: 1.35;
          letter-spacing: -0.01em;
        }

        /* ── Reveal animations ───────────────── */
        [data-reveal] {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        [data-reveal].revealed {
          opacity: 1;
          transform: translateY(0);
        }
        [data-reveal][data-delay="1"] { transition-delay: 0.1s; }
        [data-reveal][data-delay="2"] { transition-delay: 0.22s; }
        [data-reveal][data-delay="3"] { transition-delay: 0.36s; }
        [data-reveal][data-delay="4"] { transition-delay: 0.5s; }
        [data-reveal][data-delay="5"] { transition-delay: 0.64s; }

        /* Image reveal — slides up with slight scale */
        .about-image-wrap[data-reveal] {
          transform: translateY(32px) scale(0.98);
        }
        .about-image-wrap[data-reveal].revealed {
          transform: translateY(0) scale(1);
        }

        /* ── Responsive ──────────────────────── */
        @media (max-width: 900px) {
          .about-inner {
            grid-template-columns: 1fr;
            gap: 48px;
            padding: 0 28px;
          }
          .about-image-wrap {
            aspect-ratio: 4 / 3;
            max-width: 520px;
          }
          .about { padding: 72px 0; }
        }
      `}</style>

      <section className="about" ref={sectionRef}>
        <div className="about-inner">

          {/* ── Left: image ─────────────────── */}
          <div className="about-image-wrap" data-reveal data-delay="1">
            {/*
              Replace src with your actual image.
              The design uses a dark architectural / cinematic photo.
            */}
            <img
              src="/image/about-2.jpg"
              alt="21FiftyOne studio — cinematic light study"
            />
          </div>

          {/* ── Right: content ──────────────── */}
          <div className="about-content">

            <h2 className="about-title" data-reveal data-delay="2">
              The Origin&nbsp;
              {/* Red sparkle icon */}
              <span className="sparkle" aria-hidden="true" />
            </h2>

            <div className="about-body">
              <p className="about-p" data-reveal data-delay="3">
                Founded in the quiet hours of 2021, our agency was born from a
                singular obsession: the belief that the digital world has grown
                too predictable, too &ldquo;safe.&rdquo; We sought a return to
                the bold&mdash;the dramatic&mdash;the noir.
              </p>
              <p className="about-p" data-reveal data-delay="4">
                The name 21FiftyOne is a tribute to the legendary year of
                cinematic transformation and our commitment to the 51st state of
                mind&mdash;a place where creative rebellion meets absolute
                technical mastery.
              </p>
            </div>

            <div className="about-quote" data-reveal data-delay="5">
              <p className="about-quote-label">The Methodology</p>
              <p className="about-quote-text">
                &ldquo;We don&rsquo;t build websites. We engineer digital
                monuments that pulse with life and precision.&rdquo;
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}