import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import Match from '../models/matchModel.js';
import Volunteer from '../models/volunteerModel.js';
import Neighbor from '../models/neighborModel.js';
import { staffWelcomeEmail } from '../lib/emails.js';
import sendEmail from '../lib/emailService.js';

const getStaffMembers = async(req, res) => {
	try{
		const members = await User.find({}).sort({ createdAt: -1 });
		res.status(200).json(members || []);
	} catch(error) {
		console.log("Error fetching members: ", error);
		res.status(500).json({ message: "Error fetching members" });
	}
};

const addStaffMember = async(req, res) => {
	try{
		const { username, email, password } = req.body;
		if(!username || !email || !password) return res.status(400).json({ message: "Please enter all details" });

		const exists = await User.findOne({
			$or: [{username}, {email}]
		});

		if(exists) return res.status(400).json({ message: "Username or Email already exists" });

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const newStaff = await User.create({
			username,
			email,
			password: hash,
			role: "staff"
		});

		try {
			const staffEmail = staffWelcomeEmail(newStaff.username, newStaff.email, newStaff.password);
			await sendEmail({ to: newStaff.email, subject: staffEmail.subject, html: staffEmail.html });
		} catch(error) {
			console.log("Could not send staff welcome email: ", error.message);
			res.status(500).json({ message: "Could not send staff welcome email" });
		}

		res.status(200).json({ message: "Staff member created successfully" });
	} catch(error) {
		console.log("Error adding member: ", error);
		res.status(500).json({ message: "Error adding member" });
	}
};

const getStaffMember = async(req, res) => {
        try{
		const { staffId } = req.params;

		const member = await User.findById(staffId);

		res.status(200).json({
			username: member.username,
			email: member.email
		});
	} catch(error) {
		console.log("Error fetching member: ", error);
		res.status(500).json({ message: "Error fetching member" });
	}
};

const getVolunteers = async(req, res) => {
	try{
		const volunteers = await Volunteer.find({}).sort({ createdAt: -1 });
		res.status(200).json(volunteers || []);
	} catch(error) {
		console.log("Error fetching volunteers: ", error);
		res.status(500).json({ message: "Error fetching volunteers" });
	}
};

const getVolunteer = async(req, res) => {
	try{
		const { volunteerId } = req.params;

		const volunteer = await Volunteer.findById(volunteerId);

		res.status(200).json(volunteer);
	} catch(error) {
		console.log("Error fetching volunteer: ", error);
                res.status(500).json({ message: "Error fetching volunteer" });
	}
};

const getNeighbors = async(req, res) => {
	try{
		const neighbors = await Neighbor.find({}).sort({ createdAt: -1 });
		res.status(200).json(neighbors || []);
	} catch(error) {
		console.log("Error fetching neighbors: ", error);
		res.status(500).json({ message: "Error fetching neighbors" });
	}
};

const getNeighbor = async(req, res) => {
	try{
		const { neighborId } = req.params;

                const neighbor = await Neighbor.findById(neighborId);

                res.status(200).json(neighbor);
	} catch(error) {
		console.log("Error fetching neighbor: ", error);
                res.status(500).json({ message: "Error fetching neighbor" });
	}
};

export default { getStaffMembers, addStaffMember, getStaffMember, getVolunteers, getVolunteer, getNeighbors, getNeighbor };
