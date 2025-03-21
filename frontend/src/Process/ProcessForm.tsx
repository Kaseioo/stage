// frontend/src/Process/ProcessForm.tsx
import React, { useState } from 'react';
import { Area, Process } from '../types';

interface ProcessFormProps {
  areas: Area[];
  addProcess: (newProcess: Omit<Process, 'id'>) => void;
  processes: Process[];
}

const ProcessForm: React.FC<ProcessFormProps> = ({ areas, addProcess, processes }) => {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [areaId, setAreaId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProcess({ name, parent_process_id: parentId, description, area_id: areaId });
    setName('');
    setParentId(null);
    setDescription('');
    setAreaId(null);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Add Process</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Parent Process (optional):
        </label>
        <select
          value={parentId === null ? '' : parentId}
          onChange={(e) =>
            setParentId(e.target.value === '' ? null : parseInt(e.target.value, 10))
          }
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="">No Parent</option>
          {processes.map((process) => (
            <option key={process.id} value={process.id}>
              {process.id} - {process.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Area:</label>
        <select
          value={areaId === null ? '' : areaId}
          onChange={(e) => setAreaId(e.target.value === '' ? null : parseInt(e.target.value, 10))}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="">Select an Area</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Process
      </button>
    </form>
  );
};

export default ProcessForm;
