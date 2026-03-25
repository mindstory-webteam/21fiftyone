"use client";
import BugSectionEffect from "./Bugsectioneffect"; // adjust import path as needed

interface Step {
  id: number;
  icon: "lightbulb" | "pencil" | "target";
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    icon: "lightbulb",
    title: "Creative Marketing Strategy",
    desc: "Data-driven insights meet bold creative vision for campaigns that perform.",
  },
  {
    id: 2,
    icon: "pencil",
    title: "Branding & Design",
    desc: "Visual identities that capture essence and inspire connection.",
  },
  {
    id: 3,
    icon: "target",
    title: "Campaign Direction",
    desc: "End-to-end creative leadership ensuring cohesive brand storytelling.",
  },
];

function IconLightbulb() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
      stroke="#d42b2b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3C9.858 3 6.5 6.358 6.5 10.5c0 2.71 1.46 5.07 3.636 6.387V19a.5.5 0 0 0 .5.5h6.728a.5.5 0 0 0 .5-.5v-2.113C19.54 15.57 21.5 13.21 21.5 10.5 21.5 6.358 18.142 3 14 3Z"/>
      <path d="M10.5 22.5h7M11.5 25h5"/>
    </svg>
  );
}

function IconPencil() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
      stroke="#d42b2b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.5 3.5a2.121 2.121 0 0 1 3 3L8 21l-5 1.5 1.5-5L19.5 3.5Z"/>
      <path d="M17 6l3 3"/>
    </svg>
  );
}

function IconTarget() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
      stroke="#d42b2b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13" cy="14" r="10"/>
      <circle cx="13" cy="14" r="5.5"/>
      <circle cx="13" cy="14" r="1.8" fill="#d42b2b" stroke="none"/>
      <circle cx="21.5" cy="20.5" r="4.5"/>
      <path d="M20 20.5l1.2 1.2L24 18.5" strokeWidth="1.3"/>
    </svg>
  );
}

const ICONS = {
  lightbulb: <IconLightbulb />,
  pencil:    <IconPencil />,
  target:    <IconTarget />,
};

