// src/components/sidebar/Header.tsx
import React from 'react';
import { FaBolt, FaBars, FaTimes, FaGlobe } from 'react-icons/fa'; // Import menu icons
import { useTheme } from '../../hooks/useTheme';
import { ThemeToggle } from '../acessibility/ToggleTheme';
import { LanguageSelector } from '../acessibility/LanguageSelector';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
	isCollapsed: boolean;
	toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isCollapsed, toggleSidebar }) => {
	const { theme } = useTheme();
	const { t } = useTranslation();

	const isDarkModeOn = theme === 'dark';
	return (
		<>
			<div
				className={`h-16 flex items-center border-b border-gray-200 dark:border-gray-700 ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
					}`}
			>
				<div
					className={`flex items-center transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-64 sm:w-0 sm:hidden' : 'opacity-100'
						}`}
				>
					<FaBolt className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0" />
					<span className="text-xl font-semibold text-gray-800 dark:text-gray-200 truncate">
						Stage App
					</span>
				</div>

				<button
					onClick={toggleSidebar}
					className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
					aria-label={isCollapsed ? 'Open sidebar' : 'Close sidebar'}
				>
					{isCollapsed ? (
						<FaBars className="h-6 w-6 md:hidden" />
					) : (
						<FaTimes className="h-6 w-6 md:hidden" />
					)}

					<FaBars className={`h-6 w-6 hidden md:block ${isCollapsed ? '' : 'md:hidden'}`} />
					<FaTimes className={`h-6 w-6 hidden md:block ${isCollapsed ? 'md:hidden' : ''}`} />
				</button>
			</div>

			<div className="flex flex-wrap items-center justify-center px-4 py-4 border-b border-gray-200 dark:border-gray-700 mt-auto ">
				<div className="flex justify-center w-full mb-4">
					<ThemeToggle />
					{/* this used to have truncate but it looks somewhat better when wrapping */}
					{/* TODO: make this into a label and highlight ThemeToggle */}
					<span
						className={`ml-3 content-center transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 pointer-events-none hidden' : 'opacity-100'}`}
					>
						{isDarkModeOn ? t('theme.toggle_light') : t('theme.toggle_dark')}
					</span>
				</div>

				<div className="flex justify-center w-full">
					{isCollapsed ? (
						<button onClick={toggleSidebar} className="flex justify-center  px-4 py-2 rounded-md transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-gray-700">
							<FaGlobe className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" aria-hidden="true" />
						</button>
					) : (
						<LanguageSelector />
					)}
				</div>
			</div>
		</>
	);
};
export default Header;
