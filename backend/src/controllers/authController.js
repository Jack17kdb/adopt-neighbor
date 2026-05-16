import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

const login = async(req, res) => {
	try{
		const { email, password } = req.body;
		if(!email || !password) return res.status(400).json({ message: "Please fill all fields." });

		const user = await User.findOne({ email });
		if(!user) return res.status(400).json({ message: "Invalid credentials." });

		const isMatch = await bcrypt.compare(password, user.password);
		if(!isMatch) return res.status(400).json({ message: "Invalid credentials." });

		generateToken(user._id, res);

		res.status(200).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			role: user.role
                });
	} catch(error) {
		console.log("Error logging in user: ", error);
		res.status(500).json({ message: "Error logging in user" });
	}
};

const logout = async(req, res) => {
        try{
		res.cookie("token", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully." })
	} catch(error) {
		console.log("Error logging out user: ", error);
		res.status(500).json({ message: "Error logging out user" });
	}
};

const authcheck = async(req, res) => {
        try{
		const user = req.user;
		res.status(200).json(user);
	} catch(error) {
		console.log("Error checking auth: ", error);
		res.status(500).json({ message: "Error checking auth" });
	}
};

export default { login, logout, authcheck };
