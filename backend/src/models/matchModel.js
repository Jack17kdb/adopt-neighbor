import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
	volunteerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Volunteer',
		required: true
	},
	neighborId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Neighbor',
		required: true
        },
	status: {
		type: String,
		enum: ["pending", "confirmed", "managed", "closed"],
		default: "pending"
	},
	confirmedVolunteer: {
		type: String,
		enum: ["S", "C"],
		default: "S"
		// S = Sent
		// C = Confirmed
	},
	confirmedNeighbor: {
		type: String,
		enum: ["S", "C"],
		default: "S"
		// S = Sent
		// C = Confirmed
	},
}, { timestamps: true });

const Match = mongoose.model("Match", matchSchema);

export default Match;
