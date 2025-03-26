// /backend/src/controllers/areaController.ts
import { Request, Response, NextFunction } from 'express';
import db from '../database';

// --- Get All Areas ---
export const getAllAreas = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const areas = await db.Area.findAll();
		res.status(200).json(areas);
	} catch (error) {
		next(error);
	}
};

// --- Get Area By ID ---
export const getAreaById = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id)) {
			res.status(400).json({ message: 'Invalid area ID format.' });
			return;
		}

		const area = await db.Area.findByPk(id);

		if (!area) {
			res.status(404).json({
				message: `Area with ID ${id} not found.`,
			});
		} else {
			res.status(200).json(area);
		}
	} catch (error) {
		next(error);
	}
};

// --- Create New Area ---
export const createArea = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { name } = req.body;

		if (!name) {
			res.status(400).json({ message: 'Missing required field: name' });
			return;
		}

		const newArea = await db.Area.create({ name });
		res.status(201).json(newArea);
	} catch (error) {
		if (error instanceof Error && 'name' in error) {
			switch (error.name) {
				case 'SequelizeValidationError':
					res.status(400).json({
						message: 'Validation Error',
						errors: (error as any).errors,
					});
					break;
				case 'SequelizeUniqueConstraintError':
					res.status(400).json({
						message: 'Area name already exists.',
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

// --- Update Area ---
export const updateArea = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id)) {
			res.status(400).json({ message: 'Invalid area ID format.' });
			return;
		}

		const area = await db.Area.findByPk(id);

		if (!area) {
			res.status(404).json({
				message: `Area with ID ${id} not found.`,
			});
			return;
		}

		const { name } = req.body;

		if (!name) {
			res.status(400).json({ message: 'Missing required field: name' });
			return;
		}

		area.name = name; //update the area object.
		await area.save(); //save the area object.
		res.status(200).json(area);
	} catch (error) {
		if (error instanceof Error && 'name' in error) {
			switch (error.name) {
				case 'SequelizeValidationError':
					res.status(400).json({
						message: 'Validation Error',
						errors: (error as any).errors,
					});
					break;
				case 'SequelizeUniqueConstraintError':
					res.status(400).json({
						message: 'Area name already exists.',
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

// --- Delete Area ---
export const deleteArea = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = parseInt(req.params.id, 10);
		if (isNaN(id)) {
			res.status(400).json({ message: 'Invalid area ID format.' });
			return;
		}

		const area = await db.Area.findByPk(id);

		if (!area) {
			res.status(404).json({
				message: `Area with ID ${id} not found.`,
			});
			return;
		}

		await area.destroy();
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};
