import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';

const languages = {
	en: { nativeName: 'English' },
	'pt-BR': { nativeName: 'Português (Brasil)' },
};

export const LanguageSelector: React.FC = () => {
	const { i18n } = useTranslation();
	const currentLanguage = i18n.resolvedLanguage || 'en';
	const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const langCode = event.target.value;
		i18n.changeLanguage(langCode);
	};

	return (
		<div className="w-full">
			<label htmlFor="language-select" className="sr-only">
				Select Language
			</label>
			<div className="flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm px-3 py-1.5 text-sm hover:bg-gray-200 dark:hover:bg-gray-800">
				<FaGlobe className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" aria-hidden="true" />
				<select
					id="language-select"
					value={currentLanguage}
					onChange={handleLanguageChange}
					className="block w-full bg-transparent focus:outline-none text-gray-700 dark:text-gray-200 appearance-none pl-4 pr-8 cursor-pointer"
				>
					{Object.keys(languages).map((language) => (
						<option
							key={language}
							value={language}
							className="text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-800 p-4 hover:bg-gray-100 dark:hover:bg-gray-700"
						>
							{languages[language as keyof typeof languages].nativeName}
						</option>
					))}
				</select>

			<FaChevronDown className="right-2 h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
			</div>
		</div>
	);
};
