"use client";

import { useState } from "react";

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
	{
		number: "07",
		title: "Optional Fruit Add-Ons",
		time: "5 min",
		emoji: "🫐",
		steps: [
			"Wild blueberries: portion 75g per bowl if using — keep refrigerated, add fresh at serving",
			"Banana: don't prep ahead — slice 60g fresh when building each bowl",
		],
	},
];

export default function PrepPage() {
	const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

	const toggleStep = (key: string) =>
		setCompletedSteps((prev) => {
			const next = new Set(prev);
			next.has(key) ? next.delete(key) : next.add(key);
			return next;
		});

	return (
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
	);
}
