// src/types/area.ts
export interface Area {
    id: number;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

// 'id', 'createdAt' and 'updatedAt' are handled by the backend
export type AreaFormData = Omit<Area, 'id' | 'createdAt' | 'updatedAt'>;
