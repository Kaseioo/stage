import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../common/Modal';
import { Area } from '../../types/area';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { FormInput } from '../form/FormInput';

interface AreaManagerModalProps {
	isOpen: boolean;
	onClose: () => void;
	areas: Area[];
	editingArea: Area | null;
	areaName: string; // Current value in the form input
	onAreaNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (e: React.FormEvent) => Promise<void>; // Handle create/update
	onEdit: (area: Area) => void; // Set an area for editing
	onCancelEdit: () => void; // Clear editing state
	onDelete: (id: number) => Promise<void>; // Handle delete
	isLoading: boolean; // General loading/submitting state for this modal
	error: string | null; // Error specific to this modal
}

export const AreaManagerModal: React.FC<AreaManagerModalProps> = ({
	isOpen,
	onClose,
	areas,
	editingArea,
	areaName,
	onAreaNameChange,
	onSubmit,
	onEdit,
	onCancelEdit,
	onDelete,
	isLoading,
	error,
}) => {
	const { t } = useTranslation();
	const formTitle = editingArea ? t('areas.editArea') : t('areas.addArea');

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={t('areas.manageAreas')}
			size="md" // Adjust size if needed
		>
			{/* Display Error */}
			{error && (
				<div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded text-sm">
					{error}
				</div>
			)}

			{/* Form for Create/Update */}
			<form onSubmit={onSubmit} className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
				<h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">{formTitle}</h3>
				<div className="flex items-end space-x-2">
					<div className="flex-grow">
						<FormInput
							label={t('areas.areaName')}
							id="areaName"
							name="areaName"
							value={areaName}
							onChange={onAreaNameChange}
							required
							maxLength={255}
							disabled={isLoading}
							placeholder={t('areas.areaName')} // Add placeholder
						/>
						{/* Optionally hide label visually if placeholder is enough: sr-only */}
						{/* <label htmlFor="areaName" className="sr-only">{t('areas.areaName')}</label> */}

					</div>
					<button
						type="submit"
						disabled={isLoading || !areaName.trim()}
						className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed h-[38px]" // Match input height
					>
						{isLoading
							? t('common.saving')
							: editingArea
								? t('common.saveChanges')
								: t('common.create')}
					</button>
					{editingArea && (
						<button
							type="button"
							onClick={onCancelEdit}
							disabled={isLoading}
							className="inline-flex justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 h-[38px]"
							title={t('common.cancelEdit')}
						>
							<FaTimes className="h-4 w-4" />
						</button>
					)}
				</div>
			</form>

			{/* List of Existing Areas */}
			<h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">{t('resources.areas')}</h3>
			{areas.length === 0 && !isLoading ? (
				<p className="text-sm text-gray-500 dark:text-gray-400">{t('areas.noAreasFound')}</p>
			) : (
				<ul className="space-y-2 max-h-60 overflow-y-auto pr-2"> {/* Add scroll */}
					{areas.map(area => (
						<li key={area.id} className="flex justify-between items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50">
							<span className="text-sm text-gray-800 dark:text-gray-200">{area.name}</span>
							<div className="space-x-2 flex-shrink-0">
								<button
									onClick={() => onEdit(area)}
									disabled={isLoading || editingArea?.id === area.id} // Disable if already editing this one
									className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
									title={t('common.edit')}
								>
									<FaEdit className="h-4 w-4" />
								</button>
								<button
									onClick={() => onDelete(area.id)}
									disabled={isLoading}
									className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
									title={t('common.delete')}
								>
									<FaTrash className="h-4 w-4" />
								</button>
							</div>
						</li>
					))}
					{isLoading && areas.length > 0 && ( // Show loading indicator at the bottom if list isn't empty
						<li className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">{t('common.loading')}</li>
					)}
				</ul>
			)}
		</Modal>
	);
};
