/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
	content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './packages/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    "./node_modules/astro-cache-embed/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"
  ],
	theme: {
		extend: {},
	},
	plugins: [],
}
