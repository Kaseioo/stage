// backend/src/routes/processRoutes.ts
import { Router } from 'express';
import {
	getAllProcesses,
	getProcessById,
	createProcess,
	updateProcess,
	deleteProcess,
} from '../controllers/processController';

const router = Router();

// GET /api/processes - Get all processes
router.get('/', getAllProcesses);

// GET /api/processes/:id - Get a single process by ID
router.get('/:id', getProcessById);

// POST /api/processes - Create a new process
router.post('/', createProcess);

// PUT /api/processes/:id - Update an existing process by ID
// Note: We are going to be replacing the entire resource here, since
// we are using PUT rather than PATCH.
router.put('/:id', updateProcess);

// DELETE /api/processes/:id - Delete a process by ID
router.delete('/:id', deleteProcess);

export default router;
