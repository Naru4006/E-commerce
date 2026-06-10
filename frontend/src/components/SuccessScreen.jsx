import React from 'react';
import { Check, X, ArrowLeft, Receipt, Calendar, CreditCard as CardIcon } from 'lucide-react';

const SuccessScreen = ({ status, errorMessage, transactionId, paymentMethod, orderTotal, onReset }) => {
  const isSuccess = status === 'SUCCESS';

  return (
    <div className="status-overlay">
      {isSuccess ? (
        <>
          <div className="success-icon-wrap">
            <Check size={40} strokeWidth={3} />
          </div>
          <h2>Payment Successful!</h2>
          <p>Thank you for your order. Your transaction has been completed successfully.</p>
        </>
      ) : (
        <>
          <div className="error-icon-wrap">
            <X size={40} strokeWidth={3} />
          </div>
          <h2>Payment Failed</h2>
          <p>{errorMessage || 'The transaction was declined by the bank or gateway.'}</p>
        </>
      )}

      {transactionId && (
        <div className="txn-id-badge">
          Transaction ID: {transactionId}
        </div>
      )}

      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-glass)',
        borderRadius: '8px',
        padding: '1rem',
        width: '100%',
        maxWidth: '320px',
        fontSize: '0.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '1.5rem',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Status</span>
          <span style={{ 
            fontWeight: 700, 
            color: isSuccess ? 'var(--color-success)' : 'var(--color-error)' 
          }}>
            {status}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Method</span>
          <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>
            {paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'paypal' ? 'PayPal' : 'COD'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Amount</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            ${orderTotal.toFixed(2)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Date</span>
          <span>
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      <button className="btn-dismiss" onClick={onReset}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Return to Checkout
        </div>
      </button>
    </div>
  );
};

export default SuccessScreen;
