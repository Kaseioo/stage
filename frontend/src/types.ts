// /frontend/src/types.ts
export interface Process {
	id: number;
	parent_process_id: number | null;
	name: string;
	description: string | null;
	area_id: number | null;
	subProcesses?: Process[];
}

export interface Area {
	id: number;
	name: string;
}
