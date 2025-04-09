'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

const sections = ['home', 'features', 'contact us'];

export function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [activeSection, setActiveSection] = useState<string>('home');

	useEffect(() => {
		const handleScroll = () => {
			const offsets = sections.map(id => {
				const element = document.getElementById(id);
				if (!element) return { id, top: Infinity };
				return { id, top: element.offsetTop - window.innerHeight / 3 };
			});

			const current = [...offsets].reverse().find(sec => window.scrollY >= sec.top);
			setActiveSection(current?.id || 'home');
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll();

		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<nav className="fixed top-0 w-full bg-white z-50 shadow">
			<div className="max-w-7xl mx-auto px-20 py-4 flex justify-between items-center">
				<Link href="/" className="flex items-center">
				  <img src="/logo.svg" alt="OpenTask Logo" className="inline" />
				</Link>

				{/* Desktop Nav */}
				<ul className="hidden md:flex gap-6 items-center">
					{sections.map(section => (
						<li key={section}>
							<a
								href={`#${section}`}
								className={clsx(
									'capitalize text-gray-700 hover:text-blue-600 transition',
									activeSection === section && 'font-semibold text-blue-600'
								)}
							>
								{section}
							</a>
						</li>
					))}
					<li>
						<Link
							href="/register"
							className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
						>
							Register
						</Link>
					</li>
				</ul>

				{/* Hamburger */}
				<button
					className="md:hidden flex flex-col gap-1"
					onClick={() => setMenuOpen(prev => !prev)}
					aria-label="Toggle menu"
				>
					<span className="w-6 h-0.5 bg-gray-700" />
					<span className="w-6 h-0.5 bg-gray-700" />
					<span className="w-6 h-0.5 bg-gray-700" />
				</button>
			</div>

			{/* Mobile Menu */}
			{menuOpen && (
				<div className="md:hidden bg-white shadow px-4 pb-4">
					<ul className="flex flex-col gap-3">
						{sections.map(section => (
							<li key={section}>
								<a
									href={`#${section}`}
									className={clsx(
										'block capitalize text-gray-700 hover:text-blue-600 transition',
										activeSection === section && 'font-semibold text-blue-600'
									)}
									onClick={() => setMenuOpen(false)}
								>
									{section}
								</a>
							</li>
						))}
						<li>
							<Link
								href="/register"
								className="inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
								onClick={() => setMenuOpen(false)}
							>
								Register
							</Link>
						</li>
					</ul>
				</div>
			)}
		</nav>
	);
}
