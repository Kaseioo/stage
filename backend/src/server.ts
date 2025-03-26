// /backend/src/server.ts
//@ts-nocheck <-- we are not using @types/express here since we are short on time (this is definitely a bad idea)
import express, { Request, Response, NextFunction } from 'express';

import cors from 'cors';
import * as dotenv from 'dotenv';
import db from './database';
import processRouter from './routes/processRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
	console.log(`Received ${req.method} request at ${req.url}`);
	next();
});

async function startServer() {
	try {
		await db.sequelize.sync({ force: true }); // <-- will cause the database to be reset on each run. All data will be lost!
		app.use('/api/processes', processRouter); // Mount process routes. See /routes/processRoutes.

		app.get('/', (req: Request, res: Response) => {
			res.send('You should not be here. Try /api/processes instead.');
		});

		app.use(
			(err: Error, req: Request, res: Response, next: NextFunction) => {
				console.error('Unhandled Error:', err.stack || err);

				const statusCode =
					res.statusCode !== 200 ? res.statusCode : 500; // Use existing status code if set, else 500
				res.status(statusCode).json({
					message:
						err.message ||
						'An unexpected error occurred. Please contact your administrator.',
				});
			},
		);

		app.use((req: Request, res: Response) => {
			res.status(404).json({
				message: `Cannot ${req.method} ${req.path}`,
			});
		});

		app.listen(port, () => {
			console.log(
				`⚡️[server]: Server is running at http://localhost:${port}`,
			);
		});
	} catch (error) {
		console.error('Failed to initialize server:', error);
		process.exit(1);
	}
}

startServer();
