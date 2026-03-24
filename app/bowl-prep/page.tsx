"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Spark, generateSparks } from "../utils/sparks";

// ─── Data ────────────────────────────────────────────────────────────────────

const shoppingList = {
  "Grains & Legumes": [
    { item: "Brown jasmine rice", amount: "190g dry", note: "makes 570g cooked" },
    { item: "Quinoa", amount: "240g dry", note: "makes 720g cooked" },
    { item: "Black beans", amount: "200g dry or 2 cans (15oz)", note: "makes 600g cooked" },
  ],
  "Vegetables": [
    { item: "Sweet potatoes", amount: "1080g raw", note: "~3–4 medium" },
    { item: "Fresh spinach", amount: "540g raw", note: "wilts to ~90g per bowl" },
    { item: "Red bell peppers", amount: "3 medium", note: "diced fresh" },
    { item: "Lemons", amount: "3 whole", note: "½ per bowl" },
  ],
  "Fruit": [
    { item: "Strawberries", amount: "900g / 6 cups", note: "slice fresh before serving" },
  ],
  "Protein & Dairy": [
    { item: "Large eggs", amount: "12", note: "boiled weekly" },
    { item: "Mayonnaise", amount: "6 Tbsp", note: "for deviled eggs" },
    { item: "Dijon or yellow mustard", amount: "3 Tbsp", note: "for deviled eggs" },
    { item: "Whole milk kefir", amount: "720g / 24 oz", note: "4 oz per bowl" },
  ],
  "Fats & Seeds": [
    { item: "Extra virgin olive oil", amount: "84g / 6 Tbsp", note: "1 Tbsp per bowl" },
    { item: "Ground flaxseed", amount: "42g / 6 Tbsp", note: "1 Tbsp per bowl" },
    { item: "Roasted pumpkin or sunflower seeds", amount: "60g", note: "10g per bowl" },
  ],
  "Additions": [
    { item: "Nutritional yeast (fortified)", amount: "60g / ½ cup", note: "~1½ Tbsp per bowl" },
    { item: "Sauerkraut", amount: "180g / ¾ cup", note: "30g per bowl" },
    { item: "Iodized salt", amount: "9g / 1½ tsp", note: "¼ tsp per bowl" },
    { item: "Black pepper, smoked paprika, cumin", amount: "to taste", note: "" },
  ],
};

const prepSteps = [
  {
    number: "01",
    title: "Cook Grains",
    time: "45 min",
    emoji: "🌾",
    steps: [
      "Rinse 190g brown rice, cook in 380–475ml water, simmer 40–45 min, steam 10 min → 570g cooked, 95g per bowl",
      "Rinse 240g quinoa, cook in 480ml water, simmer 15–20 min, fluff and cool → 720g cooked, 120g per bowl",
      "Black beans: if dry, soak overnight and cook 60–90 min. If canned, drain and rinse → 600g, 100g per bowl",
    ],
  },
  {
    number: "02",
    title: "Roast Sweet Potatoes",
    time: "30 min",
    emoji: "🍠",
    steps: [
      "Preheat oven to 400°F / 200°C",
      "Peel and cube 1080g sweet potatoes into ½-inch pieces",
      "Toss with 2 Tbsp olive oil, salt, and pepper",
      "Roast 25–30 min, flipping halfway, until tender with caramelized edges",
      "Cool and portion into 6 containers, 180g each",
    ],
  },
  {
    number: "03",
    title: "Sauté Spinach",
    time: "10 min",
    emoji: "🥬",
    steps: [
      "Heat 2 Tbsp olive oil in a large pan over medium heat",
      "Add 540g spinach in batches, wilting each batch",
      "Season lightly with salt",
      "Cool and portion into 6 containers, 90g each",
    ],
  },
  {
    number: "04",
    title: "Deviled Eggs",
    time: "15 min",
    emoji: "🥚",
    steps: [
      "Halve 12 boiled eggs and remove yolks",
      "Mash yolks with 6 Tbsp mayo, 3 Tbsp mustard, salt and pepper to taste",
      "Fill egg whites with yolk mixture",
      "Store 4 deviled egg halves per container",
    ],
  },
  {
    number: "05",
    title: "Dice Bell Peppers",
    time: "5 min",
    emoji: "🫑",
    steps: [
      "Wash and dice 3 red bell peppers",
      "Do not cook — serve raw for crunch and freshness",
      "Store in a single container, portion when assembling",
    ],
  },
  {
    number: "06",
    title: "Portion Remaining",
    time: "10 min",
    emoji: "⚖️",
    steps: [
      "Flaxseed: 7g (1 Tbsp) per bowl",
      "Nutritional yeast: 10g (~1½ Tbsp) per bowl",
      "Sauerkraut: 30g per bowl",
      "Lemons: slice 3 in half, store wrapped — ½ lemon per bowl",
      "Salt: 1.5g (¼ tsp) per bowl",
      "Kefir: 120g (4 oz) per bowl — keep in original container, pour when serving",
    ],
  },
];

