import sendEmail from '../lib/emailService.js';
import Match from '../models/matchModel.js';
import Volunteer from '../models/volunteerModel.js';
import Neighbor from '../models/neighborModel.js';
import { volunteerMatchEmail, neighborMatchEmail } from '../lib/emails.js';

const createMatch = async(req, res) => {
	try{
		const { volunteerName, neighborName } = req.body;
		if(!volunteerName || !neighborName) return res.status(400).json({ message: "Please fill in all details" });

		const volunteer = await Volunteer.findOne({ name: volunteerName });
		if(!volunteer) return res.status(400).json({ message: "No volunteer found." });

		const neighbor = await Neighbor.findOne({ name: neighborName });
                if(!neighbor) return res.status(400).json({ message: "No neighbor found." });

		try{
			const volunteerEmail = volunteerMatchEmail(volunteer.name, neighbor);
			const neighborEmail = neighborMatchEmail(neighbor.name, volunteer);

			await sendEmail({ to: volunteer.email, subject: volunteerEmail.subject, html: volunteerEmail.html });
			await sendEmail({ to: neighbor.email, subject: neighborEmail.subject, html: neighborEmail.html });
		} catch(error) {
			console.log("Error sending emails: ", error);
			res.status(500).json({ message: "Error sending emails" });
		}

		const newMatch = await Match.create({
			volunteerId: volunteer._id,
			neighborId: neighbor._id
		});

		volunteer.status = "matched";
		neighbor.status = "matched";
		await volunteer.save();
		await neighbor.save();

		res.status(201).json(newMatch);
	} catch(error) {
		console.log("Error matching: ", error);
		res.status(500).json({ message: "Error matching" });
	}
};

const getMatches = async(req, res) => {
        try{
		const matches = await Match.find({}).sort({ createdAt: -1 });
		res.status(200).json(matches || []);
	} catch(error) {
		console.log("Error fetching matches: ", error);
		res.status(500).json({ message: "Error fetching matches" });
	}
};

const confirmVolunteer = async(req, res) => {
        try{
		const { name } = req.body;

		const volunteer = await Volunteer.findById(name);
		if(!volunteer) return res.status(400).json({ message: "Volunteer not found" });

		const match = await Match.findOne({ volunteerId: volunteer._id });
		if(!match) return res.status(400).json({ message: "Match not found" });

		match.confirmedVolunteer = "C";

		if (match.confirmedVolunteer === "C" && match.confirmedNeighbor === "C") {
			match.status = "confirmed";
		}

		await match.save();

		res.status(200).json({ message: "Volunteer confirmed" });
	} catch(error) {
		console.log("Error confirming volunteer: ", error);
		res.status(500).json({ message: "Error confirming volunteer" });
	}
};

const confirmNeighbor = async(req, res) => {
        try{
		const { name } = req.body;

		const neighbor = await Neighbor.findById(name);
		if(!neighbor) return res.status(400).json({ message: "neighbor not found" });

		const match = await Match.findOne({ neighborId: neighbor._id });
		if(!match) return res.status(400).json({ message: "Match not found" });

		match.confirmedNeighbor = "C";

		if(match.confirmedVolunteer === "C" && match.confirmedNeighbor === "C") {
			match.status = "confirmed";
		}

		await match.save();

		res.status(200).json({ message: "Neighbor confirmed" });
	} catch(error) {
		console.log("Error confirming neighbor: ", error);
		res.status(500).json({ message: "Error confirming neighbor" });
	}
};

const rematch = async(req, res) => {
        try{
		const { matchId } = req.params;

		const match = await Match.findById(matchId);
		const volunteer = await Volunteer.findById(match.volunteerId);
		const neighbor = await Neighbor.findById(match.neighborId);

		match.status = "closed";
		volunteer.status = "unmatched";
		neighbor.status = "unmatched";

		await match.save();
		await volunteer.save();
		await neighbor.save();

		res.status(200).json({ message: "rematch successful" });
	} catch(error) {
		console.log("Error rematching: ", error);
		res.status(500).json({ message: "Error rematching" });
	}
};

export default { createMatch, getMatches, confirmVolunteer, confirmNeighbor, rematch };
