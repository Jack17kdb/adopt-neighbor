import mongoose from 'mongoose';

const ledgerSchema = new mongoose.Schema({
	transaction: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Transaction',
		required: true,
	},
	entryType: {
		type: String,
		enum: ['credit', 'debit'],
		required: true,
	},
	amount: {
		type: Number,
		required: true,
		min: 1,
	},
	phone: String,
});

export default mongoose.model('Ledger', ledgerSchema);
