"use client";
import { Spark } from "./utils/sparks";

import { useEffect, useState } from "react";
import { generateSparks } from "./utils/sparks";


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

  return (
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
            somewhat organized and wonderfully random.
          </p>

          <p className="subtext">Apps, recipes & everyday chaos — coming together</p>

          <div className="chips">
            <span className="chip">🍜 Recipe Box</span>
            <span className="chip">🥣 Bowl Calculator</span>
            <span className="chip">✅ Chore Tracker</span>
            <span className="chip">✨ More Randomness Soon!</span>
          </div>

          <p className="signature">
            Built with love & <span>more than a few detours</span> by Christina
          </p>
        </div>

        <div className="corner corner-tl" />
        <div className="corner corner-br" />
        <div className="bottom-rule" />
      </div>
  );
}