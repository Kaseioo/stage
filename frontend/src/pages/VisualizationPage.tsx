import React from 'react';
import { useTranslation } from 'react-i18next';

const VisualizationsPage: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('pages.visualizations.title')}
            </h1>
            <p className="text-gray-700 dark:text-gray-300">
                Display charts, graphs, and other data visualizations here.
            </p>
        </div>
    );
};

export default VisualizationsPage;