const bowlLayers = [
  { ingredient: "Brown rice", amount: "95g", emoji: "🌾" },
  { ingredient: "Quinoa", amount: "120g", emoji: "✨" },
  { ingredient: "Black beans", amount: "100g", emoji: "🫘" },
  { ingredient: "Sweet potato", amount: "180g", emoji: "🍠" },
  { ingredient: "Spinach", amount: "90g", emoji: "🥬" },
  { ingredient: "Ground flaxseed", amount: "1 Tbsp", emoji: "🌿" },
  { ingredient: "Nutritional yeast", amount: "2 Tbsp", emoji: "🧂" },
  { ingredient: "Roasted seeds", amount: "10g", emoji: "🌻" },
  { ingredient: "Olive oil", amount: "1 Tbsp", emoji: "🫒" },
  { ingredient: "Diced bell pepper", amount: "½ cup", emoji: "🫑" },
  { ingredient: "Lemon", amount: "½, squeezed", emoji: "🍋" },
];

const sides = [
  { item: "Deviled eggs", amount: "4 halves", emoji: "🥚" },
  { item: "Sauerkraut", amount: "30g", emoji: "🫙" },
  { item: "Whole milk kefir", amount: "4 oz", emoji: "🥛" },
  { item: "Strawberries", amount: "1 cup, sliced fresh", emoji: "🍓" },
];

const safetyNotes = [
  { emoji: "✅", label: "3 days refrigerated", items: "Cooked grains, beans, sweet potato, spinach, deviled eggs, seeds, raw bell pepper" },
  { emoji: "✅", label: "5–7 days", items: "Sauerkraut, kefir (check expiry)" },
  { emoji: "⚠️", label: "3 days or freeze", items: "Pre-assembled bowls without fresh additions" },
  { emoji: "🍓", label: "Strawberries", items: "Slice fresh daily — whole berries keep 5–7 days" },
];

