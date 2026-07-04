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

const optionalFruits = [
	{ item: "Wild blueberries", amount: "75g", emoji: "🫐" },
	{ item: "Banana", amount: "60g, sliced", emoji: "🍌" },
];

export default function BuildPage() {
	return (
		<div>
			<h2 className="card-title prep-section-title">Build Your Bowl</h2>
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
			<h3 className="prep-list-subheader">Optional Fruit Add-Ons</h3>
			<div className="prep-list-card">
				{optionalFruits.map((fruit) => (
					<div key={fruit.item} className="prep-list-row">
						<span className="prep-list-emoji">{fruit.emoji}</span>
						<span className="prep-list-name">{fruit.item}</span>
						<span className="prep-list-amount">{fruit.amount}</span>
					</div>
				))}
			</div>
			<div className="prep-note">
				<p className="prep-note-text">
					<strong className="prep-note-strong">Option A:</strong> Pre-assemble all 6 bowls, reheat base and add fresh sides when eating.
					</p>
				<p className="prep-note-text">
					<strong className="prep-note-strong">Option B:</strong> Store components separately and build each bowl fresh. Either works — choose based on your week.
				</p>
			</div>
		</div>
	);
}
