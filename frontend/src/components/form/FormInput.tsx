import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
}

export class FormInput extends React.Component<InputProps> {
	render() {
		const { label, id, error, ...props } = this.props;
		return (
			<div>
				<label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
					{label}
				</label>
				<input
					id={id}
					className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${error
						? 'border-red-500 dark:border-red-400'
						: 'border-gray-300 dark:border-gray-600'
						} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
					{...props}
				/>
				{error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
			</div>
		);
	}
}
