"use client";

import { useState } from "react";

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

// ─── Styles ──────────────────────────────────────────────────────────────────

const c = {
  bgPrimary:   "var(--bg-primary,   #FAF3EC)",
  bgSecondary: "var(--bg-secondary, #EFE0D4)",
  bgElevated:  "var(--bg-elevated,  #FDF8F4)",
  plumDeep:    "var(--plum-deep,    #3A2030)",
  plumMid:     "var(--plum-mid,     #7B3F6E)",
  plumLight:   "var(--plum-light,   #C9A8BC)",
  plumSubtle:  "var(--plum-subtle,  #6B4A5E)",
  amber:       "var(--amber,        #C46A00)",
  amberLight:  "var(--amber-light,  #E8A020)",
  textMuted:   "var(--text-muted,   #6B4A5E)",
  border:      "var(--border-soft,  rgba(123,63,110,0.2))",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function RepeatableMealPage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"shopping" | "prep" | "bowl" | "safety">("shopping");

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
    <div style={{ minHeight: "100dvh", background: c.bgPrimary, color: c.plumDeep }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Josefin+Sans:wght@200;300;400&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: rgba(123,63,110,0.2); }
      `}</style>

      {/* Hero */}
      <div style={{
        background: c.bgSecondary,
        borderBottom: `1px solid ${c.border}`,
        padding: "48px 24px 36px",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontSize: "0.68rem", fontWeight: 300,
          letterSpacing: "0.35em", textTransform: "uppercase",
          color: c.amber, marginBottom: "10px",
        }}>
          3-Day Meal Prep
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2.2rem, 6vw, 3.2rem)",
          fontWeight: 300, lineHeight: 1.1,
          color: c.plumDeep, marginBottom: "12px",
        }}>
          The Repeatable Bowl
        </h1>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic", fontSize: "1.1rem",
          color: c.plumSubtle, maxWidth: "480px", margin: "0 auto 20px",
          lineHeight: 1.6,
        }}>
          Six nourishing bowls, two hours of prep, three days of not thinking about food.
        </p>

        {/* Stats row */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "32px",
          flexWrap: "wrap", marginTop: "8px",
        }}>
          {[
            { label: "Bowls", value: "6" },
            { label: "Prep Time", value: "~2 hrs" },
            { label: "Daily Effort", value: "5 min" },
            { label: "Keeps For", value: "3 days" },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.6rem", fontWeight: 600, color: c.amber,
              }}>{value}</div>
              <div style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: "0.65rem", letterSpacing: "0.2em",
                textTransform: "uppercase", color: c.textMuted,
              }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab nav */}
      <div style={{
        display: "flex", justifyContent: "center",
        borderBottom: `1px solid ${c.border}`,
        background: c.bgPrimary,
        position: "sticky", top: 0, zIndex: 20,
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, maxWidth: "140px",
              padding: "14px 8px",
              background: "none", border: "none",
              borderBottom: activeTab === tab.id
                ? `2px solid ${c.amber}`
                : "2px solid transparent",
              fontFamily: "'Josefin Sans', sans-serif",
              fontSize: "0.7rem", letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: activeTab === tab.id ? c.amber : c.textMuted,
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            <span style={{ display: "block", fontSize: "1.1rem", marginBottom: "3px" }}>
              {tab.emoji}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 20px 80px" }}>

        {/* ── SHOPPING LIST ── */}
        {activeTab === "shopping" && (
          <div>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic", color: c.plumSubtle,
              marginBottom: "28px", fontSize: "1rem", lineHeight: 1.6,
            }}>
              Tap items to check them off as you shop.
            </p>

            {Object.entries(shoppingList).map(([category, items]) => (
              <div key={category} style={{ marginBottom: "28px" }}>
                <h2 style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: "0.68rem", fontWeight: 300,
                  letterSpacing: "0.25em", textTransform: "uppercase",
                  color: c.amber, marginBottom: "10px",
                  paddingBottom: "8px",
                  borderBottom: `1px solid ${c.border}`,
                }}>
                  {category}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {items.map((item) => {
                    const key = `${category}-${item.item}`;
                    const checked = checkedItems.has(key);
                    return (
                      <div
                        key={key}
                        onClick={() => toggleCheck(key)}
                        style={{
                          display: "flex", alignItems: "center", gap: "12px",
                          padding: "10px 14px", borderRadius: "10px",
                          background: checked ? "rgba(123,63,110,0.07)" : c.bgElevated,
                          border: `1px solid ${checked ? c.plumLight : c.border}`,
                          cursor: "pointer", transition: "all 0.2s",
                          opacity: checked ? 0.6 : 1,
                        }}
                      >
                        {/* Checkbox */}
                        <div style={{
                          width: 20, height: 20, borderRadius: "5px", flexShrink: 0,
                          border: `2px solid ${checked ? c.plumMid : c.plumLight}`,
                          background: checked ? c.plumMid : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.2s",
                        }}>
                          {checked && <span style={{ color: "white", fontSize: "0.65rem" }}>✓</span>}
                        </div>

                        <div style={{ flex: 1 }}>
                          <span style={{
                            fontFamily: "'Josefin Sans', sans-serif",
                            fontSize: "0.88rem", color: c.plumDeep,
                            textDecoration: checked ? "line-through" : "none",
                          }}>
                            {item.item}
                          </span>
                          {item.note && (
                            <span style={{
                              fontFamily: "'Josefin Sans', sans-serif",
                              fontSize: "0.7rem", color: c.textMuted,
                              marginLeft: "6px", fontStyle: "italic",
                            }}>
                              — {item.note}
                            </span>
                          )}
                        </div>

                        <span style={{
                          fontFamily: "'Josefin Sans', sans-serif",
                          fontSize: "0.78rem", fontWeight: 400,
                          color: c.amber, whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}>
                          {item.amount}
                        </span>
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
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic", color: c.plumSubtle,
              marginBottom: "28px", fontSize: "1rem", lineHeight: 1.6,
            }}>
              Total prep time: ~2 hours. Grains can cook simultaneously. Tap a step to mark it done.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {prepSteps.map((section) => {
                const sectionDone = completedSteps.has(section.number);
                return (
                  <div
                    key={section.number}
                    style={{
                      borderRadius: "14px",
                      border: `1px solid ${sectionDone ? c.plumLight : c.border}`,
                      background: sectionDone ? "rgba(123,63,110,0.05)" : c.bgElevated,
                      overflow: "hidden", transition: "all 0.3s",
                    }}
                  >
                    {/* Section header */}
                    <div
                      onClick={() => toggleStep(section.number)}
                      style={{
                        display: "flex", alignItems: "center", gap: "14px",
                        padding: "14px 16px", cursor: "pointer",
                      }}
                    >
                      <span style={{ fontSize: "1.4rem" }}>{section.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                          <span style={{
                            fontFamily: "'Josefin Sans', sans-serif",
                            fontSize: "0.6rem", letterSpacing: "0.2em",
                            color: c.amber, fontWeight: 300,
                          }}>
                            STEP {section.number}
                          </span>
                          <span style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "1.1rem", fontWeight: 600,
                            color: sectionDone ? c.plumLight : c.plumDeep,
                            textDecoration: sectionDone ? "line-through" : "none",
                          }}>
                            {section.title}
                          </span>
                        </div>
                      </div>
                      <span style={{
                        fontFamily: "'Josefin Sans', sans-serif",
                        fontSize: "0.68rem", letterSpacing: "0.1em",
                        color: c.textMuted,
                      }}>
                        {section.time}
                      </span>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                        border: `2px solid ${sectionDone ? c.plumMid : c.plumLight}`,
                        background: sectionDone ? c.plumMid : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.25s",
                      }}>
                        {sectionDone && <span style={{ color: "white", fontSize: "0.7rem" }}>✓</span>}
                      </div>
                    </div>

                    {/* Steps list */}
                    <div style={{
                      borderTop: `1px solid ${c.border}`,
                      padding: "12px 16px 16px",
                    }}>
                      {section.steps.map((step, i) => (
                        <div key={i} style={{
                          display: "flex", gap: "10px",
                          padding: "5px 0",
                          opacity: sectionDone ? 0.5 : 1,
                        }}>
                          <span style={{
                            fontFamily: "'Josefin Sans', sans-serif",
                            fontSize: "0.68rem", color: c.amber,
                            fontWeight: 300, marginTop: "1px", flexShrink: 0,
                          }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span style={{
                            fontFamily: "'Josefin Sans', sans-serif",
                            fontSize: "0.85rem", color: c.plumSubtle,
                            lineHeight: 1.55,
                          }}>
                            {step}
                          </span>
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
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.5rem", fontWeight: 400, fontStyle: "italic",
              color: c.plumDeep, marginBottom: "6px",
            }}>
              Build Your Bowl
            </h2>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic", color: c.plumSubtle,
              marginBottom: "24px", fontSize: "0.95rem", lineHeight: 1.6,
            }}>
              Layer these into each container. Reheat the base, then add fresh sides before serving.
            </p>

            {/* Bowl layers */}
            <div style={{
              background: c.bgElevated,
              borderRadius: "16px",
              border: `1px solid ${c.border}`,
              overflow: "hidden",
              marginBottom: "28px",
            }}>
              <div style={{
                padding: "12px 16px",
                borderBottom: `1px solid ${c.border}`,
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: "0.68rem", letterSpacing: "0.25em",
                textTransform: "uppercase", color: c.amber,
              }}>
                In Each Container
              </div>
              {bowlLayers.map((layer, i) => (
                <div
                  key={layer.ingredient}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "11px 16px",
                    borderBottom: i < bowlLayers.length - 1 ? `1px solid ${c.border}` : "none",
                  }}
                >
                  <span style={{ fontSize: "1rem", width: "22px", textAlign: "center" }}>
                    {layer.emoji}
                  </span>
                  <span style={{
                    flex: 1, fontFamily: "'Josefin Sans', sans-serif",
                    fontSize: "0.88rem", color: c.plumDeep,
                  }}>
                    {layer.ingredient}
                  </span>
                  <span style={{
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontSize: "0.78rem", color: c.amber, fontWeight: 400,
                  }}>
                    {layer.amount}
                  </span>
                </div>
              ))}
            </div>

            {/* Sides */}
            <h3 style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontSize: "0.68rem", letterSpacing: "0.25em",
              textTransform: "uppercase", color: c.amber,
              marginBottom: "12px",
            }}>
              Serve on the Side
            </h3>
            <div style={{
              background: c.bgElevated, borderRadius: "16px",
              border: `1px solid ${c.border}`, overflow: "hidden",
              marginBottom: "28px",
            }}>
              {sides.map((side, i) => (
                <div
                  key={side.item}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "11px 16px",
                    borderBottom: i < sides.length - 1 ? `1px solid ${c.border}` : "none",
                  }}
                >
                  <span style={{ fontSize: "1rem", width: "22px", textAlign: "center" }}>
                    {side.emoji}
                  </span>
                  <span style={{
                    flex: 1, fontFamily: "'Josefin Sans', sans-serif",
                    fontSize: "0.88rem", color: c.plumDeep,
                  }}>
                    {side.item}
                  </span>
                  <span style={{
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontSize: "0.78rem", color: c.amber,
                  }}>
                    {side.amount}
                  </span>
                </div>
              ))}
            </div>

            {/* Assembly note */}
            <div style={{
              background: "rgba(123,63,110,0.06)",
              borderRadius: "12px",
              border: `1px solid ${c.border}`,
              padding: "16px 18px",
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic", fontSize: "0.95rem",
                color: c.plumSubtle, lineHeight: 1.65, margin: 0,
              }}>
                <strong style={{ fontStyle: "normal", color: c.plumMid }}>Option A:</strong> Pre-assemble all 6 bowls, reheat base and add fresh sides when eating.{" "}
                <strong style={{ fontStyle: "normal", color: c.plumMid }}>Option B:</strong> Store components separately and build each bowl fresh. Either works — choose based on your week.
              </p>
            </div>
          </div>
        )}

        {/* ── STORAGE & SAFETY ── */}
        {activeTab === "safety" && (
          <div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.5rem", fontWeight: 400, fontStyle: "italic",
              color: c.plumDeep, marginBottom: "6px",
            }}>
              Storage & Food Safety
            </h2>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic", color: c.plumSubtle,
              marginBottom: "24px", fontSize: "0.95rem", lineHeight: 1.6,
            }}>
              Everything you need to know to keep your bowls safe and fresh.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {safetyNotes.map((note) => (
                <div
                  key={note.label}
                  style={{
                    display: "flex", gap: "14px", alignItems: "flex-start",
                    padding: "16px", borderRadius: "12px",
                    background: c.bgElevated,
                    border: `1px solid ${c.border}`,
                  }}
                >
                  <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{note.emoji}</span>
                  <div>
                    <div style={{
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontSize: "0.78rem", fontWeight: 400,
                      letterSpacing: "0.08em",
                      color: c.amber, marginBottom: "4px",
                    }}>
                      {note.label}
                    </div>
                    <div style={{
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontSize: "0.84rem", color: c.plumSubtle, lineHeight: 1.55,
                    }}>
                      {note.items}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Prep reminder */}
            <div style={{
              marginTop: "28px",
              background: "rgba(196,106,0,0.07)",
              borderRadius: "12px",
              border: `1px solid rgba(196,106,0,0.2)`,
              padding: "16px 18px",
              textAlign: "center",
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic", fontSize: "1rem",
                color: c.plumSubtle, lineHeight: 1.65, margin: 0,
              }}>
                Prep every <strong style={{ color: c.amber, fontStyle: "normal" }}>3 days</strong> to keep bowls fresh.{" "}
                Strawberries are the only thing that needs daily attention — slice them fresh. 🍓
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}