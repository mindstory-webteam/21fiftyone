import FloatingNavbar from "@/component/Floatingnavbar";
import Footer from "@/component/Footer";
import ServicesSection from "@/component/Servicessection";
import FeaturedCaseStudy from "@/component/Featuredcasestudy";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <FloatingNavbar />
      < FeaturedCaseStudy />

      <ServicesSection
        sectionEyebrow="What We Do"
        sectionTitle="Services Built Infor the"
        sectionTitleAccent="Future."
        sectionDesc="Every engagement is a precision instrument. We build digital products that outlast trends and outperform expectations."
        footerLabel="Engineered with Precision"
        services={[
          {
            id: 1,
            eyebrow: "Service 01",
            heroTitle: "Brand Identity\nCrafted for",
            heroTitleAccent: "Legacy.",
            heroDesc:
              "We build brand systems that outlast trends — rooted in strategy, expressed through obsessive craft. From visual language to verbal identity, every element is engineered to own the room.",
            heroVideo: "/videos/video-1.webm",
            heroPoints: [
              "Visual identity systems that scale across every surface",
              "Tone of voice that feels unmistakably yours",
              "Strategy-first — beauty is just the output",
              "Built for longevity, not the next trend cycle",
              "From logo to brand manifesto, end-to-end",
            ],
            accentColor: "#c8372d",
            ritualLabel: "The Ritual.",
            ritualTagline: "A THREE-STEP PROCESS FOR BRAND CREATION",
            ritualSteps: [
              {
                num: "01",
                title: "Immersion",
                desc: "We embed ourselves in your world — your competitors, your customers, your category tensions — until we understand what only you can own.",
              },
              {
                num: "02",
                title: "Positioning",
                desc: "We locate the strategic white space where your brand can live with authority. One clear idea that everything else unfolds from.",
              },
              {
                num: "03",
                title: "Expression",
                desc: "Logo systems, typography, colour, tone of voice — every touchpoint built to be unmistakable at a glance and unforgettable over time.",
              },
            ],
            deliverablesTitle: "The\nDeliverables.",
            deliverables: [
              { label: "Brand Strategy & Positioning" },
              { label: "Visual Identity System" },
              { label: "Typography & Colour Palette" },
              { label: "Tone of Voice Guidelines" },
              { label: "Brand Standards Book" },
              { label: "Asset Library" },
            ],
            faq: [
              {
                question: "How long does a brand identity project take?",
                answer:
                  "Most brand identity engagements run 8–12 weeks from kickoff to final delivery. Complex multi-brand systems or global rollouts may extend to 16 weeks. We'll scope the timeline precisely during discovery.",
              },
              {
                question: "Do you work with early-stage startups or only established brands?",
                answer:
                  "Both. Early-stage work tends to be more exploratory — we help you find your positioning before expressing it. Established brand refreshes are more surgical. The process adapts to where you are.",
              },
              {
                question: "What if we already have a logo but need everything else?",
                answer:
                  "We can work with existing marks. We'll audit what you have, identify gaps, and build the surrounding system — colour, type, voice, guidelines — around what's already working.",
              },
              {
                question: "Will we own all the final files?",
                answer:
                  "Yes. On project completion you receive full IP ownership and all source files — Figma, AI, EPS, and any additional formats you need. Nothing is held back.",
              },
              {
                question: "Can you also handle the website after the brand is done?",
                answer:
                  "Absolutely. Many clients move straight from brand into digital — we keep the same team on the project so nothing gets lost in translation between strategy and execution.",
              },
            ],
            ctaLabel: "View Brand Work",
            ctaHref: "/work/brand",
          },
          {
            id: 2,
            eyebrow: "Service 02",
            heroTitle: "Campaigns That\nMove",
            heroTitleAccent: "Culture.",
            heroDesc:
              "Ideas that don't just interrupt — they insert themselves into the cultural conversation. We conceive and produce campaigns that earn attention rather than buy it.",
            heroVideo: "/videos/video-2.webm",
            heroPoints: [
              "Hero films that become references, not just ads",
              "Editorial photography with a cinematic point of view",
              "Multi-channel rollouts built for maximum resonance",
              "AI-assisted production without losing the human touch",
              "From a 60-second film to a full 360° campaign",
            ],
            accentColor: "#c8372d",
            ritualLabel: "The Method.",
            ritualTagline: "THREE STAGES OF CAMPAIGN ALCHEMY",
            ritualSteps: [
              {
                num: "01",
                title: "Cultural Mapping",
                desc: "We read the room — the zeitgeist, the codes, the micro-tensions your audience carries — to find the creative crack where your story can enter.",
              },
              {
                num: "02",
                title: "Concept",
                desc: "One irreducible idea. Pressure-tested across every medium and moment until it holds under scrutiny and dazzles under lights.",
              },
              {
                num: "03",
                title: "Production",
                desc: "Film, photography, digital, OOH, experiential — we produce at the highest level and orchestrate the release for maximum resonance.",
              },
            ],
            deliverablesTitle: "The\nDeliverables.",
            deliverables: [
              { label: "Campaign Concept & Strategy" },
              { label: "Hero Film & Cutdowns" },
              { label: "Editorial Photography" },
              { label: "Digital & Social Formats" },
              { label: "OOH & Print Assets" },
              { label: "Launch Playbook" },
            ],
            faq: [
              {
                question: "Do you handle full production or just creative direction?",
                answer:
                  "We do both. We can lead full end-to-end production — director, crew, post — or plug in as creative directors on your existing production setup. Most clients prefer the former for consistency.",
              },
              {
                question: "How do you approach luxury vs mass-market campaigns?",
                answer:
                  "The principles are the same — find a true cultural tension and create something that earns its place in the conversation. The execution differs: luxury demands restraint and craft; mass-market rewards boldness and accessibility.",
              },
              {
                question: "Can you work with our existing media agency?",
                answer:
                  "Yes. We focus on creative and production. If you have a media partner handling buying and placement, we'll collaborate with them directly to ensure the creative is built for each channel.",
              },
              {
                question: "What's your minimum budget for a campaign?",
                answer:
                  "Creative and strategy engagements start from £40k. Full productions typically start from £120k depending on scope. We'll always tell you what's achievable at your budget rather than over-promise.",
              },
            ],
            ctaLabel: "View Campaign Work",
            ctaHref: "/work/campaigns",
          },
          {
            id: 3,
            eyebrow: "Service 03",
            heroTitle: "Digital Worlds\nBuilt to",
            heroTitleAccent: "Inhabit.",
            heroDesc:
              "We design and build digital experiences that feel like entering a world, not visiting a website. Real-time 3D, immersive interfaces, AI-driven interaction — the future of luxury presence online.",
            heroVideo: "/videos/video-3.webm",
            heroPoints: [
              "WebGL and real-time 3D environments that run in-browser",
              "UX designed as narrative, not just navigation",
              "AI-driven personalisation baked into the architecture",
              "Design systems that scale from landing page to ecosystem",
              "Obsessively optimised — fast on every device, every connection",
            ],
            accentColor: "#c8372d",
            ritualLabel: "The Process.",
            ritualTagline: "THREE PILLARS OF DIGITAL CRAFT",
            ritualSteps: [
              {
                num: "01",
                title: "Experience Design",
                desc: "We map every moment of the user journey — not as a flow but as a narrative arc — so each interaction builds desire rather than just delivering information.",
              },
              {
                num: "02",
                title: "Creative Technology",
                desc: "WebGL, real-time 3D, generative AI, spatial audio — we select and combine technologies for their expressive potential, not their novelty.",
              },
              {
                num: "03",
                title: "Build & Optimise",
                desc: "Production-grade code, obsessively optimised. We deliver experiences that perform flawlessly across every device and load in a heartbeat.",
              },
            ],
            deliverablesTitle: "The\nDeliverables.",
            deliverables: [
              { label: "UX Strategy & Wireframes" },
              { label: "UI Design System" },
              { label: "Immersive Web Experience" },
              { label: "3D / WebGL Environments" },
              { label: "CMS Integration" },
              { label: "Performance & QA Report" },
            ],
            faq: [
              {
                question: "What tech stack do you build on?",
                answer:
                  "We're stack-agnostic but have deep expertise in Next.js, Three.js, WebGL, GSAP, and headless CMS architectures (Sanity, Contentful). We choose the right tools for the project — not the ones we're most comfortable with.",
              },
              {
                question: "Do you offer ongoing support after launch?",
                answer:
                  "Yes. We offer retainer arrangements for ongoing development, content updates, and performance monitoring. Most clients stay on a light retainer to handle post-launch iterations.",
              },
              {
                question: "Can you work with our internal dev team?",
                answer:
                  "Absolutely. We can hand off design and motion specs for your team to build, lead the build with your team embedded, or take the whole thing end-to-end. We've done all three successfully.",
              },
              {
                question: "How do you handle accessibility?",
                answer:
                  "Accessibility is built in from day one, not retrofitted at the end. We design and build to WCAG 2.1 AA as standard. For public sector or regulated clients, we can target AAA compliance.",
              },
              {
                question: "What does a typical digital project timeline look like?",
                answer:
                  "Discovery and UX typically takes 3–4 weeks. Design runs 4–6 weeks. Build and QA is 6–10 weeks depending on complexity. Most projects ship in 16–20 weeks from kickoff to launch.",
              },
            ],
            ctaLabel: "View Digital Work",
            ctaHref: "/work/digital",
          },
        ]}
      />

      <Footer />
    </div>
  );
}