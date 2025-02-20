/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		colors: {
			"spawn-purple": "#8693FF"
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
