import { flushSync } from "react-dom";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const handleToggle = (event) => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!document.startViewTransition || prefersReducedMotion) {
      toggleTheme();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        toggleTheme();
      });
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 650,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {});
  };

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle theme"
      className={`relative flex h-11 w-22 items-center rounded-full p-1 transition-all duration-300 shadow-md hover:shadow-lg ${
        isDark
          ? "bg-linear-to-r from-slate-700 to-slate-800"
          : "bg-linear-to-r from-violet-100 to-indigo-100"
      }`}
    >
      {/* Sun */}
      <Sun
        className={`absolute left-3 h-5 w-5 transition-all duration-300 ${
          isDark
            ? "text-gray-500 rotate-180 scale-75"
            : "text-amber-500 rotate-0 scale-100"
        }`}
      />

      {/* Moon */}
      <Moon
        className={`absolute right-3 h-5 w-5 transition-all duration-300 ${
          isDark
            ? "text-white rotate-0 scale-100"
            : "text-gray-400 -rotate-180 scale-75"
        }`}
      />

      {/* Sliding Thumb */}
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className={`absolute flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg ${
          isDark ? "translate-x-11" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-violet-600" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500" />
        )}
      </motion.div>
    </button>
  );
}