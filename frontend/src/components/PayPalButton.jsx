import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { API } from '../store/authStore';
import toast from 'react-hot-toast';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'your_client_id';

export default function PayPalButton({ onSuccess }) {
  const [amount, setAmount] = useState('10');

  const createOrder = async () => {
    try {
      const { data } = await API.post('/paypal/create-order', { amount, currency: 'USD' });
      return data.id;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start PayPal payment');
      throw err;
    }
  };

  const onApprove = async (data) => {
    try {
      const res = await API.post(`/paypal/capture-order/${data.orderID}`);
      toast.success(res.data.message || 'Thank you for your contribution!');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment capture failed');
    }
  };

  return (
    <PayPalScriptProvider options={{ 'client-id': PAYPAL_CLIENT_ID, currency: 'USD' }}>
      <div style={{ width: '100%' }}>
        {/* Amount selector */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
            Amount (USD) <span style={{ color: 'var(--gold)' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            {['5','10','25','50'].map(a => (
              <button
                key={a}
                type="button"
                onClick={() => setAmount(a)}
                style={{
                  padding: '6px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: 600,
                  border: amount === a ? '2px solid #003087' : '2px solid var(--border)',
                  background: amount === a ? '#e8eeff' : 'white',
                  color: amount === a ? '#003087' : 'var(--text-mid)',
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
                }}
              >
                ${a}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', fontWeight: 600, color: 'var(--text-mid)' }}>$</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="1"
              placeholder="Custom amount"
              className="input-field"
              style={{ paddingLeft: '28px' }}
            />
          </div>
        </div>

        <PayPalButtons
          style={{ layout: 'vertical', shape: 'pill', label: 'donate', height: 44 }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(err) => toast.error('PayPal error. Please try again.')}
        />
      </div>
    </PayPalScriptProvider>
  );
}
