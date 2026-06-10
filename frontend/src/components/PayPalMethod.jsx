import React, { useState } from 'react';
import { ShieldCheck, Info } from 'lucide-react';

const PayPalMethod = ({ paypalEmail, onChangePaypalEmail, onSetSimulatedPaypalApproval }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalEmail, setModalEmail] = useState(paypalEmail || '');
  const [modalPassword, setModalPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(!!paypalEmail);

  const handleOpenPopup = () => {
    setIsOpen(true);
  };

  const handleClosePopup = () => {
    setIsOpen(false);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!modalEmail) return;
    
    onChangePaypalEmail(modalEmail);
    onSetSimulatedPaypalApproval(true);
    setIsAuthorized(true);
    setIsOpen(false);
  };

  const handleSimulateDecline = () => {
    onChangePaypalEmail('');
    onSetSimulatedPaypalApproval(false);
    setIsAuthorized(false);
    setIsOpen(false);
  };

  return (
    <div className="paypal-container">
      <div className="paypal-logo">
        paypal<span>sandbox</span>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', maxWidth: '300px' }}>
        Log in to your PayPal account to complete the purchase securely without exposing credit details.
      </p>

      {isAuthorized ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '0.75rem',
          borderRadius: '8px',
          width: '100%'
        }}>
          <div style={{ color: 'var(--color-success)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={16} /> Authorized: {paypalEmail}
          </div>
          <button 
            type="button" 
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
            onClick={() => setIsAuthorized(false)}
          >
            Change Account
          </button>
        </div>
      ) : (
        <button 
          type="button" 
          className="paypal-btn-mock"
          onClick={handleOpenPopup}
        >
          Pay with <span>PayPal</span>
        </button>
      )}

      {/* Mock Sandbox Modal */}
      {isOpen && (
        <div className="simulator-modal-overlay">
          <div className="paypal-modal">
            <div className="paypal-modal-header">
              <span style={{ fontWeight: 800, color: '#003087', fontSize: '1.1rem', fontStyle: 'italic' }}>
                paypal<span style={{ color: '#0079c1' }}>sandbox</span>
              </span>
              <span style={{ fontSize: '0.75rem', background: '#e0e0e0', padding: '2px 6px', borderRadius: '4px' }}>
                Test Mode
              </span>
            </div>
            
            <form onSubmit={handleAuthSubmit} className="paypal-modal-body">
              <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Log in to your test account</h4>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                  Simulate authorization for the payment intent
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="email"
                  className="paypal-input"
                  placeholder="Email Address (e.g. buyer@example.com)"
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  className="paypal-input"
                  placeholder="Password"
                  value={modalPassword}
                  onChange={(e) => setModalPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#666', background: '#f5f6f8', padding: '8px', borderRadius: '6px' }}>
                <Info size={14} style={{ flexShrink: 0, color: '#0070ba' }} />
                <span>Any test credentials will be accepted. Enter a mock email to continue.</span>
              </div>

              <div className="paypal-modal-actions">
                <button 
                  type="button" 
                  className="paypal-modal-btn secondary"
                  onClick={handleClosePopup}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="paypal-modal-btn secondary"
                  style={{ background: '#f43f5e', color: '#fff' }}
                  onClick={handleSimulateDecline}
                >
                  Simulate Error
                </button>
                <button 
                  type="submit" 
                  className="paypal-modal-btn primary"
                >
                  Log In & Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayPalMethod;
