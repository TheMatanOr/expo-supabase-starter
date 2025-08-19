#!/usr/bin/env node

/**
 * This script generates a TypeScript file containing color variables
 * extracted from a global CSS file. It reads the CSS file, extracts
 * HSL color variables defined in the :root selector, and writes them
 * to a TypeScript file in a unified format.
 */

const fs = require("fs");
const path = require("path");

// Paths
// eslint-disable-next-line no-undef
const globalCssPath = path.join(__dirname, "../global.css");
// eslint-disable-next-line no-undef
const colorsTsPath = path.join(__dirname, "../constants/colors.ts");

// Read global.css
if (!fs.existsSync(globalCssPath)) {
	console.error("Error: global.css file not found.");
	process.exit(1);
}

const cssContent = fs.readFileSync(globalCssPath, "utf-8");

// Extract HSL variables from :root only (unified theme)
const rootRegex = /:root\s*{([^}]*)}/;

// Helper function to convert kebab-case to camelCase
const toCamelCase = (str) =>
	str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

const extractColors = (cssBlock) => {
	const hslRegex = /--([\w-]+):\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%;/g;
	const colors = {};
	let match;

	while ((match = hslRegex.exec(cssBlock)) !== null) {
		// eslint-disable-next-line no-unused-vars
		const [_, name, h, s, l] = match;
		colors[toCamelCase(name)] = `hsl(${h}, ${s}%, ${l}%)`;
	}

	return colors;
};

const rootMatch = rootRegex.exec(cssContent);

if (!rootMatch) {
	console.error("Error: No :root selector found in global.css");
	process.exit(1);
}

const unifiedColors = extractColors(rootMatch[1]);

// Generate colors.ts content
const colorsTsContent = `/**
 * This file contains the unified theme colors for the app.
 * No more light/dark switching - just one beautiful theme.
 */

export const colors = ${JSON.stringify(unifiedColors, null, 2)};
`;

// Write to colors.ts
fs.writeFileSync(colorsTsPath, colorsTsContent, "utf-8");
console.log(`✅ colors.ts has been generated at ${colorsTsPath}`);
console.log("🎨 Generated unified theme with no light/dark switching!");
