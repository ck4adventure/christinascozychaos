"use client";

import { useState, useMemo, useEffect } from "react";

type Item = {
	name: string;
	emoji: string;
	defaultQty: number;
	calories: number;
	unit: string;
	step: number;
	max: number;
};

const BOWL_ITEMS: Item[] = [
	{ name: "Brown Rice",        emoji: "🌾", defaultQty: 63,  calories: 73,  unit: "g",   step: 1,  max: 150 },
	{ name: "Quinoa",            emoji: "✨", defaultQty: 80,  calories: 83,  unit: "g",   step: 1,  max: 200 },
	{ name: "Black Beans",       emoji: "🫘", defaultQty: 100, calories: 50,  unit: "g",   step: 1,  max: 250 },
	{ name: "Sweet Potato",      emoji: "🍠", defaultQty: 150, calories: 63,  unit: "g",   step: 5,  max: 350 },
	{ name: "Spinach",           emoji: "🥬", defaultQty: 90,  calories: 10,  unit: "g",   step: 1,  max: 200 },
	{ name: "Bell Pepper",       emoji: "🫑", defaultQty: 75,  calories: 19,  unit: "g",   step: 1,  max: 200 },
	{ name: "Olive Oil",         emoji: "🫒", defaultQty: 10,  calories: 89,  unit: "g",   step: 1,  max: 30  },
	{ name: "Flaxseed",          emoji: "🌿", defaultQty: 7,   calories: 37,  unit: "g",   step: 1,  max: 20  },
	{ name: "Pepitas",           emoji: "🌻", defaultQty: 20,  calories: 115, unit: "g",   step: 1,  max: 50  },
	{ name: "Tahini",            emoji: "🥣", defaultQty: 30,  calories: 178, unit: "g",   step: 1,  max: 60  },
	{ name: "Nutritional Yeast", emoji: "🧂", defaultQty: 10,  calories: 35,  unit: "g",   step: 1,  max: 30  },
	{ name: "Lemon Juice",       emoji: "🍋", defaultQty: 15,  calories: 2,   unit: "g",   step: 1,  max: 45  },
];

const EGG_ITEMS: Item[] = [
	{ name: "Egg Pieces", emoji: "🥚", defaultQty: 4, calories: 245, unit: "pcs", step: 1, max: 12 },
];

const FRUIT_DEFAULTS = [0, 0, 60];
const FRUIT_ITEMS: Item[] = [
	{ name: "Strawberries",     emoji: "🍓", defaultQty: 150, calories: 48, unit: "g", step: 10, max: 300 },
	{ name: "Wild Blueberries", emoji: "🫐", defaultQty: 75,  calories: 40, unit: "g", step: 5,  max: 200 },
	{ name: "Banana",           emoji: "🍌", defaultQty: 60,  calories: 53, unit: "g", step: 5,  max: 150 },
];

const FERMENT_ITEMS: Item[] = [
	{ name: "Kefir",      emoji: "🥛", defaultQty: 8,  calories: 160, unit: "oz", step: 1, max: 16  },
	{ name: "Sauerkraut", emoji: "🫙", defaultQty: 30, calories: 5,   unit: "g",  step: 5, max: 100 },
];

function groupCalories(items: Item[], values: number[]): number {
	return items.reduce((sum, item, i) => sum + values[i] * (item.calories / item.defaultQty), 0);
}

function Section({ title, total, children }: { title: string; total: number; children: React.ReactNode }) {
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
	label, emoji, min, max, step, value, onChange, unit, calories,
}: {
	label: string; emoji: string; min: number; max: number; step: number;
	value: number; onChange: (val: number) => void; unit: string; calories: number;
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

	return (
		<div className="bowl-row">
			<div className="bowl-row-header">
				<span className="bowl-row-name">{emoji} {label} <span className="bowl-row-unit">({unit})</span></span>
				<span className="bowl-row-value">{calories.toFixed(0)} kcal</span>
			</div>
			<div className="bowl-stepper">
				<button
					className="bowl-stepper-btn"
					onClick={() => onChange(parseFloat(Math.max(min, value - step).toFixed(10)))}
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
					onClick={() => onChange(parseFloat(Math.min(max, value + step).toFixed(10)))}
					aria-label={`Increase ${label}`}
				>
					+
				</button>
			</div>
		</div>
	);
}

export default function CaloriesPage() {
	const [bowlValues, setBowlValues] = useState(BOWL_ITEMS.map((i) => i.defaultQty));
	const [eggValues, setEggValues] = useState(EGG_ITEMS.map((i) => i.defaultQty));
	const [fruitValues, setFruitValues] = useState(FRUIT_DEFAULTS);
	const [fermentValues, setFermentValues] = useState(FERMENT_ITEMS.map((i) => i.defaultQty));

	const bowlTotal = useMemo(() => groupCalories(BOWL_ITEMS, bowlValues), [bowlValues]);
	const eggTotal = useMemo(() => groupCalories(EGG_ITEMS, eggValues), [eggValues]);
	const fruitTotal = useMemo(() => groupCalories(FRUIT_ITEMS, fruitValues), [fruitValues]);
	const fermentTotal = useMemo(() => groupCalories(FERMENT_ITEMS, fermentValues), [fermentValues]);

	const grandTotal = bowlTotal + eggTotal + fruitTotal + fermentTotal;

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
		<div>
			<div className="bowl-header" style={{ paddingTop: 0, paddingBottom: "1.5rem" }}>
				<p className="eyebrow">Daily Nutrition</p>
				<div className="bowl-grand-total">{grandTotal.toFixed(0)}</div>
				<p className="bowl-grand-label">kcal total</p>
			</div>

			<div className="bowl-sections">
				<Section title="Bowl" total={bowlTotal}>
					<div className="bowl-items-grid">
						{BOWL_ITEMS.map((item, index) => {
							const value = bowlValues[index];
							return (
								<NumberInputRow
									key={item.name}
									label={item.name}
									emoji={item.emoji}
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

				<div className="bowl-row-pair">
					<Section title="Deviled Eggs" total={eggTotal}>
						{EGG_ITEMS.map((item, index) => {
							const value = eggValues[index];
							return (
								<NumberInputRow
									key={item.name}
									label={item.name}
									emoji={item.emoji}
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
									emoji={item.emoji}
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
								emoji={item.emoji}
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
	);
}
