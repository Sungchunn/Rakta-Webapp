import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#09090B', // Deep Gunmetal
                foreground: '#EDEDED',
                card: {
                    DEFAULT: '#27272A', // Zinc-900
                    foreground: '#FAFAFA'
                },
                popover: {
                    DEFAULT: '#27272A',
                    foreground: '#FAFAFA'
                },
                primary: {
                    DEFAULT: '#EF4444', // Neon Red (Coral)
                    foreground: '#FFFFFF'
                },
                secondary: {
                    DEFAULT: '#27272A',
                    foreground: '#FAFAFA'
                },
                muted: {
                    DEFAULT: '#27272A',
                    foreground: '#A1A1AA'
                },
                accent: {
                    DEFAULT: '#EF4444',
                    foreground: '#FFFFFF'
                },
                destructive: {
                    DEFAULT: '#7F1D1D',
                    foreground: '#FFFFFF'
                },
                border: '#3F3F46',
                input: '#3F3F46',
                ring: '#EF4444',
                chart: {
                    '1': '#EF4444',
                    '2': '#F87171',
                    '3': '#B91C1C',
                    '4': '#991B1B',
                    '5': '#7F1D1D'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
