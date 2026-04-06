/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        wv: {
          // Backgrounds
          base:    "#0c1524",
          card:    "#152133",
          sidebar: "#111e2d",
          border:  "#1e3248",
          hover:   "#253d56",
          input:   "#0c1524",
          // Text
          primary:   "#e8f0f8",
          secondary: "#7a90aa",
          // Accents
          green:  "#10b981",
          "green-dark": "#059669",
          red:    "#f43f5e",
          blue:   "#3b82f6",
          purple: "#8b5cf6",
          amber:  "#f59e0b",
          cyan:   "#06b6d4",
          pink:   "#ec4899",
        },
      },
      keyframes: {
        slideUp:  { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        scaleIn:  { from: { opacity: 0, transform: "scale(.95) translateY(8px)" }, to: { opacity: 1, transform: "scale(1) translateY(0)" } },
        bounce3:  { "0%,100%": { transform: "translateY(0)", opacity: .3 }, "50%": { transform: "translateY(-8px)", opacity: 1 } },
        spin:     { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
        pulse2:   { "0%,100%": { boxShadow: "0 0 0 0 rgba(16,185,129,.4)" }, "70%": { boxShadow: "0 0 0 10px rgba(16,185,129,0)" } },
        dot:      { "0%,100%": { transform: "translateY(0)", opacity: .3 }, "50%": { transform: "translateY(-4px)", opacity: 1 } },
        msgIn:    { from: { opacity: 0, transform: "translateY(6px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        chatUp:   { from: { opacity: 0, transform: "translateY(16px) scale(.97)" }, to: { opacity: 1, transform: "translateY(0) scale(1)" } },
      },
      animation: {
        "slide-up":  "slideUp .5s ease both",
        "fade-in":   "fadeIn .3s ease both",
        "scale-in":  "scaleIn .22s cubic-bezier(.34,1.2,.64,1) both",
        "bounce3-0": "bounce3 .85s ease-in-out 0s infinite",
        "bounce3-1": "bounce3 .85s ease-in-out .19s infinite",
        "bounce3-2": "bounce3 .85s ease-in-out .38s infinite",
        "spin-slow": "spin 1s linear infinite",
        "pulse2":    "pulse2 2s infinite",
        "dot-0":     "dot .8s ease-in-out 0s infinite",
        "dot-1":     "dot .8s ease-in-out .15s infinite",
        "dot-2":     "dot .8s ease-in-out .3s infinite",
        "msg-in":    "msgIn .2s ease both",
        "chat-up":   "chatUp .25s cubic-bezier(.34,1.2,.64,1) both",
      },
    },
  },
  plugins: [],
};