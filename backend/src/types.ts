export interface CreateProcessRequestBody {
	name: string;
	parent_process_id?: number | null;
	description?: string | null;
}
