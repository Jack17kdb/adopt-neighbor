import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	address: {
		type: String,
		required: true,
		trim: true
	},
	phone: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true
	},
	eligibility: {
		type: Boolean,
		required: true
		// true = under 60 and no health issues
		// false = otherwise
	},
	comments: {
		type: String,
		trim: true,
		default: ""
	}
}, { timestamps: true });

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

export default Volunteer;
