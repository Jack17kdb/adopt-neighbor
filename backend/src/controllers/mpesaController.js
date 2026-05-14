import axios from 'axios';
import dotenv from 'dotenv';
import Transaction from '../models/transactionModel.js';
import Ledger from '../models/ledgerModel.js';

dotenv.config();

const {
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_SHORTCODE,
  MPESA_PASSKEY,
  MPESA_CALLBACK_URL,
  MPESA_INITIATOR_NAME,
  MPESA_INITIATOR_PASSWORD,
  MPESA_B2C_RESULT_URL,
  MPESA_B2C_TIMEOUT_URL
} = process.env;

const getAccessToken = async () => {
  const auth = Buffer.from(
    `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const { data } = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    }
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

    if (!phone || !amount) {
      return res.status(400).json({
        message: 'Phone and amount are required'
      });
    }

    const parsedAmount = parseInt(amount);

    if (isNaN(parsedAmount) || parsedAmount < 1) {
      return res.status(400).json({
        message: 'Amount must be a valid number'
      });
    }

    const normalizedPhone = normalizePhone(phone);

    if (normalizedPhone.length !== 12) {
      return res.status(400).json({
        message: 'Invalid Safaricom number'
      });
    }

    const accessToken = await getAccessToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, 14);

    const password = Buffer.from(
      `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

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
      TransactionDesc: 'Community Contribution'
    };

    const { data } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    if (data.ResponseCode === '0') {
      await Transaction.create({
        type: 'contribution',
        status: 'pending',
        amount: parsedAmount,
        phone: normalizedPhone,
        checkoutRequestId: data.CheckoutRequestID
      });

      return res.status(200).json({
        message: 'STK push sent successfully',
        checkoutRequestId: data.CheckoutRequestID
      });
    }

    return res.status(400).json({
      message: data.ResponseDescription || 'STK push failed'
    });

  } catch (error) {
    console.error(
      'M-Pesa STK error:',
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: 'Failed to initiate payment'
    });
  }
};

const mpesaCallback = async (req, res) => {
  try {
    const body = req.body?.Body?.stkCallback;

    if (!body) {
      return res.status(200).json({
        message: 'OK'
      });
    }

    const {
      ResultCode,
      ResultDesc,
      CallbackMetadata,
      CheckoutRequestID
    } = body;

    const transaction = await Transaction.findOne({
      checkoutRequestId: CheckoutRequestID
    });

    if (!transaction) {
      return res.status(200).json({
        message: 'Transaction not found'
      });
    }

    if (ResultCode === 0) {
      const items = CallbackMetadata?.Item || [];

      const get = (name) =>
        items.find(i => i.Name === name)?.Value;

      const amount = get('Amount') || 0;
      const phone = get('PhoneNumber');

      transaction.status = 'success';
      await transaction.save();

      const existingLedger = await Ledger.findOne({
        transaction: transaction._id
      });

      if (!existingLedger) {
        await Ledger.create({
          transaction: transaction._id,
          entryType: 'credit',
          amount: Number(amount),
          phone
        });
      }

    } else {
      transaction.status = 'failed';
      await transaction.save();

      console.log('Payment failed:', ResultDesc);
    }

    return res.status(200).json({
      message: 'Callback received'
    });

  } catch (error) {
    console.error('Callback error:', error.message);

    return res.status(200).json({
      message: 'OK'
    });
  }
};

const getBalance = async (req, res) => {
  try {
    const credits = await Ledger.aggregate([
      {
        $match: {
          entryType: 'credit'
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$amount'
          }
        }
      }
    ]);

    const debits = await Ledger.aggregate([
      {
        $match: {
          entryType: 'debit'
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$amount'
          }
        }
      }
    ]);

    const totalCredits = credits[0]?.total || 0;
    const totalDebits = debits[0]?.total || 0;

    const balance = totalCredits - totalDebits;

    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      balance,
      totalCredits,
      totalDebits,
      transactions
    });

  } catch (error) {
    console.error('Balance error:', error.message);

    return res.status(500).json({
      message: 'Failed to fetch balance'
    });
  }
};

const withdraw = async (req, res) => {
  try {
    const { phone, amount, reason } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({
        message: 'Phone and amount are required'
      });
    }

    const parsedAmount = parseInt(amount);

    if (isNaN(parsedAmount) || parsedAmount < 10) {
      return res.status(400).json({
        message: 'Minimum withdrawal is KES 10'
      });
    }

    const credits = await Ledger.aggregate([
      {
        $match: {
          entryType: 'credit'
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$amount'
          }
        }
      }
    ]);

    const debits = await Ledger.aggregate([
      {
        $match: {
          entryType: 'debit'
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$amount'
          }
        }
      }
    ]);

    const balance =
      (credits[0]?.total || 0) -
      (debits[0]?.total || 0);

    if (parsedAmount > balance) {
      return res.status(400).json({
        message: `Insufficient balance. Available: KES ${balance}`
      });
    }

    const normalizedPhone = normalizePhone(phone);

    if (normalizedPhone.length !== 12) {
      return res.status(400).json({
        message: 'Invalid Safaricom number'
      });
    }

    const accessToken = await getAccessToken();

    const securityCredential = Buffer.from(
      MPESA_INITIATOR_PASSWORD || 'Safaricom999!'
    ).toString('base64');

    const payload = {
      InitiatorName: MPESA_INITIATOR_NAME || 'testapi',
      SecurityCredential: securityCredential,
      CommandID:
        reason === 'salary'
          ? 'SalaryPayment'
          : 'BusinessPayment',
      Amount: parsedAmount,
      PartyA: MPESA_SHORTCODE,
      PartyB: normalizedPhone,
      Remarks: reason || 'Withdrawal',
      QueueTimeOutURL:
        MPESA_B2C_TIMEOUT_URL ||
        MPESA_CALLBACK_URL.replace(
          '/callback',
          '/b2c-timeout'
        ),
      ResultURL:
        MPESA_B2C_RESULT_URL ||
        MPESA_CALLBACK_URL.replace(
          '/callback',
          '/b2c-result'
        ),
      Occasion: 'AdoptANeighbor Withdrawal'
    };

    const { data } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/b2c/v3/paymentrequest',
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    if (data.ResponseCode === '0') {
      const transaction = await Transaction.create({
        type: 'withdrawal',
        status: 'success',
        amount: parsedAmount,
        phone: normalizedPhone
      });

      await Ledger.create({
        transaction: transaction._id,
        entryType: 'debit',
        amount: parsedAmount,
        phone: normalizedPhone
      });

      return res.status(200).json({
        message: 'Withdrawal initiated successfully'
      });
    }

    return res.status(400).json({
      message: data.ResponseDescription || 'Withdrawal failed'
    });

  } catch (error) {
    console.error(
      'B2C error:',
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: 'Failed to initiate withdrawal'
    });
  }
};

const b2cResult = async (req, res) => {
  try {
    console.log('B2C Result:', req.body);

    return res.status(200).json({
      message: 'OK'
    });

  } catch (error) {
    return res.status(200).json({
      message: 'OK'
    });
  }
};

const b2cTimeout = async (req, res) => {
  try {
    console.log('B2C Timeout:', req.body);

    return res.status(200).json({
      message: 'OK'
    });

  } catch (error) {
    return res.status(200).json({
      message: 'OK'
    });
  }
};

export default {
  stkPush,
  mpesaCallback,
  getBalance,
  withdraw,
  b2cResult,
  b2cTimeout
};
