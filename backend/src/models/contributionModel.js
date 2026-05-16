import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema({
	contributorName: {
		type: String,
		trim: true
	},
	contributorEmail: {
		type: String,
		trim: true,
		lowercase: true
	},
	amount: {
		type: Number,
		required: true
	},
	currency: {
		type: String,
		default: "USD"
	},
	paypalOrderId: {
		type: String,
		required: true
	},
	paypalCaptureId: {
		type: String
	},
	status: {
		type: String,
		enum: ["PENDING", "COMPLETED", "FAILED"],
		default: "PENDING"
	}
}, {
  timestamps: true
});

export default mongoose.model("Contribution", contributionSchema);
