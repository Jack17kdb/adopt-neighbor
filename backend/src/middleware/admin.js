const admin = (req, res, next) => {
	try {
		const user = req.user;

		if (!user) return res.status(403).json({ message: "Unauthorized - No user attached to request" });

		if (user.role !== 'admin') return res.status(403).json({ message: "Unauthorized - Admin only" });

		next();
	} catch (error) {
		console.log("Error confirming admin: ", error);
		return res.status(500).json({ message: "Error confirming admin" });
	}
};

export default admin;
