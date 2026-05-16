import jwt from 'jsonwebtoken';

const generateToken = (id, res) => {
	const token = jwt.sign({id}, process.env.JWT_SECRET, {
		expiresIn: '7d'
	});

	res.cookie("token", token, {
		maxAge: 7 * 24 * 60 * 60 * 1000,
		httpOnly: true,
		// FIX: was 'strict' in production which blocks cookie on cross-origin redirects
		// 'lax' allows cookie to be sent on top-level navigations and same-site requests
		sameSite: 'lax',
		// FIX: secure:true breaks localhost dev (http). Only enforce on production
		secure: process.env.NODE_ENV === 'production',
		path: '/'
	});
};

export default generateToken;
