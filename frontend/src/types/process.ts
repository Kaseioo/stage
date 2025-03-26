// src/types/process.ts
export interface Process {
	id: number;
	parent_process_id: number | null;
	name: string;
	description: string | null;
	area_id: number;
	related_tools: string | null;
	related_users: string | null;
	status: string;
	priority: string;
	createdAt?: string;
	updatedAt?: string;
}

// 'id', 'createdAt' and 'updatedAt' are handled by the backend
export type ProcessFormData = Omit<Process, 'id' | 'createdAt' | 'updatedAt'>;
