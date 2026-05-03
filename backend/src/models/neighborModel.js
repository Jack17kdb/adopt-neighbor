import mongoose from "mongoose";

const neighborSchema = new mongoose.Schema({
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
		trim: true,
		lowercase: true,
		default: ""
	},
	needs: {
		type: String,
		required: true,
		trim: true
	},
	comments: {
		type: String,
		trim: true,
		default: ""
	}
}, { timestamps: true });

const Neighbor = mongoose.model("Neighbor", neighborSchema);

export default Neighbor;
