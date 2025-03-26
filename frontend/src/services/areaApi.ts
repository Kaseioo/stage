// src/services/areaApi.ts
import apiClient from './apiClient';
import { Area, AreaFormData } from '../types/area'; // Import Area and potentially AreaFormData

/**
 * Fetches all areas from the backend.
 */
export const getAreas = (): Promise<Area[]> => {
    console.log("Fetching actual Area data from '/api/areas'"); // Log for confirmation
    // Assumes your backend route is GET /api/areas
    return apiClient<Area[]>('/areas');
};

/**
 * Fetches a single area by its ID.
 */
export const getAreaById = (id: number): Promise<Area> => {
    return apiClient<Area>(`/areas/${id}`);
};

/**
 * Creates a new area.
 */
export const createArea = (data: AreaFormData): Promise<Area> => {
    return apiClient<Area>('/areas', { data, method: 'POST' });
};

/**
 * Updates an existing area by its ID.
 */
export const updateArea = (id: number, data: AreaFormData): Promise<Area> => {
    // Controller uses PUT and updates the whole name field
    return apiClient<Area>(`/areas/${id}`, { data, method: 'PUT' });
};

/**
 * Deletes an area by its ID.
 */
export const deleteArea = (id: number): Promise<void> => {
    // apiClient handles 204 No Content response
    return apiClient<void>(`/areas/${id}`, { method: 'DELETE' });
};
