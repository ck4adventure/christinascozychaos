const safetyNotes = [
	{ emoji: "✅", label: "3 days refrigerated", items: "Cooked grains, beans, sweet potato, spinach, deviled eggs, seeds, raw bell pepper" },
	{ emoji: "✅", label: "5–7 days", items: "Sauerkraut, kefir (check expiry)" },
	{ emoji: "⚠️", label: "3 days or freeze", items: "Pre-assembled bowls without fresh additions" },
	{ emoji: "🍓", label: "Strawberries", items: "Slice fresh daily — whole berries keep 5–7 days" },
];

export default function StoragePage() {
	return (
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
	);
}
