// frontend/src/Area/AreaForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Area } from '../types';

interface AreaFormProps {
    onAreaAdded: (newArea: Area) => void;
}

const AreaForm: React.FC<AreaFormProps> = ({ onAreaAdded }) => {
    const [areaName, setAreaName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post<Area>('http://localhost:3001/api/areas', { name: areaName });
            onAreaAdded(response.data);
            setAreaName('');
        } catch (error) {
            console.error('Error adding area:', error);
            alert('Error adding area. Check console.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Add Area</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Area Name:</label>
                <input
                    type="text"
                    value={areaName}
                    onChange={(e) => setAreaName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>
            <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
                Add Area
            </button>
        </form>
    );
};

export default AreaForm;
