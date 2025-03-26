import React from 'react';
import { useTranslation } from 'react-i18next';

const HelpPage: React.FC = () => {
	const { t } = useTranslation();
	return (
		<div>
			<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
				{t('pages.help.title')}
			</h1>
			<p className="text-gray-700 dark:text-gray-300">
				{t('pages.help.content')} Lorem ipsum dolor sit amet, consectetur adipiscing elit.
			</p>
		</div>
	);
};

export default HelpPage;
