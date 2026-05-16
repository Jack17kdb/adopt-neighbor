import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
	businessName: {
		type: String,
		required: true,
		trim: true
	},
	businessEmail: {
		type: String,
		required: true,
		lowercase: true,
		trim: true
	},
	title: {
		type: String,
		required: true,
		trim: true
	},
	description: {
		type: String,
		trim: true
	},
	image: {
		type: String,
		required: true
	},
	cloudinaryPublicId: {
		type: String
	},
	targetUrl: {
		type: String,
		required: true
	},
	placement: {
		type: String,
		enum: [
			"hero-between",   // HeroPage — between sections (×2)
			"hero-footer",    // HeroPage — footer strip (×1)
			"hero-top",       // VolunteerForm & NeighborForm — above form (×1 each)
			"form-bottom",    // VolunteerForm & NeighborForm — below form (×1 each)
			"auth-bottom",    // LoginPage — below login card (×1)
		],
		required: true
	},
	durationDays: {
		type: Number,
		required: true
	},
	amountPaid: {
		type: Number,
		required: true
	},
	startDate: Date,
	endDate: Date,

	status: {
		type: String,
		enum: ["PENDING_PAYMENT", "PENDING_APPROVAL", "ACTIVE", "REJECTED", "EXPIRED"],
		default: "PENDING_PAYMENT"
	}

}, {
	timestamps: true
});

export default mongoose.model("Ad", adSchema);
