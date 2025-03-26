import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSignInAlt } from 'react-icons/fa';
import { ThemeToggle } from '../components/acessibility/ToggleTheme';
import { LanguageSelector } from '../components/acessibility/LanguageSelector';

interface LoginPageProps {
	onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(false);

	const handleLoginClick = () => {
		setIsLoading(true);
		// Simulate API call or authentication process
		setTimeout(() => {
			onLogin();
			// No need to setIsLoading(false) because the component will unmount on successful login
		}, 1000); // Simulate network delay
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
			{/* Theme Toggle Button */}
			<div className="absolute top-4 right-4">
				<ThemeToggle />
			</div>

			<div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md text-center">
				<FaSignInAlt className="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
				<h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
					{t('login.title')}
				</h1>
				<p className="text-gray-600 dark:text-gray-400 mb-6">
					{t('login.prompt')}
				</p>
				<button
					onClick={handleLoginClick}
					disabled={isLoading}
					className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
				>
					{isLoading ? (
						<>
							<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							{t('login.loggingIn')}
						</>
					) : (
						t('login.button')
					)}
				</button>
				<br/>
				<LanguageSelector />
			</div>
		</div>
	);
};

export default LoginPage;
