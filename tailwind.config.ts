// tailwind.config.ts

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@uploadthing/react/dist/**",
	],
	theme: {
		extend: {
			colors: {
				border: "hsl(var(--border))", // ← this enables border-border
				input: "hsl(var(--input))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: "hsl(var(--primary))",
				// include others if needed
			},
		},
	},
	plugins: [],
};
