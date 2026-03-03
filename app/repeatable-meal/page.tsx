"use client";

import { useState, useMemo } from "react";

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

export default function BowlTrackerPage() {
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

  const grandTotal =
    mainTotal + eggTotal + kefirTotal + strawberryTotal;

  // ----- UI -----

  return (
    <div style={{ padding: 30, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Bowl Calorie Tracker</h1>

      <h2 style={{ textAlign: "center", fontSize: 28 }}>
        Total: {grandTotal.toFixed(1)} kcal
      </h2>

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
              display={`${value} g (${itemCalories.toFixed(1)} kcal)`}
            />
          );
        })}
      </Section>

      {/* Deviled Eggs */}
      <Section title="Deviled Eggs (pieces)" total={eggTotal}>
        <SliderRow
          label="Egg Pieces"
          min={0}
          max={eggGroup.maxPieces}
          step={1}
          value={eggPieces}
          onChange={(val) => setEggPieces(val)}
          display={`${eggPieces} pieces (${eggTotal.toFixed(
            1
          )} kcal)`}
        />
      </Section>

      {/* Kefir & Strawberries */}
      <Section
        title="Kefir & Strawberries"
        total={kefirTotal + strawberryTotal}
      >
        <SliderRow
          label="Whole Milk Kefir"
          min={0}
          max={kefir.maxOunces}
          step={0.1}
          value={kefirOunces}
          onChange={(val) => setKefirOunces(val)}
          display={`${kefirOunces.toFixed(
            1
          )} fl oz (${kefirTotal.toFixed(1)} kcal)`}
        />

        <SliderRow
          label="Strawberries"
          min={0}
          max={strawberries.grams * 2}
          step={1}
          value={strawberryGrams}
          onChange={(val) => setStrawberryGrams(val)}
          display={`${strawberryGrams} g (${strawberryTotal.toFixed(
            1
          )} kcal)`}
        />
      </Section>
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
    <div
      style={{
        background: "#fff",
        padding: 20,
        marginBottom: 25,
        borderRadius: 12,
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
      }}
    >
      <h3>{title}</h3>
      {children}
      <strong>Group Total: {total.toFixed(1)} kcal</strong>
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
    <div style={{ marginBottom: 15 }}>
      <label>{label}</label>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ flex: 1, marginRight: 12 }}
        />
        <span>{display}</span>
      </div>
    </div>
  );
}