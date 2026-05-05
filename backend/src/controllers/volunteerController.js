import sendEmail from '../lib/emailService.js';
import Volunteer from '../models/volunteerModel.js';
import { certifiedVolunteerWelcomeEmail, uncertifiedVolunteerEmail } from '../lib/emails.js';


const createVolunteer = async(req, res) => {
	try{
		const { name, address, phone, email, age, disability, comment } = req.body;
		if(!name || !address || !phone || !email || !age || !disability || !comment) return res.status(400).json({ message: "Please fill all details." });

		const eligibility = age < 60 && disability === 'no';

		let exists = await Volunteer.findOne({ name });
		if(exists) return res.status(400).json({ message: "Name already exists." });

		exists = await Volunteer.findOne({ phone });
		if(exists) return res.status(400).json({ message: "Phone number already exists." });

		exists = await Volunteer.findOne({ email });
		if(exists) return res.status(400).json({ message: "Email already exists." });

		const newVolunteer = await Volunteer.create({
			name,
			address,
			phone,
			email,
			eligibility,
			comment
		});

		try{
			if(eligibility === false) {
				const uncertifiedemail = uncertifiedVolunteerEmail(name);
				await sendEmail({ to: email, subject: uncertifiedemail.subject, html: uncertifiedemail.html });
			} else {
				const htmlemail = certifiedVolunteerWelcomeEmail(name);
				await sendEmail({ to: email, subject: htmlemail.subject, html: htmlemail.html });
			}
		} catch(error) {
			console.log("Error sending email: ", error);
			return res.status(500).json({ message: "Error sending email." });
		}

		res.status(201).json({ message: "Welcome to Adopt a Neighbor" });
	} catch(error) {
		console.log("Error registering volunteer: ", error);
		res.status(500).json({ message: "Error registering volunteer" })
	}
};

export default { createVolunteer };
