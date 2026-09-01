"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
	{ id: "build",    label: "The Bowl", emoji: "🥣", href: "/repeatable-bowl/build" },
	{ id: "shopping", label: "Shopping", emoji: "🛒", href: "/repeatable-bowl/shopping" },
	{ id: "prep",     label: "Prep Day", emoji: "👩‍🍳", href: "/repeatable-bowl/prep" },
	{ id: "calories", label: "Calories", emoji: "🍲", href: "/repeatable-bowl/calories" },
	{ id: "storage",  label: "Storage",  emoji: "🧊", href: "/repeatable-bowl/storage" },
];

export default function BowlLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [mounted, setMounted] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="bowl-page prep-page">
			{/* Hero */}
			<div className={`prep-inner ${mounted ? "bowl-visible" : ""}`}>
				<Link href="/" className="btn btn--link mobile-nav-link" style={{ marginBottom: "2.5rem" }}>← Home</Link>
				<div className="prep-hero">
					<p className="eyebrow">2 Meals a Day</p>
					<h1 className="title" style={{ fontSize: "clamp(2.2rem, 6vw, 3.2rem)", marginBottom: "12px" }}>The Infinitely Repeatable Bowl</h1>
					<p className="prep-hero-tagline">
						Six nourishing meals, two hours of prep, three days of not thinking about food.
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
				{children}
			</div>

			{/* Nav */}
			<nav className="nav-tabs nav-tabs--sidebar">
				<div className="nav-brand">
					<span className="nav-brand-icon">🥣</span>
					<span className="nav-brand-text">Infinite Bowl</span>
				</div>
				{tabs.map((tab) => {
					const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
					return (
						<Link
							key={tab.id}
							href={tab.href}
							className={`nav-tab nav-item--sidebar ${active ? "nav-tab--active" : ""}`}
						>
							<span className="nav-tab-icon">{tab.emoji}</span>
							<span>{tab.label}</span>
						</Link>
					);
				})}
			</nav>
		</div>
	);
}
