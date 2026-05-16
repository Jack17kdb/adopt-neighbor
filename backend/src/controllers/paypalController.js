import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_BASE_URL } = process.env;

const getAccessToken = async () => {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const { data } = await axios.post(
    `${PAYPAL_BASE_URL}/v1/oauth2/token`,
    'grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return data.access_token;
};

const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'USD' } = req.body;
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) < 1) {
      return res.status(400).json({ message: 'Amount must be at least 1' });
    }
    const accessToken = await getAccessToken();
    const { data } = await axios.post(
      `${PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: { currency_code: currency, value: parseFloat(amount).toFixed(2) },
          description: 'Adopt a Neighbor Community Contribution',
        }],
        application_context: { brand_name: 'Adopt a Neighbor', user_action: 'PAY_NOW' },
      },
      { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );
    res.status(201).json({ id: data.id });
  } catch (error) {
    console.error('PayPal createOrder error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to create PayPal order' });
  }
};

const captureOrder = async (req, res) => {
  try {
    const { orderID } = req.params;
    const accessToken = await getAccessToken();
    const { data } = await axios.post(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );
    if (data.status === 'COMPLETED') {
      const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
      console.log('PayPal payment completed:', { id: capture?.id, amount: capture?.amount?.value });
      return res.status(200).json({ message: 'Payment successful! Thank you for your contribution.', details: data });
    }
    res.status(400).json({ message: 'Payment not completed', status: data.status });
  } catch (error) {
    console.error('PayPal captureOrder error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to capture PayPal order' });
  }
};

export default { createOrder, captureOrder };
