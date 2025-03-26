import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export const ThemeToggle: React.FC = () => {
	const { theme, toggleTheme } = useTheme();
	const { t } = useTranslation();

	const isDarkModeOn = theme === 'dark';

	return (
		<div className="flex items-center ">
			<button
				onClick={toggleTheme}
				className="relative inline-flex items-center h-8 rounded-full w-14 transition-colors focus:outline-none"
				aria-label={isDarkModeOn ? t('theme.toggle_light') : t('theme.toggle_dark')}
				title={isDarkModeOn ? t('theme.toggle_light') : t('theme.toggle_dark')}
			>
				<span className={`absolute inset-0 rounded-full transition-colors bg-gray-200 dark:bg-gray-700  hover:bg-gray-200 dark:hover:bg-gray-600`} />
				<span className={`inline-block h-6 w-6 rounded-full bg-white transition-transform transform translate-x-1 dark:translate-x-6 shadow-md`}>
					{isDarkModeOn ? (
						<FaMoon className="w-5 h-5 mx-auto my-0.5 text-gray-700" />
					) : (
						<FaSun className="w-5 h-5 mx-auto my-0.5 text-gray-700" />
					)}
				</span>
			</button>
			<button
				onClick={toggleTheme}
				className="text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
				aria-label={isDarkModeOn ? t('theme.toggle_light') : t('theme.toggle_dark')}
				title={isDarkModeOn ? t('theme.toggle_light') : t('theme.toggle_dark')}
			>
			</button>
		</div>
	);
};
