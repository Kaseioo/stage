import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import './libs/i18n.ts';
import { ThemeProvider } from './contexts/ThemeContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider>
			<BrowserRouter>
				<React.Suspense fallback="Loading...">
					<App />
				</React.Suspense>
			</BrowserRouter>
		</ThemeProvider>
	</React.StrictMode>
);
