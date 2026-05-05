const admin = (req, res, next) => {
	try{
		const user = req.user;

		if(user.role !== 'admin') return res.status(403).json({ message: "Unauthorized - Admin only" });

		next();
	} catch(error) {
		console.log("Error confirming admin: ", error);
	}
};

export default admin;
