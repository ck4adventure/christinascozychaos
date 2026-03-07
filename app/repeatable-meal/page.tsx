"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Spark, generateSparks } from "../utils/sparks";

type SolidItem = {
  name: string;
  grams: number;
  calories: number;
};

type LiquidItem = {
  name: string;
  ounces: number;
  maxOunces: number;
  gramsPerOunce: number;
  calories: number; // calories for referenceGrams
  referenceGrams: number;
};

type EggGroup = {
  defaultPieces: number;
  maxPieces: number;
  caloriesPerPiece: number;
};

const floatingOrbs = [
  { size: 280, x: 5, y: 10, delay: 0, duration: 20 },
  { size: 180, x: 75, y: 55, delay: 2, duration: 24 },
  { size: 130, x: 45, y: 75, delay: 5, duration: 17 },
  { size: 220, x: 88, y: 5, delay: 1, duration: 22 },
];

export default function BowlTrackerPage() {
  const [mounted, setMounted] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);

  // ----- Main Bowl -----
  const [main, setMain] = useState<SolidItem[]>([
    { name: "Brown Rice", grams: 75, calories: 97 },
    { name: "Black Beans", grams: 80, calories: 105 },
    { name: "Quinoa", grams: 70, calories: 84 },
    { name: "Spinach", grams: 70, calories: 20 },
    { name: "Red Bell Pepper", grams: 80, calories: 23 },
    { name: "Pepitas", grams: 15, calories: 86 },
    { name: "Nutritional Yeast", grams: 10, calories: 40 },
    { name: "Flaxseed", grams: 10, calories: 55 },
    { name: "Olive Oil", grams: 5, calories: 45 },
    { name: "Lemon Juice", grams: 20, calories: 5 },
  ]);

  // Track current gram values separately
  const [mainValues, setMainValues] = useState(
    main.map((item) => item.grams)
  );

  // ----- Deviled Eggs -----
  const eggGroup: EggGroup = {
    defaultPieces: 4,
    maxPieces: 8,
    caloriesPerPiece: (140 + 70 + 5) / 4,
  };

  const [eggPieces, setEggPieces] = useState(eggGroup.defaultPieces);

  // ----- Kefir & Strawberries -----
  const [kefirOunces, setKefirOunces] = useState(4);

  const strawberries: SolidItem = {
    name: "Strawberries",
    grams: 170,
    calories: 55,
  };

  const [strawberryGrams, setStrawberryGrams] = useState(170);

  const kefir: LiquidItem = {
    name: "Whole Milk Kefir",
    ounces: 4,
    maxOunces: 8,
    gramsPerOunce: 29.57,
    calories: 75,
    referenceGrams: 120,
  };

  useEffect(() => {
    setMounted(true);
    setSparks(generateSparks(14));
  }, []);

  // ----- Calculations -----

  const mainTotal = useMemo(() => {
    return main.reduce((sum, item, index) => {
      const grams = mainValues[index];
      const calPerGram = item.calories / item.grams;
      return sum + grams * calPerGram;
    }, 0);
  }, [main, mainValues]);

  const eggTotal = eggPieces * eggGroup.caloriesPerPiece;

  const kefirTotal = useMemo(() => {
    const grams = kefirOunces * kefir.gramsPerOunce;
    const calPerGram = kefir.calories / kefir.referenceGrams;
    return grams * calPerGram;
  }, [kefirOunces]);

  const strawberryTotal = useMemo(() => {
    const calPerGram = strawberries.calories / strawberries.grams;
    return strawberryGrams * calPerGram;
  }, [strawberryGrams]);

  const grandTotal = mainTotal + eggTotal + kefirTotal + strawberryTotal;

  // ----- UI -----

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

        {/* Main Bowl */}
        <Section title="Main Bowl" total={mainTotal}>
          {main.map((item, index) => {
            const value = mainValues[index];
            const calPerGram = item.calories / item.grams;
            const itemCalories = value * calPerGram;

            return (
              <SliderRow
                key={item.name}
                label={item.name}
                min={0}
                max={item.grams * 2}
                step={1}
                value={value}
                onChange={(val) => {
                  const updated = [...mainValues];
                  updated[index] = val;
                  setMainValues(updated);
                }}
                display={`${value}g · ${itemCalories.toFixed(0)} kcal`}
              />
            );
          })}
        </Section>

        {/* Deviled Eggs */}
        <Section title="Deviled Eggs" total={eggTotal}>
          <SliderRow
            label="Egg Pieces"
            min={0}
            max={eggGroup.maxPieces}
            step={1}
            value={eggPieces}
            onChange={(val) => setEggPieces(val)}
            display={`${eggPieces} pieces · ${eggTotal.toFixed(0)} kcal`}
          />
        </Section>

        {/* Kefir & Strawberries */}
        <Section title="Kefir & Strawberries" total={kefirTotal + strawberryTotal}>
          <SliderRow
            label="Whole Milk Kefir"
            min={0}
            max={kefir.maxOunces}
            step={0.1}
            value={kefirOunces}
            onChange={(val) => setKefirOunces(val)}
            display={`${kefirOunces.toFixed(1)} fl oz · ${kefirTotal.toFixed(0)} kcal`}
          />
          <SliderRow
            label="Strawberries"
            min={0}
            max={strawberries.grams * 2}
            step={1}
            value={strawberryGrams}
            onChange={(val) => setStrawberryGrams(val)}
            display={`${strawberryGrams}g · ${strawberryTotal.toFixed(0)} kcal`}
          />
        </Section>
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

function SliderRow({
  label,
  min,
  max,
  step,
  value,
  onChange,
  display,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
  display: string;
}) {
  return (
    <div className="bowl-row">
      <div className="bowl-row-header">
        <span className="bowl-row-name">{label}</span>
        <span className="bowl-row-value">{display}</span>
      </div>
      <input
        type="range"
        className="bowl-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
