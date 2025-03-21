// frontend/src/Process/ProcessItem.tsx
import React from 'react';
import { Process } from '../types';

interface ProcessItemProps {
  process: Process;
  editProcess: (process: Process) => void;
  deleteProcess: (id: number) => void;
  children?: React.ReactNode;
}

const ProcessItem: React.FC<ProcessItemProps> = ({ process, editProcess, deleteProcess, children }) => {
  return (
    <li className="mb-2">
      <span className="font-bold">{process.name}</span>{' '}
      {process.area_id ? <span className="text-gray-600">(Area ID: {process.area_id})</span> : ''}
      {process.description ? `: ${process.description}` : ''}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-2 text-xs"
        onClick={() => editProcess(process)}
      >
        Edit
      </button>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-1 text-xs"
        onClick={() => deleteProcess(process.id)}
      >
        Delete
      </button>
      {children}
    </li>
  );
};

export default ProcessItem;