export default function CreativeStrategySection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,900&family=Barlow:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --red:    #d42b2b;
          --black:  #0d0d0d;
          --bg:     #f8f7f5;
          --muted:  #666;
          --border: rgba(0,0,0,0.09);
          --arrow:  rgba(212,43,43,0.08);
          --arrow-h:rgba(212,43,43,0.14);
        }

        /* ── Section ── */
        .cs-section {
          width: 100%;
          background: var(--bg);
          padding: 80px 0 72px;
        }

        .cs-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 72px;
        }

        /* ── Header row ── */
        .cs-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 52px;
          gap: 40px;
        }
        .cs-header-left { flex: 1; min-width: 0; }

        .cs-sup {
          display: block;
          font-family: 'Barlow', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.28em;
          color: #aaa;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        /* "CREATIVE STRATEGY" solid */
        .cs-h-solid {
          display: block;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(44px, 5.8vw, 84px);
          text-transform: uppercase;
          color: var(--black);
          line-height: 0.9;
          letter-spacing: -0.03em;
        }

        /* "& MARKETING" — red accent */
        .cs-h-accent {
          display: block;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-style: italic;
          font-size: clamp(44px, 5.8vw, 84px);
          text-transform: uppercase;
          color: var(--red);
          line-height: 0.9;
          letter-spacing: -0.03em;
          margin-top: 4px;
        }

        .cs-sub {
          font-family: 'Barlow', sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.75;
          color: var(--muted);
          max-width: 300px;
          margin-top: 20px;
        }

        .cs-header-right {
          font-family: 'Barlow', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.18em;
          color: #bbb;
          white-space: nowrap;
          flex-shrink: 0;
          padding-bottom: 6px;
        }
        .cs-header-right b {
          font-weight: 600;
          color: var(--black);
        }

        /* ── Divider ── */
        .cs-divider {
          width: 100%;
          height: 1px;
          background: var(--border);
          margin-bottom: 48px;
        }

        /* ── Arrow chevron row ── */
        .cs-arrows {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          margin-bottom: 40px;
        }

        .cs-arrow {
          position: relative;
          background: var(--arrow);
          height: 86px;
          display: flex;
          align-items: center;
          justify-content: center;
          clip-path: polygon(0% 0%, calc(100% - 26px) 0%, 100% 50%, calc(100% - 26px) 100%, 0% 100%, 26px 50%);
          transition: background 0.3s ease;
          cursor: default;
        }
        .cs-arrow:first-child {
          clip-path: polygon(0% 0%, calc(100% - 26px) 0%, 100% 50%, calc(100% - 26px) 100%, 0% 100%);
        }
        .cs-arrow:not(:first-child) { margin-left: -2px; }
        .cs-arrow:hover { background: var(--arrow-h); }

        /* Thin red left edge on non-first arrows */
        .cs-arrow:not(:first-child)::before {
          content: '';
          position: absolute;
          left: 24px;
          top: 20%;
          height: 60%;
          width: 1px;
          background: rgba(212,43,43,0.18);
        }

        .cs-arrow-icon {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
        }

        /* ── Step cards ── */
        .cs-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .cs-card { display: flex; flex-direction: column; gap: 0; }

        /* tag + rule row */
        .cs-card-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .cs-card-tag {
          font-family: 'Barlow', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.22em;
          color: var(--red);
          text-transform: uppercase;
        }
        .cs-card-rule {
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .cs-card-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(20px, 2vw, 28px);
          text-transform: uppercase;
          color: var(--black);
          letter-spacing: -0.015em;
          line-height: 1;
          margin-bottom: 12px;
        }

        .cs-card-desc {
          font-family: 'Barlow', sans-serif;
          font-size: 13.5px;
          font-weight: 400;
          line-height: 1.78;
          color: var(--muted);
          max-width: 320px;
        }

        /* Bottom divider */
        .cs-bottom-rule {
          width: 100%;
          height: 1px;
          background: var(--border);
          margin-top: 64px;
        }

        @media (max-width: 860px) {
          .cs-inner { padding: 0 28px; }
          .cs-header { flex-direction: column; align-items: flex-start; }
          .cs-arrows {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .cs-arrow {
            clip-path: polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%) !important;
            margin-left: 0 !important;
            height: 72px;
          }
          .cs-arrow::before { display: none; }
          .cs-cards { grid-template-columns: 1fr; gap: 28px; }
        }
      `}</style>

 <BugSectionEffect
        bugCount={2}
        leafCount={0}
        style={{ width: "100%" }}
      >
      <section className="cs-section" id="creative-strategy">
        <div className="cs-inner">

          {/* ── Header ── */}
          <div className="cs-header">
            <div className="cs-header-left">
              <span className="cs-sup">Our Approach</span>
              <span className="cs-h-solid">CREATIVE STRATEGY</span>
              <span className="cs-h-accent">&amp; MARKETING</span>
              <p className="cs-sub">
                Multidisciplinary thinking that blends data precision
                with cinematic creative ambition.
              </p>
            </div>
            <div className="cs-header-right">
              SERVICES&nbsp;/&nbsp;<b>01</b>&nbsp;—&nbsp;<b>03</b>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="cs-divider" />

          {/* ── Chevron arrows ── */}
          <div className="cs-arrows">
            {STEPS.map((step) => (
              <div className="cs-arrow" key={step.id}>
                <div className="cs-arrow-icon">{ICONS[step.icon]}</div>
              </div>
            ))}
          </div>

          {/* ── Step cards ── */}
          <div className="cs-cards">
            {STEPS.map((step, i) => (
              <div className="cs-card" key={step.id}>
                <div className="cs-card-top">
                  <span className="cs-card-tag">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="cs-card-rule" />
                </div>
                <h3 className="cs-card-title">{step.title}</h3>
                <p className="cs-card-desc">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="cs-bottom-rule" />

        </div>
      </section>
      </BugSectionEffect>
    </>
  );
}