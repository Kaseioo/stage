// frontend/src/Process/ProcessTree.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProcessList from './ProcessList';
import ProcessForm from './ProcessForm';
import ProcessEditForm from './ProcessEditForm';
import AreaForm from '../Area/AreaForm';
import { Process, Area } from '../types';

const ProcessTree: React.FC = () => {
    const [processes, setProcesses] = useState<Process[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [editingProcess, setEditingProcess] = useState<Process | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const processesResponse = await axios.get<Process[]>('http://localhost:3001/api/processes');
                setProcesses(processesResponse.data);

                const areasResponse = await axios.get<Area[]>('http://localhost:3001/api/areas');
                setAreas(areasResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Error fetching data. Check console.');
            }
        };

        fetchData();
    }, []);

    const addProcess = async (newProcess: Omit<Process, 'id'>) => {
        try {
            const response = await axios.post<Process>('http://localhost:3001/api/processes', newProcess);
            setProcesses([...processes, response.data]);
        } catch (error) {
            console.error('Error adding process:', error);
            alert('Error adding process. Check console.');
        }
    };

    const updateProcess = async (updatedProcess: Process) => {
        try {
            const response = await axios.put<Process>(
                `http://localhost:3001/api/processes/${updatedProcess.id}`,
                updatedProcess
            );
            setProcesses(processes.map((p) => (p.id === updatedProcess.id ? response.data : p)));
            setEditingProcess(null);
            // Update all processes
            const processesResponse = await axios.get<Process[]>('http://localhost:3001/api/processes');
            setProcesses(processesResponse.data);
        } catch (error) {
            console.error('Error updating process:', error);
            alert('Error updating process. Check console.');
        }
    };

    const deleteProcess = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3001/api/processes/${id}`);
            setProcesses(processes.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Error deleting process:', error);
            alert('Error deleting process. Check console.');
        }
    };

    const startEditing = (process: Process) => {
        setEditingProcess(process);
    };

    const cancelEditing = () => {
        setEditingProcess(null);
    };

    const handleAreaAdded = (newArea: Area) => {
        setAreas([...areas, newArea]);
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Process Mapper</h1>
            <AreaForm onAreaAdded={handleAreaAdded} />

            <ProcessForm areas={areas} addProcess={addProcess} processes={processes} />

            {editingProcess && (
                <ProcessEditForm
                    process={editingProcess}
                    areas={areas}
                    updateProcess={updateProcess}
                    cancelEditing={cancelEditing}
                    processes={processes}
                />
            )}

            <h2 className="text-xl font-semibold mt-4 mb-2">Process Tree</h2>
            <ProcessList
                processes={processes}
                editProcess={startEditing}
                deleteProcess={deleteProcess}
            />
        </div>
    );
};

export default ProcessTree;
