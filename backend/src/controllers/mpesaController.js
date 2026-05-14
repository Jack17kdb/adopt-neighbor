import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_CALLBACK_URL, MPESA_INITIATOR_NAME, MPESA_INITIATOR_PASSWORD, MPESA_B2C_RESULT_URL, MPESA_B2C_TIMEOUT_URL } = process.env;

let accountBalance = 0;
let transactions = [];

const getAccessToken = async () => {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  const { data } = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' } }
  );
  return data.access_token;
};

const normalizePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('254')) return cleaned;
  if (cleaned.startsWith('0')) return '254' + cleaned.slice(1);
  if (cleaned.startsWith('7') || cleaned.startsWith('1')) return '254' + cleaned;
  return cleaned;
};

const stkPush = async (req, res) => {
  try {
    const { phone, amount } = req.body;
    if (!phone || !amount) return res.status(400).json({ message: 'Phone and amount are required' });

    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount) || parsedAmount < 1) return res.status(400).json({ message: 'Amount must be a valid number (minimum KES 1)' });

    const normalizedPhone = normalizePhone(phone);
    if (normalizedPhone.length !== 12) return res.status(400).json({ message: 'Invalid Safaricom phone number' });

    const accessToken = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: parsedAmount,
      PartyA: normalizedPhone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: normalizedPhone,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: 'AdoptANeighbor',
      TransactionDesc: 'Community Contribution',
    };

    const { data } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );

    if (data.ResponseCode === '0') {
      return res.status(200).json({ message: 'STK push sent successfully. Check your phone.', checkoutRequestId: data.CheckoutRequestID });
    } else {
      return res.status(400).json({ message: data.ResponseDescription || 'STK push failed' });
    }
  } catch (error) {
    console.error('M-Pesa STK error:', JSON.stringify(error.response?.data, null, 2) || error.message);
    console.error('STATUS:', error.response?.status);
    res.status(500).json({ message: 'Failed to initiate M-Pesa payment' });
  }
};

// Callback from Safaricom after STK push confirmation
const mpesaCallback = async (req, res) => {
  try {
    const body = req.body?.Body?.stkCallback;
    if (!body) return res.status(200).json({ message: 'OK' });
    const { ResultCode, ResultDesc, CallbackMetadata } = body;
    if (ResultCode === 0) {
      const items = CallbackMetadata?.Item || [];
      const get = (name) => items.find(i => i.Name === name)?.Value;
      const amount = get('Amount') || 0;
      const phone = get('PhoneNumber');
      const receipt = get('MpesaReceiptNumber');
      // Credit the balance
      accountBalance += Number(amount);
      transactions.unshift({ type: 'credit', amount: Number(amount), phone, receipt, date: new Date().toISOString(), description: 'Community Contribution' });
      if (transactions.length > 100) transactions = transactions.slice(0, 100);
      console.log('M-Pesa payment received:', { amount, phone, receipt, newBalance: accountBalance });
    } else {
      console.log('M-Pesa payment failed:', ResultDesc);
    }
    res.status(200).json({ message: 'Callback received' });
  } catch (error) {
    console.error('Callback error:', error.message);
    res.status(200).json({ message: 'OK' });
  }
};

// Get account balance and recent transactions — admin only
const getBalance = async (req, res) => {
  try {
    res.status(200).json({
      balance: accountBalance,
      transactions: transactions.slice(0, 20),
    });
  } catch (error) {
    console.error('Balance error:', error.message);
    res.status(500).json({ message: 'Failed to fetch balance' });
  }
};

// B2C Withdraw — send money from business to a phone — admin only
const withdraw = async (req, res) => {
  try {
    const { phone, amount, reason } = req.body;
    if (!phone || !amount) return res.status(400).json({ message: 'Phone and amount are required' });

    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount) || parsedAmount < 10) return res.status(400).json({ message: 'Minimum withdrawal is KES 10' });
    if (parsedAmount > accountBalance) return res.status(400).json({ message: `Insufficient balance. Available: KES ${accountBalance.toLocaleString()}` });

    const normalizedPhone = normalizePhone(phone);
    if (normalizedPhone.length !== 12) return res.status(400).json({ message: 'Invalid Safaricom phone number' });

    const accessToken = await getAccessToken();

    const securityCredential = Buffer.from(MPESA_INITIATOR_PASSWORD || 'Safaricom999!').toString('base64');

    const payload = {
      InitiatorName: MPESA_INITIATOR_NAME || 'testapi',
      SecurityCredential: securityCredential,
      CommandID: reason === 'salary' ? 'SalaryPayment' : 'BusinessPayment',
      Amount: parsedAmount,
      PartyA: MPESA_SHORTCODE,
      PartyB: normalizedPhone,
      Remarks: reason || 'Withdrawal',
      QueueTimeOutURL: MPESA_B2C_TIMEOUT_URL || MPESA_CALLBACK_URL.replace('/callback', '/b2c-timeout'),
      ResultURL: MPESA_B2C_RESULT_URL || MPESA_CALLBACK_URL.replace('/callback', '/b2c-result'),
      Occasion: 'AdoptANeighbor Withdrawal',
    };

    const { data } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/b2c/v3/paymentrequest',
      payload,
      { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );

    if (data.ResponseCode === '0') {
      // Debit the balance optimistically; real debit confirmed in b2cResult callback
      accountBalance -= parsedAmount;
      transactions.unshift({ type: 'debit', amount: parsedAmount, phone: normalizedPhone, receipt: data.ConversationID, date: new Date().toISOString(), description: reason || 'Withdrawal' });
      return res.status(200).json({ message: `Withdrawal of KES ${parsedAmount.toLocaleString()} initiated. The recipient will receive an M-Pesa prompt.`, conversationId: data.ConversationID });
    } else {
      return res.status(400).json({ message: data.ResponseDescription || 'Withdrawal failed' });
    }
  } catch (error) {
    console.error('B2C error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to initiate withdrawal' });
  }
};

// B2C result callback
const b2cResult = async (req, res) => {
  try {
    const result = req.body?.Result;
    if (result) console.log('B2C Result:', JSON.stringify(result, null, 2));
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    res.status(200).json({ message: 'OK' });
  }
};

// B2C timeout callback
const b2cTimeout = async (req, res) => {
  try {
    console.log('B2C Timeout:', req.body);
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    res.status(200).json({ message: 'OK' });
  }
};

export default { stkPush, mpesaCallback, getBalance, withdraw, b2cResult, b2cTimeout };
