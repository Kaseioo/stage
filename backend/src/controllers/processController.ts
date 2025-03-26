// backend/src/controllers/processController.ts
import { Request, Response, NextFunction } from 'express';
import db from '../database'; // Import the database instance

// --- Get All Processes ---
export const getAllProcesses = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const processes = await db.Process.findAll();
		res.status(200).json(processes);
	} catch (error) {
		next(error);
	}
};

// --- Get Process By ID ---
export const getProcessById = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id)) {
			res.status(400).json({ message: 'Invalid process ID format.' });
			return;
		}

		const process = await db.Process.findByPk(id);

		if (!process) {
			res.status(404).json({
				message: `Process with ID ${id} not found.`,
			});
		} else {
			res.status(200).json(process);
		}
	} catch (error) {
		next(error);
	}
};

// --- Create New Process ---
export const createProcess = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const {
			name,
			area_id,
			status,
			priority,
			description,
			parent_process_id,
			related_tools,
			related_users,
		} = req.body;

		if (!name || !area_id || !status || !priority) {
			res.status(400).json({
				message:
					'Missing required fields: name, area_id, status, priority',
			});
			return;
		}

		const newProcessData = {
			name,
			area_id,
			status,
			priority,
			description: description ?? null,
			parent_process_id: parent_process_id ?? null,
			related_tools: related_tools ?? null,
			related_users: related_users ?? null,
		};

		const newProcess = await db.Process.create(newProcessData);
		res.status(201).json(newProcess);
	} catch (error) {
		if (error instanceof Error && 'name' in error) {
			switch (error.name) {
				case 'SequelizeValidationError':
					res.status(400).json({
						message: 'Validation Error',
						errors: (error as any).errors,
					});
					break;
				case 'SequelizeForeignKeyConstraintError':
					res.status(400).json({
						message:
							'Invalid area_id or parent_process_id provided.',
					});
					break;
				default:
					next(error);
			}
		} else {
			next(error);
		}
	}
};

// --- Update Process ---
export const updateProcess = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id)) {
			res.status(400).json({ message: 'Invalid process ID format.' });
			return;
		}

		const process = await db.Process.findByPk(id);

		if (!process) {
			res.status(404).json({
				message: `Process with ID ${id} not found.`,
			});
			return;
		}

		const {
			name,
			area_id,
			status,
			priority,
			description,
			parent_process_id,
			related_tools,
			related_users,
		} = req.body;

		if (name === '' || area_id === '' || status === '' || priority === '') {
			res.status(400).json({
				message:
					'Required fields cannot be empty if provided for update.',
			});
			return;
		}

		const updatedData = {
			name: name ?? process.name,
			area_id: area_id ?? process.area_id,
			status: status ?? process.status,
			priority: priority ?? process.priority,
			description:
				description !== undefined ? description : process.description,
			parent_process_id:
				parent_process_id !== undefined
					? parent_process_id
					: process.parent_process_id,
			related_tools:
				related_tools !== undefined
					? related_tools
					: process.related_tools,
			related_users:
				related_users !== undefined
					? related_users
					: process.related_users,
		};

		await process.update(updatedData);
		res.status(200).json(process);
	} catch (error) {
		if (error instanceof Error && 'name' in error) {
			switch (error.name) {
				case 'SequelizeValidationError':
					res.status(400).json({
						message: 'Validation Error',
						errors: (error as any).errors,
					});
					break;
				case 'SequelizeForeignKeyConstraintError':
					res.status(400).json({
						message:
							'Invalid area_id or parent_process_id provided during update.',
					});
					break;
				default:
					next(error);
			}
		} else {
			next(error);
		}
	}
};

// --- Delete Process ---
export const deleteProcess = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id)) {
			res.status(400).json({ message: 'Invalid process ID format.' });
			return;
		}

		const process = await db.Process.findByPk(id);

		if (!process) {
			res.status(404).json({
				message: `Process with ID ${id} not found.`,
			});
			return;
		}

		await process.destroy();
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};
