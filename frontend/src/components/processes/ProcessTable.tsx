// src/components/processes/ProcessTable.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Process } from '../../types/process';
import { Area } from '../../types/area';
import { FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';

interface ProcessTableProps {
	processes: Process[];
	areasMap: Map<number, string>; // Pass a map for quick area name lookup
	parentProcessMap: Map<number, string>; // Map for parent process names
	onEdit: (process: Process) => void;
	onDelete: (id: number) => void;
	isLoading: boolean; // To show loading state in the table
}

export const ProcessTable: React.FC<ProcessTableProps> = ({
	processes,
	areasMap,
	parentProcessMap,
	onEdit,
	onDelete,
	isLoading,
}) => {
	const { t } = useTranslation();

	// Helper to get parent process name
	const getParentName = (id: number | null): string => {
		if (id === null) return t('common.none');
		return parentProcessMap.get(id) || `${t('common.unknown')} (ID: ${id})`;
	};

	return (
		<div className="overflow-x-auto shadow rounded-lg">
			<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
				<thead className="bg-gray-50 dark:bg-gray-700">
					<tr>
						{/* Adjust columns as needed */}
						<th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('processLabels.name')}</th>
						<th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('processLabels.area')}</th>
						<th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('processLabels.status')}</th>
						<th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('processLabels.priority')}</th>
						<th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">{t('processLabels.parentProcess')}</th>
						{/* <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">{t('processLabels.description')}</th> */}
						<th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('common.actions')}</th>
					</tr>
				</thead>
				<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
					{isLoading && (
						<tr>
							<td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
								{t('common.loading')}
							</td>
						</tr>
					)}
					{!isLoading && processes.length === 0 && (
						<tr>
							<td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
								<FaInfoCircle className="inline mr-2 mb-1" /> {t('processes.noProcessesFound')}
							</td>
						</tr>
					)}
					{!isLoading && processes.map((process) => (
						<tr key={process.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
							<td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{process.name}</td>
							<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{areasMap.get(process.area_id) || `${t('common.unknown')} ID: ${process.area_id}`}</td>
							<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{process.status}</td>
							<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{process.priority}</td>
							<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">{getParentName(process.parent_process_id)}</td>
							{/* <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate hidden lg:table-cell" title={process.description || ''}>{process.description}</td> */}
							<td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium space-x-2">
								<button
									onClick={() => onEdit(process)}
									className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition duration-150"
									title={t('common.edit')}
								>
									<FaEdit className="h-4 w-4" />
								</button>
								<button
									onClick={() => onDelete(process.id)}
									className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition duration-150"
									title={t('common.delete')}
								>
									<FaTrash className="h-4 w-4" />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
