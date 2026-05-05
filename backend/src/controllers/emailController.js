import sendEmail from '../lib/emailService.js';
import Match from '../models/matchModel.js';
import Volunteer from '../models/volunteerModel.js';
import Neighbor from '../models/neighborModel.js';
import { volunteerCheckInEmail, neighborCheckEmail } from '../lib/emails.js';

const sendCheckIns = async(req, res) => {
	try{
		const matches = await Match.find({ status: "confirmed" });

		for(const match of matches) {
			const volunteer = await Volunteer.findById(match.volunteerId);
			const neighbor = await Neighbor.findById(match.neighborId);

			if (!volunteer || !neighbor) {
				console.log("Volunteer or Neighbor not found for match");
				continue;
			}

			const volunteerEmail = volunteerCheckInEmail(volunteer.name);
			await sendEmail({ to: volunteer.email, subject: volunteerEmail.subject, html: volunteerEmail.html });

			const neighborEmail = neighborCheckEmail(neighbor.name);
			await sendEmail({ to: neighbor.email, subject: neighborEmail.subject, html: neighborEmail.html });
		}

		res.status(200).json({ message: "Check-in emails sent successfully." });
	} catch(error) {
		console.error("Error sending check-in emails: ", error);
		res.status(500).json({ message: "Error sending check-in emails." });
	}
};

export default { sendCheckIns };
