// src/components/processes/ProcessTable.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Process } from '../../types/process';
// Import the display type and icons for expand/collapse
import { DisplayProcess } from '../../utils/processTree';
import { FaEdit, FaTrash, FaInfoCircle, FaChevronRight, FaChevronDown } from 'react-icons/fa';

interface ProcessTableProps {
	/**
	 * displayProcesses supercedes the old processes prop, and it should ALWAYS be a result from a utils/processTree-managed function.
	 * This is VERY important, as our code will stop working if we don't prepare the data first!
	 */
	displayProcesses: DisplayProcess[];
	areasMap: Map<number, string>;
	parentProcessMap: Map<number, string>; // Keep for maybe tooltip or fallback
	onEdit: (process: Process) => void;
	onDelete: (id: number) => void;
	isLoading: boolean;
	// expand/collapse props
	expandedIds: Set<number>;
	toggleExpand: (id: number) => void;
}

export const ProcessTable: React.FC<ProcessTableProps> = ({
	displayProcesses,
	areasMap,
	onEdit,
	onDelete,
	isLoading,
	expandedIds,
	toggleExpand,
}) => {
	const { t } = useTranslation();

	return (
		<div className="overflow-x-auto shadow rounded-lg">
			<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
				<thead className="bg-gray-50 dark:bg-gray-700">
					<tr>
						{/* Name column needs more space maybe? */}
						<th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('processLabels.area')}</th>
						<th scope="col" className="w-1/3 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('processLabels.name')}</th>
						<th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('processLabels.status')}</th>
						<th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('processLabels.priority')}</th>
						<th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('processLabels.description')}</th>
						{/* <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">{t('processLabels.parentProcess')}</th> */}
						<th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('common.actions')}</th>
					</tr>
				</thead>
				<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
					{/* Loading State */}
					{isLoading && displayProcesses.length === 0 && ( // Show loading only if list is empty
						<tr>
							<td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
								{t('common.loading')}
							</td>
						</tr>
					)}
					{/* Empty State */}
					{!isLoading && displayProcesses.length === 0 && (
						<tr>
							<td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
								<FaInfoCircle className="inline mr-2 mb-1" /> {t('processes.noProcessesFound')}
							</td>
						</tr>
					)}
					{/* Process Rows */}
					{!isLoading && displayProcesses.map(({ process, depth, hasChildren }) => {
						const isExpanded = expandedIds.has(process.id);
						// Calculate padding based on depth (adjust multiplier as needed)
						const paddingLeft = `${depth * 1.5}rem`;

						return (
							<tr key={process.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
								{/* Name Column with Indent and Toggle */}
								{/* Area should technically be first, but currently it looks pretty bad */}
								{/* TODO: review table display order */}
								<td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
									<div className="flex items-center" style={{ paddingLeft }}>
										{/* Toggle Button */}
										{hasChildren ? (
											<button
												onClick={() => toggleExpand(process.id)}
												className="mr-2 p-0.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
												aria-expanded={isExpanded}
												aria-label={isExpanded ? "Collapse" : "Expand"}
											>
												{isExpanded ? <FaChevronDown className="h-3 w-3" /> : <FaChevronRight className="h-3 w-3" />}
											</button>
										) : (
											// Placeholder for alignment if no children
											<span className="inline-block w-[1rem] mr-2"></span> // Width should match approx button width+margin
										)}
										{/* Process Name */}
										<span className="truncate" title={process.name}>{process.name}</span>
									</div>
								</td>

								<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{areasMap.get(process.area_id) || `${t('common.unknown')} ID: ${process.area_id}`}</td>
								<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{process.status}</td>
								<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{process.priority}</td>
								<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{process.description}</td>
								{/* <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">{getParentName(process.parent_process_id)}</td> */}

								{/* Action Buttons */}
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
						);
					})}
				</tbody>
			</table>
		</div>
	);
};
