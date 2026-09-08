'use client';

import { useEffect, useState } from 'react';

import './_scss/toggle.scss';

type Theme = 'light' | 'dark';

function getSystemTheme(): Theme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): Theme | null {
    const storedTheme = localStorage.getItem('theme');

    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : null;
}

export default function Toggle() {
    const [theme, setTheme] = useState<Theme | null>(null);

    useEffect(() => {
        const storedTheme = getStoredTheme();
        const initialTheme = storedTheme ?? getSystemTheme();

        setTheme(initialTheme);
        document.documentElement.style.colorScheme = initialTheme;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (event: MediaQueryListEvent) => {
            if (getStoredTheme() !== null) {
                return;
            }

            const newTheme = event.matches ? 'dark' : 'light';

            document.startViewTransition(() => {
                setTheme(newTheme);
                document.documentElement.style.colorScheme = newTheme;
            });
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    const toggleTheme = () => {
        if (theme === null) {
            return;
        }

        const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';

        localStorage.setItem('theme', nextTheme);

        document.startViewTransition(() => {
            setTheme(nextTheme);
            document.documentElement.style.colorScheme = nextTheme;
        });
    };

    if (theme === null) {
        return null;
    }

    return (<button type="button" className={'theme-toggle ' + theme} onClick={toggleTheme}>
        <svg className="sun" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path fill="none" strokeWidth="2" strokeLinecap="round" d="M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M4.93 19.07l1.41-1.41 M17.66 6.34l1.41-1.41"/>
        </svg>
        <svg className="moon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
    </button>);
}