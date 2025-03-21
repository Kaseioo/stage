// /backend/src/server.ts
//@ts-nocheck <-- we are not using @types/express here since we are short on time (this is definitely a bad idea)
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import db from './database';
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- API Routes ---

// TODO: Export this into a proper file. 

// Create a new process
app.post('/api/processes', async (req, res) => {
	try {
		const { name, parent_process_id, description } = req.body;

		// Basic input validation
		if (!name) {
			return res.status(400).json({ message: 'Name is required' });
		}
		if (parent_process_id) {
			const parentExists = await db.Process.findByPk(parent_process_id);
			if (!parentExists) {
				return res
					.status(400)
					.json({ message: 'Parent does not exists' });
			}
		}

		const process = await db.Process.create({
			name,
			parent_process_id: parent_process_id || null, // Ensure null if not provided
			description,
		});

		res.status(201).json(process);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
});

// Get all processes
app.get('/api/processes', async (req, res) => {
	try {
		const processes = await db.Process.findAll();
		res.json(processes);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

// Get direct children of a process
app.get('/api/processes/:id/children', async (req, res) => {
	try {
		const { id } = req.params;
		const children = await db.Process.findAll({
			where: { parent_process_id: id },
		});
		res.json(children);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

// Update a Process
app.put('/api/processes/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { name, parent_process_id, description } = req.body;

		if (!name) {
			return res.status(400).json({ message: 'Name is required' });
		}

		const process = await db.Process.findByPk(id);

		if (!process) {
			return res.status(404).json({ message: 'Process not found' });
		}
		if (parent_process_id) {
			if (parseInt(id) === parent_process_id) {
				return res
					.status(400)
					.json({ message: 'A process cannot be its own parent' });
			}
			const parentExists = await db.Process.findByPk(parent_process_id);
			if (!parentExists) {
				return res
					.status(400)
					.json({ message: 'Parent does not exists' });
			}
		}

		await process.update({
			name,
			parent_process_id: parent_process_id || null,
			description,
		});

		res.json(process);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error', error: error.message });
	}
});

app.delete('/api/processes/:id', async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const process = await db.Process.findByPk(id);
		if (!process) {
			return res.status(404).json({ message: 'Process not found' });
		}

		await process.destroy();
		res.status(204).send(); // No content
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Server Error',
			error: (error as Error).message,
		});
	}
});

// --- Area Routes ---

// Create an Area
app.post('/api/areas', async (req: Request, res: Response) => {
	try {
		const { name } = req.body;
		if (!name) {
			return res.status(400).json({ message: 'Area name is required' });
		}
		const area = await db.Area.create({ name });
		res.status(201).json(area);
	} catch (error) {
		if (error instanceof Error) {
			//To avoid Typescript errors, check if the error is an instance of the Error Class
			console.error(error);
			res.status(500).json({
				message: 'Server error',
				error: error.message,
			});
		}
	}
});

// Get all Areas
app.get('/api/areas', async (req: Request, res: Response) => {
	try {
		const areas = await db.Area.findAll();
		res.json(areas);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});
// Add an area_id to a process
app.put('/api/processes/:id', async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { name, parent_process_id, description, area_id } = req.body;

		if (!name) {
			return res.status(400).json({ message: 'Name is required' });
		}

		const process = await db.Process.findByPk(id);

		if (!process) {
			return res.status(404).json({ message: 'Process not found' });
		}
		if (parent_process_id) {
			if (parseInt(id) === parent_process_id) {
				return res
					.status(400)
					.json({ message: 'A process cannot be its own parent' });
			}
			const parentExists = await db.Process.findByPk(parent_process_id);
			if (!parentExists) {
				return res
					.status(400)
					.json({ message: 'Parent does not exists' });
			}
		}
		if (area_id) {
			const areaExists = await db.Area.findByPk(area_id);
			if (!areaExists) {
				return res
					.status(400)
					.json({ message: 'Area does not exists' });
			}
		}

		await process.update({
			name,
			parent_process_id: parent_process_id || null,
			description,
			area_id,
		});

		res.json(process);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Server Error',
			error: (error as Error).message,
		});
	}
});
// Create a Process
app.post('/api/processes', async (req: Request, res: Response) => {
	try {
		const { name, parent_process_id, description, area_id } = req.body;

		// Basic input validation
		if (!name) {
			return res.status(400).json({ message: 'Name is required' });
		}
		if (parent_process_id) {
			const parentExists = await db.Process.findByPk(parent_process_id);
			if (!parentExists) {
				return res
					.status(400)
					.json({ message: 'Parent does not exists' });
			}
		}
		if (area_id) {
			const areaExists = await db.Area.findByPk(area_id);
			if (!areaExists) {
				return res
					.status(400)
					.json({ message: 'Area does not exists' });
			}
		}

		const process = await db.Process.create({
			name,
			parent_process_id: parent_process_id || null, // Ensure null if not provided
			description,
			area_id,
		});

		res.status(201).json(process);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Server error',
			error: (error as Error).message,
		});
	}
});

// Get processes based on areaId
app.get('/api/processes/area/:areaId', async (req: Request, res: Response) => {
	try {
		const { areaId } = req.params;
		const processes = await db.Process.findAll({
			where: { area_id: areaId },
		});
		res.json(processes);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Server error',
			error: (error as Error).message,
		});
	}
});

// Sync the database and start the server.
// TODO: Get this into a proper file. Also, handle errors better.
(async () => {
	try {
		await db.sequelize.sync({ force: true }); // <-- will cause the database to be reset on each run. All data will be lost!
		console.log('Database synced');
		app.listen(port, () => {
			console.log(`Server listening on port ${port}`);
		});
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
})();
