import React, {
	createContext,
	useState,
	useEffect,
	useMemo,
	ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
	undefined
);

interface ThemeProviderProps {
	children: ReactNode;
}

/**
 * Provides the current theme and a function to toggle between light and dark mode.
 *
 * - The theme is determined by the following order of precedence:
 *   - The user's manually set theme in local storage (if it exists);
 *   - The user's system prefers-color-scheme (if it is set);
 *   - Otherwise, the theme is 'light'.
 * - The theme is stored in local storage when the component mounts and when the theme is changed.
 * - The theme is toggled by adding or removing the 'dark' class from the HTML document's root element.
 * 
 * Note that the current theme is memoized so that it is only recreated when the theme changes.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	const [theme, setTheme] = useState<Theme>(() => {
		const storedTheme = localStorage.getItem('theme');
		const wasDarkModeManuallyToggled = window.matchMedia('(prefers-color-scheme: dark)').matches;

		return (storedTheme as Theme) || (wasDarkModeManuallyToggled ? 'dark' : 'light');
	});

	/**
	 * This was made with Tailwind V4 in mind. Note that this isn't a permalink!
	 * https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually
	 */
	useEffect(() => {
		const root = window.document.documentElement;

		if (theme === 'dark') {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}

		localStorage.setItem('theme', theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((currentTheme) => {
			if (currentTheme === 'light') return 'dark';

			return 'light';
		});
	};

	const current_theme = useMemo(() => ({ theme, toggleTheme }), [theme]);

	return (
		<ThemeContext.Provider value={current_theme}>{children}</ThemeContext.Provider>
	);
};
