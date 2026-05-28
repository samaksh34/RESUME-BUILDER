/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: "rgb(var(--color-background) / <alpha-value>)",
                surface: "rgb(var(--color-surface) / <alpha-value>)",
                "surface-highlight": "rgb(var(--color-surface-highlight) / <alpha-value>)",
                "surface-elevated": "rgb(var(--color-surface-elevated) / <alpha-value>)",
                primary: "#6366f1",         // Muted Indigo
                "primary-dark": "#4f46e5",  // Dark Indigo
                "primary-light": "#7376ff", // Light Indigo
                "accent-hover": "#7376ff",  // Indigo Hover
                secondary: "#71717a",       // Muted Zinc
                heading: "rgb(var(--color-heading) / <alpha-value>)",
                text: "rgb(var(--color-text) / <alpha-value>)",
                subtext: "rgb(var(--color-subtext) / <alpha-value>)",
                border: "rgb(var(--color-border) / <alpha-value>)",
                "input-bg": "rgb(var(--color-input-bg) / <alpha-value>)",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Merriweather', 'serif'],
                display: ['Plus Jakarta Sans', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'card-dark': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
                'glow': '0 0 8px rgba(99, 102, 241, 0.05)',
                'glow-cyan': 'none',
                'button': '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
            },
            borderRadius: {
                'xl': '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            maxWidth: {
                '8xl': '1600px',
            },
        },
    },
    plugins: [],
}
