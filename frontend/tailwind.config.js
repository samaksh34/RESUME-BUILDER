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
                background: "var(--color-background)",
                surface: "var(--color-surface)",
                "surface-highlight": "var(--color-surface-highlight)",
                primary: "#8056FF",         // Electric Purple (same for both)
                "primary-dark": "#6D4BFF",  // Gradient Start
                "primary-light": "#8A63FF", // Gradient End
                secondary: "#3CE3FF",       // Cyan Glow (same for both)
                heading: "var(--color-heading)",
                text: "var(--color-text)",
                subtext: "var(--color-subtext)",
                border: "var(--color-border)",
                "input-bg": "var(--color-input-bg)",
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
                'glow': '0 0 20px rgba(128, 86, 255, 0.15)',
                'glow-cyan': '0 0 15px rgba(60, 227, 255, 0.3)',
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
