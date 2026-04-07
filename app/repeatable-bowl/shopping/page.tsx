"use client";

import { useState } from "react";

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
	"Fruit": [
		{ item: "Strawberries", amount: "900g / 6 cups", note: "slice fresh before serving" },
		{ item: "Wild blueberries (frozen)", amount: "450g", note: "optional — 75g per bowl" },
		{ item: "Bananas", amount: "3 medium", note: "optional — 60g per bowl, slice fresh" },
	],
};

export default function ShoppingPage() {
	const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

	const toggleCheck = (key: string) =>
		setCheckedItems((prev) => {
			const next = new Set(prev);
			next.has(key) ? next.delete(key) : next.add(key);
			return next;
		});

	return (
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
	);
}