const floatingOrbs = [
  { size: 300, x: 8,  y: 12, delay: 0,   duration: 20 },
  { size: 200, x: 72, y: 58, delay: 3,   duration: 24 },
  { size: 150, x: 42, y: 78, delay: 6,   duration: 17 },
  { size: 240, x: 86, y: 8,  delay: 1.5, duration: 22 },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function BowlPrepPage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"shopping" | "prep" | "bowl" | "safety">("shopping");
  const [mounted, setMounted] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    setMounted(true);
    setSparks(generateSparks(20));
  }, []);

  const toggleCheck = (key: string) =>
    setCheckedItems((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const toggleStep = (key: string) =>
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const tabs = [
    { id: "shopping", label: "Shopping", emoji: "🛒" },
    { id: "prep",     label: "Prep Day", emoji: "👩‍🍳" },
    { id: "bowl",     label: "The Bowl", emoji: "🥣" },
    { id: "safety",   label: "Storage",  emoji: "🧊" },
  ] as const;

  return (
    <div className="bowl-page prep-page">
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

      {sparks.map((spark) => (
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

      {/* Hero */}
      <div className={`prep-inner ${mounted ? "bowl-visible" : ""}`}>
        <Link href="/" className="bowl-back">← Home</Link>
        <div className="prep-hero">
          <p className="prep-hero-eyebrow">3-Day Meal Prep</p>
          <h1 className="prep-hero-title">The Repeatable Bowl</h1>
          <p className="prep-hero-tagline">
            Six nourishing bowls, two hours of prep, three days of not thinking about food.
          </p>
          <div className="prep-stats">
            {[
              { label: "Bowls",        value: "6" },
              { label: "Prep Time",    value: "~2 hrs" },
              { label: "Daily Effort", value: "5 min" },
              { label: "Keeps For",    value: "3 days" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="prep-stat-value">{value}</div>
                <div className="prep-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="prep-content">

        {/* ── SHOPPING LIST ── */}
        {activeTab === "shopping" && (
          <div>
            <p className="prep-intro">Tap items to check them off as you shop.</p>
            {Object.entries(shoppingList).map(([category, items]) => (
              <div key={category} className="prep-category-group">
                <h2 className="prep-category-label">{category}</h2>
                <div className="prep-item-list">
                  {items.map((item) => {
                    const key = `${category}-${item.item}`;
                    const checked = checkedItems.has(key);
                    return (
                      <div
                        key={key}
                        onClick={() => toggleCheck(key)}
                        className={`prep-item ${checked ? "prep-item--checked" : ""}`}
                      >
                        <div className={`prep-checkbox ${checked ? "prep-checkbox--checked" : ""}`}>
                          {checked && <span className="prep-checkbox-tick">✓</span>}
                        </div>
                        <div className="prep-item-text">
                          <span className={`prep-item-name ${checked ? "prep-item-name--checked" : ""}`}>
                            {item.item}
                          </span>
                          {item.note && (
                            <span className="prep-item-note">— {item.note}</span>
                          )}
                        </div>
                        <span className="prep-item-amount">{item.amount}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── PREP STEPS ── */}
        {activeTab === "prep" && (
          <div>
            <p className="prep-intro">
              Total prep time: ~2 hours. Grains can cook simultaneously. Tap a step to mark it done.
            </p>
            <div className="prep-steps">
              {prepSteps.map((section) => {
                const done = completedSteps.has(section.number);
                return (
                  <div key={section.number} className={`prep-step ${done ? "prep-step--done" : ""}`}>
                    <div className="prep-step-header" onClick={() => toggleStep(section.number)}>
                      <span>{section.emoji}</span>
                      <div className="prep-step-meta">
                        <span className="prep-step-number">STEP {section.number}</span>
                        <span className={`prep-step-title ${done ? "prep-step-title--done" : ""}`}>
                          {section.title}
                        </span>
                      </div>
                      <span className="prep-step-time">{section.time}</span>
                      <div className={`prep-step-check ${done ? "prep-step-check--done" : ""}`}>
                        {done && <span className="prep-checkbox-tick">✓</span>}
                      </div>
                    </div>
                    <div className="prep-step-body">
                      {section.steps.map((step, i) => (
                        <div key={i} className={`prep-step-line ${done ? "prep-step-line--done" : ""}`}>
                          <span className="prep-step-line-num">{String(i + 1).padStart(2, "0")}</span>
                          <span className="prep-step-line-text">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── THE BOWL ── */}
        {activeTab === "bowl" && (
          <div>
            <h2 className="prep-section-title">Build Your Bowl</h2>
            <p className="prep-intro">
              Layer these into each container. Reheat the base, then add fresh sides before serving.
            </p>
            <div className="prep-list-card">
              <div className="prep-list-header">In Each Container</div>
              {bowlLayers.map((layer) => (
                <div key={layer.ingredient} className="prep-list-row">
                  <span className="prep-list-emoji">{layer.emoji}</span>
                  <span className="prep-list-name">{layer.ingredient}</span>
                  <span className="prep-list-amount">{layer.amount}</span>
                </div>
              ))}
            </div>
            <h3 className="prep-list-subheader">Serve on the Side</h3>
            <div className="prep-list-card">
              {sides.map((side) => (
                <div key={side.item} className="prep-list-row">
                  <span className="prep-list-emoji">{side.emoji}</span>
                  <span className="prep-list-name">{side.item}</span>
                  <span className="prep-list-amount">{side.amount}</span>
                </div>
              ))}
            </div>
            <div className="prep-note">
              <p className="prep-note-text">
                <strong className="prep-note-strong">Option A:</strong> Pre-assemble all 6 bowls, reheat base and add fresh sides when eating.{" "}
                <strong className="prep-note-strong">Option B:</strong> Store components separately and build each bowl fresh. Either works — choose based on your week.
              </p>
            </div>
          </div>
        )}

        {/* ── STORAGE & SAFETY ── */}
        {activeTab === "safety" && (
          <div>
            <h2 className="prep-section-title">Storage & Food Safety</h2>
            <p className="prep-intro">
              Everything you need to know to keep your bowls safe and fresh.
            </p>
            <div className="prep-storage-list">
              {safetyNotes.map((note) => (
                <div key={note.label} className="prep-storage-item">
                  <span>{note.emoji}</span>
                  <div>
                    <div className="prep-storage-label">{note.label}</div>
                    <div className="prep-storage-text">{note.items}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="prep-note prep-note--amber">
              <p className="prep-note-text">
                Prep every <strong style={{ color: "var(--amber)", fontStyle: "normal" }}>3 days</strong> to keep bowls fresh.{" "}
                Strawberries are the only thing that needs daily attention — slice them fresh. 🍓
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav / desktop sidebar */}
      <nav className="prep-nav">
        <div className="prep-nav-brand">
          <span className="prep-nav-brand-icon">🛒</span>
          <span className="prep-nav-brand-text">Bowl Prep</span>
        </div>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`prep-nav-btn ${activeTab === tab.id ? "prep-nav-btn--active" : ""}`}
          >
            <span className="prep-nav-icon">{tab.emoji}</span>
            <span className="prep-nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="corner corner-tl" />
      <div className="corner corner-br" />
      <div className="bottom-rule" />
    </div>
  );
}
