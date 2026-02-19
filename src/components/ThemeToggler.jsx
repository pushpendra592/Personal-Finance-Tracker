import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggler = () => {
    const { theme, toggleTheme } = useTheme();

    const handleToggle = async (e) => {
        // Fallback for browsers that don't support View Transitions
        if (!document.startViewTransition) {
            toggleTheme();
            return;
        }

        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();

        // Calculate center of the button
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Calculate radius to cover the furthest corner of the screen
        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        );

        const transition = document.startViewTransition(() => {
            toggleTheme();
        });

        await transition.ready;

        // Animate the clip-path
        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`
                ]
            },
            {
                duration: 700,
                easing: 'ease-out',
                pseudoElement: '::view-transition-new(root)'
            }
        );
    };

    return (
        <button
            onClick={handleToggle}
            className="p-2.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-all duration-200"
            aria-label="Toggle Theme"
        >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

export default ThemeToggler;
