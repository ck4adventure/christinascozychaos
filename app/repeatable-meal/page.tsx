"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Spark, generateSparks } from "../utils/sparks";

type Item = {
  name: string;
  defaultQty: number;
  calories: number;
  unit: string;
  step: number;
  max: number;
};

const floatingOrbs = [
  { size: 280, x: 5, y: 10, delay: 0, duration: 20 },
  { size: 180, x: 75, y: 55, delay: 2, duration: 24 },
  { size: 130, x: 45, y: 75, delay: 5, duration: 17 },
  { size: 220, x: 88, y: 5, delay: 1, duration: 22 },
];

const BOWL_ITEMS: Item[] = [
  { name: "Brown Rice",      defaultQty: 63,  calories: 73,  unit: "g",   step: 1,  max: 150 },
  { name: "Quinoa",          defaultQty: 80,  calories: 83,  unit: "g",   step: 1,  max: 200 },
  { name: "Black Beans",     defaultQty: 100, calories: 50,  unit: "g",   step: 1,  max: 250 },
  { name: "Sweet Potato",    defaultQty: 150, calories: 63,  unit: "g",   step: 5,  max: 350 },
  { name: "Spinach",         defaultQty: 90,  calories: 10,  unit: "g",   step: 1,  max: 200 },
  { name: "Bell Pepper",     defaultQty: 75,  calories: 19,  unit: "g",   step: 1,  max: 200 },
  { name: "Olive Oil",       defaultQty: 10,  calories: 89,  unit: "g",   step: 1,  max: 30  },
  { name: "Flaxseed",        defaultQty: 7,   calories: 37,  unit: "g",   step: 1,  max: 20  },
  { name: "Pepitas",         defaultQty: 20,  calories: 115, unit: "g",   step: 1,  max: 50  },
  { name: "Tahini",          defaultQty: 30,  calories: 178, unit: "g",   step: 1,  max: 60  },
  { name: "Nutritional Yeast", defaultQty: 10, calories: 35, unit: "g",   step: 1,  max: 30  },
  { name: "Lemon Juice",     defaultQty: 15,  calories: 2,   unit: "g",   step: 1,  max: 45  },
];

const EGG_ITEMS: Item[] = [
  { name: "Egg Pieces", defaultQty: 4, calories: 245, unit: "pcs", step: 1, max: 12 },
];

// Strawberries and blueberries default to 0 (optional); banana is included by default
const FRUIT_DEFAULTS = [0, 0, 60];
const FRUIT_ITEMS: Item[] = [
  { name: "Strawberries",     defaultQty: 150, calories: 48, unit: "g", step: 10, max: 300 },
  { name: "Wild Blueberries", defaultQty: 75,  calories: 40, unit: "g", step: 5,  max: 200 },
  { name: "Banana",           defaultQty: 60,  calories: 53, unit: "g", step: 5,  max: 150 },
];

const FERMENT_ITEMS: Item[] = [
  { name: "Kefir",      defaultQty: 8,   calories: 160, unit: "oz", step: 1,  max: 16  },
  { name: "Sauerkraut", defaultQty: 30,  calories: 5,   unit: "g", step: 5,  max: 100 },
];

function groupCalories(items: Item[], values: number[]): number {
  return items.reduce((sum, item, i) => {
    return sum + values[i] * (item.calories / item.defaultQty);
  }, 0);
}

