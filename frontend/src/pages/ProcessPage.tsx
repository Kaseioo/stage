// src/pages/ProcessesPage.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Process, ProcessFormData } from '../types/process';
import { Area } from '../types/area';
import { getProcesses, createProcess, updateProcess, deleteProcess } from '../services/processApi';
import { getAreas } from '../services/areaApi';
import { ProcessTable } from '../components/processes/ProcessTable';
import { ProcessForm } from '../components/processes/ProcessForm';
import { Modal } from '../components/common/Modal';
import { FaPlus } from 'react-icons/fa';

const ProcessesPage: React.FC = () => {
	const { t } = useTranslation();
	const [processes, setProcesses] = useState<Process[]>([]);
	const [areas, setAreas] = useState<Area[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [editingProcess, setEditingProcess] = useState<Process | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Loading state for form submission

	// Fetch initial data (processes and areas)
	const fetchData = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			// Fetch in parallel. 
			// TODO: I am pretty sure this can cause the entire system to freeze sometimes. Check this.
			const [processesData, areasData] = await Promise.all([
				getProcesses(),
				getAreas(),
			]);
			setProcesses(processesData);
			setAreas(areasData);
		} catch (err: any) {
			console.error("Error fetching data:", err);
			setError(err.message || t('errors.fetchFailed', { resource: t('resources.processesAndAreas') }));
		} finally {
			setIsLoading(false);
		}
	}, [t]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Memoize maps for performance
	const areasMap = useMemo(() => {
		const map = new Map<number, string>();
		areas.forEach(area => map.set(area.id, area.name));
		return map;
	}, [areas]);

	const parentProcessMap = useMemo(() => {
		const map = new Map<number, string>();
		processes.forEach(proc => map.set(proc.id, proc.name));
		return map;
	}, [processes]);


	// --- Modal Handlers ---
	const handleOpenCreateModal = () => {
		setEditingProcess(null);
		setIsModalOpen(true);
	};

	const handleOpenEditModal = (process: Process) => {
		setEditingProcess(process);
		setIsModalOpen(true);
	};

	// Errors should be cleared within the form itself upon opening/closing
	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingProcess(null);
	};

	// --- CRUD Handlers ---
	const handleFormSubmit = async (formData: ProcessFormData) => {
		setIsSubmitting(true);
		setError(null);
		try {
			if (editingProcess) {
				await updateProcess(editingProcess.id, formData);
			} else {
				await createProcess(formData);
				// local-only: setProcesses(prev => [...prev, newProcess]);
			}
			handleCloseModal();
			await fetchData(); // Refetch data after successful submit
		} catch (err: any) {
			console.error("Error submitting form:", err);
			// Try to get specific validation errors from backend if available
			const backendErrors = err.data?.errors;
			if (backendErrors) {
				setError(t('errors.validationError') + ': ' + backendErrors.map((e: any) => e.message).join(', '));
			} else {
				setError(err.message || t('errors.submitFailed', { resource: t('resources.process') }));
			}
		} finally {
			setIsSubmitting(false);
		}
	};


	const handleDeleteProcess = async (id: number) => {
		if (!window.confirm(t('processes.confirmDelete', { id }))) {
			return;
		}

		setIsLoading(true);
		setError(null);
		try {
			await deleteProcess(id);
			// Remove from state locally for instant feedback
			setProcesses(prev => prev.filter(p => p.id !== id));
		} catch (err: any) {
			console.error("Error deleting process:", err);
			setError(err.message || t('errors.deleteFailed', { resource: t('resources.process') }));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
					{t('pages.processes.title')}
				</h1>
				<button
					onClick={handleOpenCreateModal}
					className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					<FaPlus className="-ml-1 mr-2 h-5 w-5" />
					{t('processes.addProcess')}
				</button>
			</div>

			{/* Display general errors */}
			{error && !isModalOpen && ( // Only show page-level error if modal is closed
				<div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded">
					{error}
				</div>
			)}


			<ProcessTable
				processes={processes}
				areasMap={areasMap}
				parentProcessMap={parentProcessMap}
				onEdit={handleOpenEditModal}
				onDelete={handleDeleteProcess}
				isLoading={isLoading && !isModalOpen} // Don't show table loading if modal is open/submitting
			/>

			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title={editingProcess ? t('processes.editProcess') : t('processes.addProcess')}
				size="lg"
			>
				{/* Display submit errors within the modal */}
				{error && isModalOpen && (
					<div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded text-sm">
						{error}
					</div>
				)}

				{/* Only render form when Area/Process data is available */}
				{areas.length > 0 ? ( // Check if areas are loaded
					<ProcessForm
						key={editingProcess?.id ?? 'create'} // Force re-render on edit vs create
						initialData={editingProcess}
						onSubmit={handleFormSubmit}
						onCancel={handleCloseModal}
						areas={areas}
						processes={processes} // can be empty for the parent dropdown
						isSubmitting={isSubmitting}
					/>
				) : (
					// If areas haven't loaded yet, show loading.
					// This also covers the edge case where getAreas returns empty AND area is required (such as the first time the system is accessed).
					<p className="text-center text-gray-500 dark:text-gray-400">
						{isLoading ? t('common.loadingFormData') : t('errors.fetchFailed', { resource: t('resources.areas') })}
					</p>
				)}
			</Modal>
		</div>
	);
};

export default ProcessesPage;
