import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ['contribution', 'withdrawal'],
		required: true
	},
	status: {
		type: String,
		enum: ['pending', 'success', 'failed'],
		default: 'pending'
	},
	amount: {
		type: Number,
		required: true,
		min: 1
	},
	phone: {
		type: String,
		required: true
	},
	checkoutRequestId: String,
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
