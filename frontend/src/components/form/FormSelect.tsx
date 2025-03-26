import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label: string;
	error?: string;
	children: React.ReactNode;
}
export const FormSelect: React.FC<SelectProps> = ({ label, id, error, children, ...props }) => (
	<div>
		<label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
			{label}
		</label>
		<select
			id={id}
			className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${error
				? 'border-red-500 dark:border-red-400'
				: 'border-gray-300 dark:border-gray-600'
				} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
			{...props}
		>
			{children}
		</select>
		{error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
	</div>
);
