// src/services/processApi.ts
import apiClient from './apiClient';
import { Process, ProcessFormData } from '../types/process';

export const getProcesses = (): Promise<Process[]> => {
	return apiClient<Process[]>('/processes');
};

export const getProcessById = (id: number): Promise<Process> => {
	return apiClient<Process>(`/processes/${id}`);
};

export const createProcess = (data: ProcessFormData): Promise<Process> => {
	// Ensure nulls are sent correctly if needed, backend controller handles defaults
	const payload = {
		...data,
		area_id: Number(data.area_id), // Ensure area_id is number
		parent_process_id: data.parent_process_id
			? Number(data.parent_process_id)
			: null,
	};
	return apiClient<Process>('/processes', { data: payload, method: 'POST' });
};

export const updateProcess = (
	id: number,
	data: Partial<ProcessFormData>,
): Promise<Process> => {
	const payload: Partial<
		ProcessFormData & {
			area_id?: number;
			parent_process_id?: number | null;
		}
	> = { ...data };
	if (payload.area_id !== undefined)
		payload.area_id = Number(payload.area_id);
	if (payload.parent_process_id !== undefined) {
		payload.parent_process_id = payload.parent_process_id
			? Number(payload.parent_process_id)
			: null;
	}

	return apiClient<Process>(`/processes/${id}`, {
		data: payload,
		method: 'PUT',
	});
};

export const deleteProcess = (id: number): Promise<void> => {
	// apiClient handles 204 response
	return apiClient<void>(`/processes/${id}`, { method: 'DELETE' });
};
