// src/components/processes/ProcessForm.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Process, ProcessFormData } from '../../types/process';
import { Area } from '../../types/area';
import { FormInput } from '../form/FormInput';
import { FormTextArea } from '../form/FormTextArea';
import { FormSelect } from '../form/FormSelect';

// --- ProcessForm Component ---
interface ProcessFormProps {
	initialData?: Process | null;
	onSubmit: (data: ProcessFormData) => Promise<void>; // Async to handle loading state
	onCancel: () => void;
	areas: Area[];
	processes: Process[]; // All processes for parent selection
	isSubmitting: boolean; // Flag for loading state. Controls modal.
}

export const ProcessForm: React.FC<ProcessFormProps> = ({
	initialData,
	onSubmit,
	onCancel,
	areas,
	processes,
	isSubmitting,
}) => {
	const { t } = useTranslation();
	const [formData, setFormData] = useState<ProcessFormData>({
		name: '',
		description: null,
		area_id: 0,
		parent_process_id: null,
		related_tools: null,
		related_users: null,
		status: '',
		priority: '',
	});
	const [errors, setErrors] = useState<Partial<Record<keyof ProcessFormData, string>>>({});

	useEffect(() => {
		if (initialData) {
			// Populate form if editing
			setFormData({
				name: initialData.name,
				description: initialData.description,
				area_id: initialData.area_id,
				parent_process_id: initialData.parent_process_id,
				related_tools: initialData.related_tools,
				related_users: initialData.related_users,
				status: initialData.status,
				priority: initialData.priority,
			});
		} else {
			// Reset form if creating
			setFormData({
				name: '', description: null, area_id: areas[0]?.id || 0, parent_process_id: null,
				related_tools: null, related_users: null, status: '', priority: ''
			});
		}
		setErrors({}); // Clear errors when initialData changes
	}, [initialData, areas]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			// Handle empty string for optional fields or convert types if needed
			[name]: value === '' && ['description', 'parent_process_id', 'related_tools', 'related_users'].includes(name)
				? null
				: value,
		}));
		// Clear error for this field on change
		if (errors[name as keyof ProcessFormData]) {
			setErrors(prev => ({ ...prev, [name]: undefined }));
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Partial<Record<keyof ProcessFormData, string>> = {};
		if (!formData.name.trim()) newErrors.name = t('formErrors.required', { field: t('processLabels.name') });
		if (!formData.area_id || formData.area_id <= 0) newErrors.area_id = t('formErrors.requiredSelect', { field: t('processLabels.area') });
		if (!formData.status.trim()) newErrors.status = t('formErrors.required', { field: t('processLabels.status') });
		if (!formData.priority.trim()) newErrors.priority = t('formErrors.required', { field: t('processLabels.priority') });

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) {
			return; // Stop submission if validation fails
		}
		await onSubmit(formData); // onSubmit should handle API call and closing modal
	};

	// Filter out the current process being edited from the parent dropdown
	const parentProcessOptions = useMemo(() => {
		return processes.filter(p => p.id !== initialData?.id);
	}, [processes, initialData]);

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<FormInput
				label={t('processLabels.name')}
				id="name"
				name="name"
				value={formData.name}
				onChange={handleChange}
				error={errors.name}
				required
				// soft cap for backend DB purposes. We do have unlimited length there, though, so this can be 
				// ignored if the user tries to just directly send a request to our API
				maxLength={255}
			/>

			<FormSelect
				label={t('processLabels.area')}
				id="area_id"
				name="area_id"
				value={formData.area_id || ''} // Handle potential null/0 initial value
				onChange={handleChange}
				error={errors.area_id}
				required
			>
				<option value="" disabled className="text-gray-700 dark:text-gray-400">{t('common.selectPlaceholder')}</option>
				{areas.map(area => (
					<option key={area.id} value={area.id} className="text-gray-700 dark:text-white">{area.name}</option>
				))}
			</FormSelect>

			<FormSelect
				label={t('processLabels.parentProcess')}
				id="parent_process_id"
				name="parent_process_id"
				value={formData.parent_process_id || ''} // Handle null
				onChange={handleChange}
				error={errors.parent_process_id}
			>
				<option value="">{t('common.none')}</option>
				{parentProcessOptions.map(proc => (
					<option key={proc.id} value={proc.id}>{proc.name} (ID: {proc.id})</option>
				))}
			</FormSelect>

			<FormTextArea
				label={t('processLabels.description')}
				id="description"
				name="description"
				value={formData.description || ''}
				onChange={handleChange}
				error={errors.description}
			/>

			<FormInput
				label={t('processLabels.status')}
				id="status"
				name="status"
				value={formData.status}
				onChange={handleChange}
				error={errors.status}
				required
				maxLength={255}
			/>
			{/* TODO: Transform this into a select */}
			<FormInput
				label={t('processLabels.priority')}
				id="priority"
				name="priority"
				value={formData.priority}
				onChange={handleChange}
				error={errors.priority}
				required
				maxLength={255}
			/>

			<FormTextArea
				label={t('processLabels.relatedTools')}
				id="related_tools"
				name="related_tools"
				value={formData.related_tools || ''}
				onChange={handleChange}
				error={errors.related_tools}
			/>

			<FormTextArea
				label={t('processLabels.relatedUsers')}
				id="related_users"
				name="related_users"
				value={formData.related_users || ''}
				onChange={handleChange}
				error={errors.related_users}
			/>


			{/* Form Actions */}
			<div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
				<button
					type="button"
					onClick={onCancel}
					disabled={isSubmitting}
					className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
				>
					{t('common.cancel')}
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
				>
					{isSubmitting
						? t('common.saving')
						: initialData
							? t('common.saveChanges')
							: t('common.create')}
				</button>
			</div>
		</form>
	);
};
