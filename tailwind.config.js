/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
                accent: {
                    DEFAULT: '#6366f1',
                    light: '#818cf8',
                    dark: '#4f46e5',
                },
                background: {
                    DEFAULT: '#fafbfc',
                    surface: '#ffffff',
                    elevated: '#f8fafc',
                },
                border: {
                    DEFAULT: '#e2e8f0',
                    focus: '#3b82f6',
                    hover: '#cbd5e1',
                },
                text: {
                    primary: '#0f172a',
                    secondary: '#475569',
                    tertiary: '#94a3b8',
                    muted: '#64748b',
                },
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
            },
            spacing: {
                '4.5': '18px',
                '5.5': '22px',
                '18': '4.5rem',
                '19': '4.75rem',
            },
            fontSize: {
                'xs': '12px',
                'sm': '13px',
                'base': '14px',
                'lg': '16px',
                'xl': '18px',
                '2xl': '20px',
                '3xl': '24px',
            },
            borderRadius: {
                'sm': '8px',
                'md': '10px',
                'lg': '12px',
                'xl': '16px',
            },
            boxShadow: {
                'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
                'bounce-subtle': 'bounceSubtle 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                pulseSubtle: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-2px)' },
                },
            },
            transitionTimingFunction: {
                'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
                'ease-in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
            },
        },
    },
    plugins: [],
}
