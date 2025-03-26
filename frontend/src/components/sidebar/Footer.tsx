import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSignOutAlt } from 'react-icons/fa';

interface FooterActionsProps {
	onLogout: () => void;
	baseLinkStyle: string; // ensure consistent styling with our sidebar
	isCollapsed: boolean;
}

const FooterActions: React.FC<FooterActionsProps> = ({
	onLogout,
	baseLinkStyle,
	isCollapsed,
}) => {
	const { t } = useTranslation();

	return (
		<div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
			<button
				onClick={onLogout}
				className={`${baseLinkStyle} hover:bg-gray-200 dark:hover:bg-gray-700 w-full justify-start`}
			>
				<FaSignOutAlt className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
				<span className={`truncate transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 pointer-events-none hidden' : 'opacity-100'}`}>
					{t('sidebar.logout')}
				</span>
			</button>
		</div>
	);
};

export default FooterActions;
