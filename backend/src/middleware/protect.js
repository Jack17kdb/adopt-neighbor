import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async(req, res, next) => {
	try{
		const token = req.cookies?.token;
		if(!token) return res.status(403).json({ message: "Unauthorized - No token provided" });

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if(!decoded) return res.status(403).json({ message: "Unauthorized - Invalid token provided" });

		const user = await User.findById(decoded.id).select("-password");
		if(!user) return res.status(403).json({ message: "Unauthorized - No user found" });

		req.user = user;
		next();
	} catch(error) {
		console.log("Error verifying token");
	}
};

export default protect;
