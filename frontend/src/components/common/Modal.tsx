// src/components/common/Modal.tsx
import React, { ReactNode } from 'react';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
	size = 'md',
}) => {
	if (!isOpen) return null;

	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		full: 'max-w-full mx-4',
	};

	return (
		// Backdrop
		<div
			className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4 transition-opacity duration-200"
			onClick={onClose} // Close on backdrop click
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			{/* Modal Content */}
			<div
				className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${sizeClasses[size]} overflow-hidden transform transition-all duration-300 ease-out`}
				onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
			>
				{/* Header */}
				<div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
					<h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
						{title}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
						aria-label="Close modal"
					>
						<FaTimes className="h-5 w-5" />
					</button>
				</div>

				{/* Body */}
				<div className="p-4 max-h-[70vh] overflow-y-auto">
					{children}
				</div>

				{/* Footer should in theory go here, but we don't have a need for it right now */}
			</div>
		</div>
	);
};
