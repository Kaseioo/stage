// /backend/src/server.ts (Update to include area routes)
//@ts-nocheck
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import db from './database';
import processRouter from './routes/processRoutes';
import areaRouter from './routes/areaRoutes'; // Import area routes

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
		await db.sequelize.sync({ force: false }); // Avoid force:true in production!

		// mount our route files
		app.use('/api/processes', processRouter);
		app.use('/api/areas', areaRouter);

		app.get('/', (req: Request, res: Response) => {
			res.send(
				'You should not be here. Try /api/processes or /api/areas instead.',
			);
		});
		app.use(
			(err: Error, req: Request, res: Response, next: NextFunction) => {
				console.error('Unhandled Error:', err.stack || err);
				const statusCode =
					res.statusCode !== 200 ? res.statusCode : 500;
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
