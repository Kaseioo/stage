// src/layouts/MainLayout.tsx
import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/sidebar/Sidebar';

interface MainLayoutProps {
	onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	// toggle between collapsed and expanded
	const toggleSidebar = useCallback(() => {
		setIsSidebarCollapsed(isCollapsed => !isCollapsed);
	}, []);

	return (
		<div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
			<Sidebar
				onLogout={onLogout}
				isCollapsed={isSidebarCollapsed}
				toggleSidebar={toggleSidebar}
			/>

			<main
				className={`flex-1 overflow-y-auto p-4 sm:p-6 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20 md:ml-0' : 'ml-20 md:ml-0'}`}
			>
				<Outlet />
			</main>
		</div>
	);
};

export default MainLayout;
