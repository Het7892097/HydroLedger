/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#004030',
                primary2: '#4A9782',
                secondary: '#DCD0A8',
                secondary2: '#FFF9E5',
            },
        },
        plugins: [],
    }
}