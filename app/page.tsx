"use client";
import Link from "next/link";

import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="page">
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
            {/* <span className="chip">🍜 Recipe Box</span> */}
            <Link href="/repeatable-bowl" className="chip">🥣 Infinitely Repeatable Meal</Link>
            <Link href="/blossom" className="chip">🌸 Blossom Chore Tracker</Link>
            <Link href="/cascades" className="chip">Cascades Game 🟪🟪🟦</Link>
            <Link href="/writing" className="chip">Writing Tool for Authors 🖋️</Link>
            <Link href="/chord-machine" className="chip">🎹 Chord Machine</Link>
            {/* <span className="chip">✨ More Randomness Soon!</span> */}
          </div>

          <p className="signature">
            Built with love & <span>more than a few detours</span> by Christina
          </p>
        </div>
      </div>
  );
}
