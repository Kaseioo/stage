import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

/**
 * Hook to get the current theme and a function to toggle between light and dark mode.
 * Must be used within a ThemeProvider.
 * @returns an object containing the current theme and a function to toggle the theme
 * @throws if the hook is used outside of a ThemeProvider
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    // this should not happen if the context is used correctly. Added for safety only. I definitely did not forget to wrap my app in a ThemeProvider before. :)
    if (context === undefined) {
        throw new Error(
            'useTheme must be used within a ThemeProvider. Did you forget to wrap your app in a ThemeProvider?',
        );
    }
    return context;
};
