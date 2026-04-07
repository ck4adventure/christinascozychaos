"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Spark, generateSparks } from "../utils/sparks";

const floatingOrbs = [
	{ size: 300, x: 8, y: 12, delay: 0, duration: 20 },
	{ size: 200, x: 72, y: 58, delay: 3, duration: 24 },
	{ size: 150, x: 42, y: 78, delay: 6, duration: 17 },
	{ size: 240, x: 86, y: 8, delay: 1.5, duration: 22 },
];

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
	const [sparks, setSparks] = useState<Spark[]>([]);
	const pathname = usePathname();

	useEffect(() => {
		setMounted(true);
		setSparks(generateSparks(20));
	}, []);

	return (
		<div className="bowl-page prep-page">
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

			{sparks.map((spark) => (
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

			{/* Hero */}
			<div className={`prep-inner ${mounted ? "bowl-visible" : ""}`}>
				<Link href="/" className="bowl-back">← Home</Link>
				<div className="prep-hero">
					<p className="prep-hero-eyebrow">3-Day Meal Prep</p>
					<h1 className="prep-hero-title">The Repeatable Bowl</h1>
					<p className="prep-hero-tagline">
						Six nourishing bowls, two hours of prep, three days of not thinking about food.
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
			<nav className="prep-nav">
				<div className="prep-nav-brand">
					<span className="prep-nav-brand-icon">🥣</span>
					<span className="prep-nav-brand-text">Bowl Prep</span>
				</div>
				{tabs.map((tab) => {
					const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
					return (
						<Link
							key={tab.id}
							href={tab.href}
							className={`prep-nav-btn ${active ? "prep-nav-btn--active" : ""}`}
						>
							<span className="prep-nav-icon">{tab.emoji}</span>
							<span className="prep-nav-label">{tab.label}</span>
						</Link>
					);
				})}
			</nav>

			<div className="corner corner-tl" />
			<div className="corner corner-br" />
			<div className="bottom-rule" />
		</div>
	);
}
