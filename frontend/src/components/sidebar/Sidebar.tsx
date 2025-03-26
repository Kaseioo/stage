// src/components/sidebar/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
	FaTasks,
	FaChartPie,
	FaCog,
	FaQuestionCircle,
} from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

interface SidebarProps {
	onLogout: () => void;
	isCollapsed: boolean;
	toggleSidebar: () => void;
}

const baseLinkStyle = 'flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-md transition-colors duration-150';
const selectedPageLinkStyle = 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium';
const notSelectedPageLinkStyle = 'hover:bg-gray-200 dark:hover:bg-gray-700';

export const Sidebar: React.FC<SidebarProps> = ({
	onLogout,
	isCollapsed,
	toggleSidebar,
}) => {
	const { t } = useTranslation();

	const getLinkHighlightStyle = ({ isActive }: { isActive: boolean }) =>
		`${baseLinkStyle} ${isCollapsed ? 'justify-center px-2' : 'px-4'} ${isActive ? selectedPageLinkStyle : notSelectedPageLinkStyle}`;

	return (
		<aside
			className={`bg-white dark:bg-gray-800 shadow-md flex flex-col h-screen transition-all duration-300 ease-in-out fixed md:relative z-20 ${ // Fixed for mobile, relative for md+
				isCollapsed ? 'w-20' : 'w-64 lg:w-72'
				} ${!isCollapsed ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`} // Slide in/out on mobile
		>

			<Header isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

			<nav className={`flex-1 py-4 space-y-2 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'px-2' : 'px-4'}`}>
				<NavLink to="/processes" className={getLinkHighlightStyle} title={isCollapsed ? t('sidebar.processes') : undefined}>
					<FaTasks className="h-5 w-5 flex-shrink-0" />
					<span className={`ml-3 truncate transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 pointer-events-none hidden' : 'opacity-100'}`}>
						{t('sidebar.processes')}
					</span>
				</NavLink>

				<NavLink to="/visualizations" className={getLinkHighlightStyle} title={isCollapsed ? t('sidebar.visualizations') : undefined}>
					<FaChartPie className="h-5 w-5 flex-shrink-0" />
					<span className={`ml-3 truncate transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 pointer-events-none hidden' : 'opacity-100'}`}>
						{t('sidebar.visualizations')}
					</span>
				</NavLink>

				<NavLink to="/settings" className={getLinkHighlightStyle} title={isCollapsed ? t('sidebar.settings') : undefined}>
					<FaCog className="h-5 w-5 flex-shrink-0" />
					<span className={`ml-3 truncate transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 pointer-events-none hidden' : 'opacity-100'}`}>
						{t('sidebar.settings')}
					</span>
				</NavLink>

				<NavLink to="/help" className={getLinkHighlightStyle} title={isCollapsed ? t('sidebar.help') : undefined}>
					<FaQuestionCircle className="h-5 w-5 flex-shrink-0" />
					<span className={`ml-3 truncate transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 pointer-events-none hidden' : 'opacity-100'}`}>
						{t('sidebar.help')}
					</span>
				</NavLink>
			</nav>

			<Footer
				onLogout={onLogout}
				isCollapsed={isCollapsed}
				baseLinkStyle={baseLinkStyle}
			/>
		</aside>
	);
};
