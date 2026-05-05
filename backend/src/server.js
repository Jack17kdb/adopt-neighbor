import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './lib/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import neighborRoutes from './routes/neighborRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import { logger, errorLogger } from './middleware/logger.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';


dotenv.config();

const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(cors({
	origin: process.env.CLIENT_URL || "http://localhost:5173",
	credentials: true
}));

app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			'default-src': ["'self'"],
			'img-src': ["'self'", "data:"],
			'script-src': ["'self'", "'unsafe-inline'"],
			'connect-src': ["'self'"]
		}
	}
}));

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(logger);
app.use(errorLogger);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/neighbors', neighborRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/email', emailRoutes);

if(process.env.NODE_ENV === 'production'){
	app.use(express.static(path.join(__dirname, "../../frontend/dist")));

	app.get('*all', (req, res) => {
		res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
	})
};

app.listen(PORT, () => {
	console.log("Serving from:", path.join(__dirname, "../../frontend/dist"));
	console.log(`Server running on port: ${PORT}`);
	connectDB();
});
