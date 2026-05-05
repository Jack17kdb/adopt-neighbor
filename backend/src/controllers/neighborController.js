import sendEmail from '../lib/emailService.js';
import Neighbor from '../models/neighborModel.js';
import { neighborWelcomeEmail } from '../lib/emails.js';

const createNeighbor = async(req, res) => {
	try{
		const { name, address, phone, email, needs, comment } = req.body;
		if(!name || !address || !phone || !email || !needs) return res.status(400).json({ message: "Please fill all details." });

		let exists = await Neighbor.findOne({ name });
		if(exists) return res.status(400).json({ message: "Name already exists." });

		exists = await Neighbor.findOne({ phone });
		if(exists) return res.status(400).json({ message: "Phone number already exists." });

		exists = await Neighbor.findOne({ email });
		if(exists) return res.status(400).json({ message: "Email already exists." });

		const newNeighbor = await Neighbor.create({
			name,
			address,
			phone,
			email,
			needs,
			comment
		});

		try{
			const neighborEmail = neighborWelcomeEmail(name);
			await sendEmail({ to: email, subject: neighborEmail.subject, html: neighborEmail.html });
		} catch(error) {
			console.log("Error sending email: ", error);
			return res.status(500).json({ message: "Error sending email." });
		}

		res.status(201).json({ message: "Welcome to Adopt a Neighbor" });
	} catch(error) {
		console.log("Error registering neighbor: ", error);
		res.status(500).json({ message: "Error registering neighbor" });
	}
};

export default { createNeighbor };
