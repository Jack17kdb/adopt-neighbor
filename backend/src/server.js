import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './lib/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
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

app.get('/', (req, res) => {
	res.status(200).json({ message: "Welcome to Adopt a Neighbor" });
});

app.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`);
	connectDB();
});
