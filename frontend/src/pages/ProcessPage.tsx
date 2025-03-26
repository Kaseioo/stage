// src/pages/ProcessesPage.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Process, ProcessFormData } from '../types/process';
import { Area } from '../types/area';
import { getProcesses, createProcess, updateProcess, deleteProcess } from '../services/processApi';
// Updated: Import specific Area API functions
import { getAreas, createArea, updateArea, deleteArea } from '../services/areaApi';
import { ProcessTable } from '../components/processes/ProcessTable';
import { ProcessForm } from '../components/processes/ProcessForm';
import { Modal } from '../components/common/Modal';
import { AreaManagerModal } from '../components/area/AreaManagerModal'; // Import the new component
import { FaPlus, FaLayerGroup } from 'react-icons/fa'; // Add FaLayerGroup

const ProcessesPage: React.FC = () => {
	const { t } = useTranslation();
	const [processes, setProcesses] = useState<Process[]>([]);
	const [areas, setAreas] = useState<Area[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true); // Main page loading
	const [processError, setProcessError] = useState<string | null>(null); // Errors for Process operations
	const [isProcessModalOpen, setIsProcessModalOpen] = useState<boolean>(false);
	const [editingProcess, setEditingProcess] = useState<Process | null>(null);
	const [isSubmittingProcess, setIsSubmittingProcess] = useState<boolean>(false);

	// --- State for Area Modal ---
	const [isAreaModalOpen, setIsAreaModalOpen] = useState<boolean>(false);
	const [editingArea, setEditingArea] = useState<Area | null>(null);
	const [areaName, setAreaName] = useState<string>(''); // Form input value for Area name
	const [isSubmittingArea, setIsSubmittingArea] = useState<boolean>(false); // Loading state for Area form
	const [areaError, setAreaError] = useState<string | null>(null); // Errors for Area operations

	// --- Data Fetching ---
	const fetchData = useCallback(async (showLoading = true) => {
		if (showLoading) setIsLoading(true);
		// Clear errors on refetch? Maybe only relevant errors.
		setProcessError(null);
		setAreaError(null);
		try {
			const [processesData, areasData] = await Promise.all([
				getProcesses(),
				getAreas(), // Now calls the actual API
			]);
			setProcesses(processesData);
			setAreas(areasData);
		} catch (err: any) {
			console.error("Error fetching data:", err);
			// Set a general error or specific if possible
			setProcessError(err.message || t('errors.fetchFailed', { resource: t('resources.processesAndAreas') }));
		} finally {
			if (showLoading) setIsLoading(false);
		}
	}, [t]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Memoized Maps (No changes needed)
	const areasMap = useMemo(() => {
		const map = new Map<number, string>();
		areas.forEach(area => map.set(area.id, area.name));
		return map;
	}, [areas]);
	const parentProcessMap = useMemo(() => {
		const map = new Map<number, string>();
		processes.forEach(process => map.set(process.id, process.name));
		return map;
	}, [processes]);

	// --- Process Modal Handlers ---
	const handleOpenCreateProcessModal = () => {
		setEditingProcess(null);
		setProcessError(null); // Clear process error on open
		setIsProcessModalOpen(true);
	};
	const handleOpenEditProcessModal = (process: Process) => {
		setEditingProcess(process);
		setProcessError(null); // Clear process error on open
		setIsProcessModalOpen(true);
	};
	const handleCloseProcessModal = () => {
		setIsProcessModalOpen(false);
		setEditingProcess(null);
	};

	// --- Process CRUD Handlers ---
	const handleProcessFormSubmit = async (formData: ProcessFormData) => {
		setIsSubmittingProcess(true);
		setProcessError(null); // Clear previous form errors
		try {
			if (editingProcess) {
				await updateProcess(editingProcess.id, formData);
			} else {
				await createProcess(formData);
			}
			handleCloseProcessModal();
			await fetchData(false); // Refetch without main loading indicator
		} catch (err: any) {
			console.error("Error submitting process form:", err);
			const backendErrors = err.data?.errors;
			if (backendErrors) {
				setProcessError(t('errors.validationError') + ': ' + backendErrors.map((e: any) => e.message).join(', '));
			} else {
				setProcessError(err.message || t('errors.submitFailed', { resource: t('resources.process') }));
			}
			// Keep process modal open on error
		} finally {
			setIsSubmittingProcess(false);
		}
	};

	const handleDeleteProcess = async (id: number) => {
		if (!window.confirm(t('processes.confirmDelete', { id }))) return;
		// Use submitting state to show loading feedback, maybe not full page loader
		setIsSubmittingProcess(true);
		setProcessError(null);
		try {
			await deleteProcess(id);
			await fetchData(false); // Refetch
		} catch (err: any) {
			console.error("Error deleting process:", err);
			setProcessError(err.message || t('errors.deleteFailed', { resource: t('resources.process') }));
		} finally {
			setIsSubmittingProcess(false);
		}
	};


	// --- Area Modal Handlers ---
	const handleOpenAreaModal = () => {
		setAreaError(null);
		setEditingArea(null);
		setAreaName('');
		setIsAreaModalOpen(true);
	};
	const handleCloseAreaModal = () => {
		setIsAreaModalOpen(false);
		setEditingArea(null);
		setAreaName('');
		setAreaError(null); // Also clear error on close
	};
	const handleAreaNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAreaName(e.target.value);
		if (areaError) setAreaError(null); // Clear error on typing
	};
	const handleSetEditArea = (area: Area) => {
		setEditingArea(area);
		setAreaName(area.name); // Pre-fill form
		setAreaError(null);
		// No need to open modal here, user is already in it (hopefully)
	};
	const handleCancelEditArea = () => {
		setEditingArea(null);
		setAreaName('');
		setAreaError(null);
	};

	// --- Area CRUD Handlers ---
	const handleAreaFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!areaName.trim()) return;

		setIsSubmittingArea(true);
		setAreaError(null);
		try {
			const payload = { name: areaName.trim() };
			let successMessage = '';
			if (editingArea) {
				await updateArea(editingArea.id, payload);
				successMessage = t('areas.updateSuccess', { name: payload.name });
			} else {
				await createArea(payload);
				successMessage = t('areas.createSuccess', { name: payload.name });
			}
			// Clear form and editing state, refetch data
			setAreaName('');
			setEditingArea(null);
			await fetchData(false); // Refetch without main page loading
			// Optional: show success toast/message
			console.log(successMessage); // Placeholder for success feedback
		} catch (err: any) {
			console.error("Error submitting area form:", err);
			if (err.data?.message === 'Area name already exists.') {
				setAreaError(t('errors.nameExists'));
			} else {
				setAreaError(err.message || t('errors.submitFailed', { resource: t('resources.area') }));
			}
			// Keep Area modal open on error
		} finally {
			setIsSubmittingArea(false);
		}
	};

	const handleDeleteArea = async (id: number) => {
		const areaToDelete = areas.find(a => a.id === id);
		if (!areaToDelete) return;

		if (!window.confirm(t('areas.confirmDelete', { name: areaToDelete.name, id }))) return;

		setIsSubmittingArea(true);
		setAreaError(null);
		try {
			await deleteArea(id);
			// If the deleted area was being edited, cancel edit mode
			if (editingArea?.id === id) {
				handleCancelEditArea();
			}
			await fetchData(false); // Refetch data
			// TODO: communicate message with user
			console.log(t('areas.deleteSuccess'));
		} catch (err: any) {
			console.error("Error deleting area:", err);

			if (err.name === 'SequelizeForeignKeyConstraintError' || err.message?.includes('foreign key constraint fails')) {
				setAreaError(t('errors.cannotDeleteHasProcesses'));
			} else {
				setAreaError(err.message || t('errors.deleteFailed', { resource: t('resources.area') }));
			}
		} finally {
			setIsSubmittingArea(false);
		}
	};

	// --- Render Logic ---
	return (
		<div>
			{/* Header Section */}
			<div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
					{t('pages.processes.title')}
				</h1>
				{/* Action Buttons */}
				<div className="flex gap-3">
					<button
						onClick={handleOpenAreaModal} // Button to open Area Manager
						className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						<FaLayerGroup className="-ml-1 mr-2 h-5 w-5" />
						{t('areas.manageAreas')}
					</button>
					<button
						onClick={handleOpenCreateProcessModal} // Button to open Add Process
						className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						<FaPlus className="-ml-1 mr-2 h-5 w-5" />
						{t('processes.addProcess')}
					</button>
				</div>
			</div>

			{/* Display general Process errors */}
			{processError && !isProcessModalOpen && ( // Only show page-level error if process modal is closed
				<div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded">
					{processError}
				</div>
			)}

			{/* Process Table */}
			<ProcessTable
				processes={processes}
				areasMap={areasMap}
				parentProcessMap={parentProcessMap}
				onEdit={handleOpenEditProcessModal}
				onDelete={handleDeleteProcess}
				// Use general loading OR process submitting state for table feedback
				isLoading={isLoading || isSubmittingProcess}
			/>

			{/* Process Add/Edit Modal */}
			<Modal
				isOpen={isProcessModalOpen}
				onClose={handleCloseProcessModal}
				title={editingProcess ? t('processes.editProcess') : t('processes.addProcess')}
				size="lg"
			>
				{/* Display submit errors within the Process modal */}
				{processError && isProcessModalOpen && (
					<div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded text-sm">
						{processError}
					</div>
				)}
				{/* Render Process form conditionally */}
				{areas.length > 0 ? (
					<ProcessForm
						key={editingProcess?.id ?? 'create-process'} // Unique key
						initialData={editingProcess}
						onSubmit={handleProcessFormSubmit}
						onCancel={handleCloseProcessModal}
						areas={areas}
						processes={processes}
						isSubmitting={isSubmittingProcess}
					/>
				) : (
					<p className="text-center text-gray-500 dark:text-gray-400">
						{isLoading ? t('common.loadingFormData') : t('errors.fetchFailed', { resource: t('resources.areas') })}
					</p>
				)}
			</Modal>

			{/* --- Area Manager Modal --- */}
			<AreaManagerModal
				isOpen={isAreaModalOpen}
				onClose={handleCloseAreaModal}
				areas={areas}
				editingArea={editingArea}
				areaName={areaName}
				onAreaNameChange={handleAreaNameChange}
				onSubmit={handleAreaFormSubmit}
				onEdit={handleSetEditArea}
				onCancelEdit={handleCancelEditArea}
				onDelete={handleDeleteArea}
				isLoading={isSubmittingArea}
				error={areaError}
			/>

		</div>
	);
};

export default ProcessesPage;
