export const logger = (req, res, next) => {
	const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} from ${req.ip}\n`;
	console.log(log.trim());
	next();
};

export const errorLogger = (err, req, res, next) => {
	const log = `[${new Date().toISOString()}] ERROR: ${err.message} at ${req.method} ${req.originalUrl}\n`;
	console.log(log.trim());
	next(err);
};
