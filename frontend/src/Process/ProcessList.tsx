// frontend/src/Process/ProcessList.tsx
import React from 'react';
import ProcessItem from './ProcessItem';
import { Process } from '../types';

interface ProcessListProps {
  processes: Process[];
  editProcess: (process: Process) => void;
  deleteProcess: (id: number) => void;
}

const ProcessList: React.FC<ProcessListProps> = ({ processes, editProcess, deleteProcess }) => {
  const buildTree = (processList: Process[], parentId: number | null = null): Process[] => {
    const tree: Process[] = [];
    for (const process of processList) {
        if (process.parent_process_id === parentId) {
            const children = buildTree(processList, process.id);
            if (children.length > 0) {
                process.subProcesses = children;
            }
            tree.push(process);
        }
    }
    return tree;
};
  const renderTree = (processList: Process[]) => {
    return(
        <ul className="list-disc ml-4">
        {processList.map((process) => (
          <ProcessItem
            key={process.id}
            process={process}
            editProcess={editProcess}
            deleteProcess={deleteProcess}
          >
            {process.subProcesses && renderTree(process.subProcesses)}
          </ProcessItem>

        ))}
      </ul>
    )
  }
    return (
        <>
            {renderTree(buildTree(processes))}
        </>
    )

};

export default ProcessList;