export default function BowlTrackerPage() {
  const [mounted, setMounted] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);

  const [bowlValues, setBowlValues] = useState(BOWL_ITEMS.map((i) => i.defaultQty));
  const [eggValues, setEggValues] = useState(EGG_ITEMS.map((i) => i.defaultQty));
  const [fruitValues, setFruitValues] = useState(FRUIT_DEFAULTS);
  const [fermentValues, setFermentValues] = useState(FERMENT_ITEMS.map((i) => i.defaultQty));

  useEffect(() => {
    setMounted(true);
    setSparks(generateSparks(14));
  }, []);

  const bowlTotal = useMemo(() => groupCalories(BOWL_ITEMS, bowlValues), [bowlValues]);
  const eggTotal = useMemo(() => groupCalories(EGG_ITEMS, eggValues), [eggValues]);
  const fruitTotal = useMemo(() => groupCalories(FRUIT_ITEMS, fruitValues), [fruitValues]);
  const fermentTotal = useMemo(() => groupCalories(FERMENT_ITEMS, fermentValues), [fermentValues]);

  const sideTotal = eggTotal + fruitTotal + fermentTotal;
  const grandTotal = bowlTotal + sideTotal;

  const makeUpdater =
    (setter: React.Dispatch<React.SetStateAction<number[]>>) =>
    (index: number, val: number) =>
      setter((prev) => {
        const next = [...prev];
        next[index] = val;
        return next;
      });

  const updateBowl = makeUpdater(setBowlValues);
  const updateEgg = makeUpdater(setEggValues);
  const updateFruit = makeUpdater(setFruitValues);
  const updateFerment = makeUpdater(setFermentValues);

  return (
    <div className="bowl-page">
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

      <div className={`bowl-inner ${mounted ? "bowl-visible" : ""}`}>
        <Link href="/" className="bowl-back">← Home</Link>

        <div className="bowl-header">
          <p className="bowl-eyebrow">Daily Nutrition</p>
          <h1 className="bowl-title">
            Bowl <em>Calculator</em>
          </h1>
          <div className="divider" style={{ opacity: mounted ? 1 : 0 }} />
          <div className="bowl-grand-total">{grandTotal.toFixed(0)}</div>
          <p className="bowl-grand-label">kcal total</p>
        </div>

        <div className="bowl-sections">
          {/* Bowl — full width, 2-col grid */}
          <Section title="Bowl" total={bowlTotal}>
            <div className="bowl-items-grid">
              {BOWL_ITEMS.map((item, index) => {
                const value = bowlValues[index];
                return (
                  <NumberInputRow
                    key={item.name}
                    label={item.name}
                    min={0}
                    max={item.max}
                    step={item.step}
                    value={value}
                    onChange={(val) => updateBowl(index, val)}
                    unit={item.unit}
                    calories={value * (item.calories / item.defaultQty)}
                  />
                );
              })}
            </div>
          </Section>

          {/* On the Side — Deviled Eggs | Ferments, then Fruits */}
          <div className="bowl-row-pair">
            <Section title="Deviled Eggs" total={eggTotal}>
              {EGG_ITEMS.map((item, index) => {
                const value = eggValues[index];
                return (
                  <NumberInputRow
                    key={item.name}
                    label={item.name}
                    min={0}
                    max={item.max}
                    step={item.step}
                    value={value}
                    onChange={(val) => updateEgg(index, val)}
                    unit={item.unit}
                    calories={value * (item.calories / item.defaultQty)}
                  />
                );
              })}
            </Section>

            <Section title="Ferments" total={fermentTotal}>
              {FERMENT_ITEMS.map((item, index) => {
                const value = fermentValues[index];
                return (
                  <NumberInputRow
                    key={item.name}
                    label={item.name}
                    min={0}
                    max={item.max}
                    step={item.step}
                    value={value}
                    onChange={(val) => updateFerment(index, val)}
                    unit={item.unit}
                    calories={value * (item.calories / item.defaultQty)}
                  />
                );
              })}
            </Section>
          </div>

          <Section title="Fruits" total={fruitTotal}>
            {FRUIT_ITEMS.map((item, index) => {
              const value = fruitValues[index];
              return (
                <NumberInputRow
                  key={item.name}
                  label={item.name}
                  min={0}
                  max={item.max}
                  step={item.step}
                  value={value}
                  onChange={(val) => updateFruit(index, val)}
                  unit={item.unit}
                  calories={value * (item.calories / item.defaultQty)}
                />
              );
            })}
          </Section>
        </div>
      </div>

      <div className="corner corner-tl" />
      <div className="corner corner-br" />
      <div className="bottom-rule" />
    </div>
  );
}

function Section({
  title,
  total,
  children,
}: {
  title: string;
  total: number;
  children: React.ReactNode;
}) {
  return (
    <div className="bowl-card">
      <div className="bowl-card-header">
        <h3 className="bowl-card-title">{title}</h3>
        <span className="bowl-card-total">{total.toFixed(0)} kcal</span>
      </div>
      {children}
    </div>
  );
}

function NumberInputRow({
  label,
  min,
  max,
  step,
  value,
  onChange,
  unit,
  calories,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
  unit: string;
  calories: number;
}) {
  const decimals = step < 1 ? 1 : 0;
  const [inputStr, setInputStr] = useState(value.toFixed(decimals));

  useEffect(() => {
    setInputStr(value.toFixed(decimals));
  }, [value, decimals]);

  const commit = (str: string) => {
    const parsed = parseFloat(str);
    if (!isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    } else {
      setInputStr(value.toFixed(decimals));
    }
  };

  const decrement = () => {
    const next = parseFloat(Math.max(min, value - step).toFixed(10));
    onChange(next);
  };

  const increment = () => {
    const next = parseFloat(Math.min(max, value + step).toFixed(10));
    onChange(next);
  };

  return (
    <div className="bowl-row">
      <div className="bowl-row-header">
        <span className="bowl-row-name">{label} <span className="bowl-row-unit">({unit})</span></span>
        <span className="bowl-row-value">{calories.toFixed(0)} kcal</span>
      </div>
      <div className="bowl-stepper">
        <button
          className="bowl-stepper-btn"
          onClick={decrement}
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <input
          type="number"
          className="bowl-stepper-input"
          value={inputStr}
          onChange={(e) => setInputStr(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commit(inputStr)}
          min={min}
          max={max}
          step={step}
        />
        <button
          className="bowl-stepper-btn"
          onClick={increment}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
