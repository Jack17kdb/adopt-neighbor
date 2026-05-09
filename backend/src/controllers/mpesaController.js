import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_CALLBACK_URL } = process.env;

const getAccessToken = async () => {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  const { data } = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}` } }
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
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (data.ResponseCode === '0') {
      return res.status(200).json({ message: 'STK push sent successfully. Check your phone.', checkoutRequestId: data.CheckoutRequestID });
    } else {
      return res.status(400).json({ message: data.ResponseDescription || 'STK push failed' });
    }
  } catch (error) {
    console.error('M-Pesa STK error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to initiate M-Pesa payment' });
  }
};

const mpesaCallback = async (req, res) => {
  try {
    const body = req.body?.Body?.stkCallback;
    if (!body) return res.status(200).json({ message: 'OK' });
    const { ResultCode, ResultDesc, CallbackMetadata } = body;
    if (ResultCode === 0) {
      const items = CallbackMetadata?.Item || [];
      const get = (name) => items.find(i => i.Name === name)?.Value;
      console.log('M-Pesa payment received:', { amount: get('Amount'), phone: get('PhoneNumber'), receipt: get('MpesaReceiptNumber') });
    } else {
      console.log('M-Pesa payment failed:', ResultDesc);
    }
    res.status(200).json({ message: 'Callback received' });
  } catch (error) {
    console.error('Callback error:', error.message);
    res.status(200).json({ message: 'OK' });
  }
};

export default { stkPush, mpesaCallback };
