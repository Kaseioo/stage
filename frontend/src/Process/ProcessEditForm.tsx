// frontend/src/Process/ProcessEditForm.tsx
import React, { useState, useEffect } from 'react';
import { Area, Process } from '../types';

interface ProcessEditFormProps {
  process: Process;
  areas: Area[];
  updateProcess: (updatedProcess: Process) => void;
  cancelEditing: () => void;
  processes: Process[];
}

const ProcessEditForm: React.FC<ProcessEditFormProps> = ({
  process,
  areas,
  updateProcess,
  cancelEditing,
  processes,
}) => {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [areaId, setAreaId] = useState<number | null>(null);

  useEffect(() => {
    if (process) {
      setName(process.name);
      setParentId(process.parent_process_id);
      setDescription(process.description || '');
      setAreaId(process.area_id);
    }
  }, [process]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProcess({ ...process, name, parent_process_id: parentId, description, area_id: areaId });
  };

  // Filter out the current process from the parent selection
  const availableParents = processes.filter((p) => p.id !== process.id);

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 border border-gray-300 rounded-md">
<h2 className="text-xl font-semibold mb-2">
  Edit Process:<span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">Badge</span>
</h2>
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
          {availableParents.map((p) => ( // TODO: this formatting is pretty bad. Refactor later (or add a library like react-select)
            <option key={p.id} value={p.id}>
              {p.id} - {p.name}
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
          onChange={(e) =>
            setAreaId(e.target.value === '' ? null : parseInt(e.target.value, 10))
          }
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
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
      >
        Save Changes
      </button>
      <button
        type="button"
        onClick={cancelEditing}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      >
        Cancel
      </button>
    </form>
  );
};

export default ProcessEditForm;
