"use client";


import { useEffect, useState } from "react";
import { generateSparks } from "./utils/sparks";

type Spark = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
};

const floatingOrbs = [
  { size: 320, x: 10, y: 15, delay: 0, duration: 18 },
  { size: 200, x: 70, y: 60, delay: 3, duration: 22 },
  { size: 150, x: 40, y: 80, delay: 6, duration: 15 },
  { size: 260, x: 85, y: 10, delay: 1.5, duration: 20 },
  { size: 100, x: 20, y: 50, delay: 4, duration: 25 },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    setMounted(true);
    setSparks(generateSparks(18));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Josefin+Sans:wght@200;300;400&display=swap');

        :root {
          --plum-deep: #2A0E30;
          --plum-mid: #7B3F6E;
          --plum-light: #9B6090;
          --amber: #E8A020;
          --amber-deep: #C46A00;
          --cream: #E8D5C4;
          --cream-light: #F5EAE0;
          --dark: #1A081E;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: var(--dark);
          overflow-x: hidden;
        }

        .page {
          min-height: 100vh;
          background: var(--plum-deep);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Josefin Sans', sans-serif;
        }

        /* Noise texture overlay */
        .page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.4;
          pointer-events: none;
          z-index: 1;
        }

        /* Gradient mesh background */
        .mesh {
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 15% 20%, rgba(123,63,110,0.5) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 85% 75%, rgba(196,106,0,0.25) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(42,14,48,0.8) 0%, transparent 100%),
            radial-gradient(ellipse 70% 40% at 80% 10%, rgba(123,63,110,0.3) 0%, transparent 60%);
          z-index: 0;
        }

        /* Floating orbs */
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          pointer-events: none;
          z-index: 0;
          animation: drift linear infinite;
        }

        @keyframes drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 25px) scale(0.95); }
        }

        /* Sparks */
        .spark {
          position: fixed;
          border-radius: 50%;
          background: var(--amber);
          opacity: 0;
          pointer-events: none;
          z-index: 1;
          animation: sparkle ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.6; transform: scale(1); }
        }

        /* Main content */
        .content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 2rem;
          max-width: 720px;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }

        .content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .eyebrow {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 300;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--amber);
          margin-bottom: 1.5rem;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s;
        }

        .content.visible .eyebrow {
          opacity: 1;
          transform: translateY(0);
        }

        .title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 8vw, 6.5rem);
          font-weight: 300;
          line-height: 1.05;
          color: var(--cream-light);
          letter-spacing: -0.01em;
          margin-bottom: 0.2em;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s;
        }

        .content.visible .title {
          opacity: 1;
          transform: translateY(0);
        }

        .title em {
          font-style: italic;
          color: var(--amber);
        }

        .divider {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--amber), transparent);
          margin: 2rem auto;
          opacity: 0;
          transition: opacity 0.6s ease 0.9s;
        }

        .content.visible .divider {
          opacity: 1;
        }

        .tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          font-weight: 300;
          font-style: italic;
          color: var(--cream);
          opacity: 0;
          line-height: 1.6;
          transition: opacity 0.7s ease 1.1s;
          margin-bottom: 1rem;
        }

        .content.visible .tagline {
          opacity: 0.85;
        }

        .subtext {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 200;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--plum-light);
          opacity: 0;
          transition: opacity 0.7s ease 1.3s;
          margin-bottom: 3rem;
        }

        .content.visible .subtext {
          opacity: 0.9;
        }

        /* Coming soon chips */
        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          margin-bottom: 3.5rem;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.7s ease 1.5s, transform 0.7s ease 1.5s;
        }

        .content.visible .chips {
          opacity: 1;
          transform: translateY(0);
        }

        .chip {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 300;
          padding: 0.5rem 1.1rem;
          border-radius: 999px;
          border: 1px solid rgba(232, 160, 32, 0.3);
          color: var(--amber);
          background: rgba(232, 160, 32, 0.06);
          transition: background 0.3s ease, border-color 0.3s ease;
          cursor: default;
        }

        .chip:hover {
          background: rgba(232, 160, 32, 0.14);
          border-color: rgba(232, 160, 32, 0.6);
        }

        /* Signature */
        .signature {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.85rem;
          font-style: italic;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: var(--plum-light);
          opacity: 0;
          transition: opacity 0.7s ease 1.8s;
        }

        .content.visible .signature {
          opacity: 0.7;
        }

        .signature span {
          color: var(--amber);
          opacity: 0.9;
        }

        /* Bottom decorative line */
        .bottom-rule {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent 0%, var(--amber-deep) 30%, var(--amber) 50%, var(--amber-deep) 70%, transparent 100%);
          z-index: 10;
          opacity: 0.6;
        }

        /* Corner decorations */
        .corner {
          position: fixed;
          width: 60px;
          height: 60px;
          z-index: 10;
          opacity: 0.3;
        }
        .corner-tl { top: 20px; left: 20px; border-top: 1px solid var(--amber); border-left: 1px solid var(--amber); }
        .corner-br { bottom: 20px; right: 20px; border-bottom: 1px solid var(--amber); border-right: 1px solid var(--amber); }
      `}</style>

      <div className="page">
        <div className="mesh" />

        {floatingOrbs.map((orb, i) => (
          <div
            key={i}
            className="orb"
            style={{
              width: orb.size,
              height: orb.size,
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              background: i % 2 === 0 ? "#7B3F6E" : "#C46A00",
              animationDelay: `${orb.delay}s`,
              animationDuration: `${orb.duration}s`,
            }}
          />
        ))}

        {sparks.length > 0 &&
          sparks.map((spark) => (
            <div
              key={spark.id}
              className="spark"
              style={{
                width: spark.size,
                height: spark.size,
                left: `${spark.x}%`,
                top: `${spark.y}%`,
                animationDelay: `${spark.delay}s`,
                animationDuration: `${spark.duration}s`,
              }}
            />
          ))}

        <div className={`content ${mounted ? "visible" : ""}`}>
          <p className="eyebrow">Welcome to</p>

          <h1 className="title">
            Christina&apos;s<br />
            <em>Cozy Chaos</em>
          </h1>

          <div className="divider" />

          <p className="tagline">
            A personal little corner of the internet,<br />
            equal parts organized and wonderfully unhinged.
          </p>

          <p className="subtext">Apps, recipes & everyday chaos — coming together</p>

          <div className="chips">
            <span className="chip">🍜 Recipe Box</span>
            <span className="chip">🥣 Bowl Calculator</span>
            <span className="chip">✅ Chore Tracker</span>
            <span className="chip">✨ More Chaos Soon</span>
          </div>

          <p className="signature">
            Built with love & <span>a little disorder</span> by Christina
          </p>
        </div>

        <div className="corner corner-tl" />
        <div className="corner corner-br" />
        <div className="bottom-rule" />
      </div>
    </>
  );
}