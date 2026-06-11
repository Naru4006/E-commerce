import React, { useState } from 'react';
import { CreditCard as CardIcon, Send, Sparkles, DollarSign, Lock, AlertCircle } from 'lucide-react';
import CreditCard from './CreditCard';
import UPIMethod from './UPIMethod';
import PayPalMethod from './PayPalMethod';
import SuccessScreen from './SuccessScreen';

const CheckoutForm = ({ orderTotal, orderItems }) => {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('card'); // 'card', 'upi', 'paypal', 'cod'
  const [focusedField, setFocusedField] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'SUCCESS', 'FAILED', null
  const [errorMsg, setErrorMsg] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Card payment inputs
  const [cardNo, setCardNo] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // UPI payment inputs
  const [upiId, setUpiId] = useState('');
  const [simulatedUpiApproval, setSimulatedUpiApproval] = useState(null);

  // PayPal payment inputs
  const [paypalEmail, setPaypalEmail] = useState('');
  const [simulatedPaypalApproval, setSimulatedPaypalApproval] = useState(null);

  // Form input mask handlers
  const handleCardNoChange = (e) => {
    // Format card number with spaces
    let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = val.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || '';
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNo(parts.join(' '));
    } else {
      setCardNo(val);
    }
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) {
      setCardExpiry(`${val.substring(0, 2)}/${val.substring(2, 4)}`);
    } else {
      setCardExpiry(val);
    }
  };

  const handleCvvChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCardCvv(val);
  };

  // Reset form status to run checkout again
  const handleResetCheckout = () => {
    setPaymentStatus(null);
    setTransactionId('');
    setErrorMsg('');
    setIsProcessing(false);
    setCardNo('');
    setCardHolder('');
    setCardExpiry('');
    setCardCvv('');
    setUpiId('');
    setSimulatedUpiApproval(null);
    setPaypalEmail('');
    setSimulatedPaypalApproval(null);
  };

  // Main Submit handler (Communicates with local Node.js server)
  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg('');

    // Pre-validations
    if (activeTab === 'upi' && !upiId) {
      setErrorMsg('Please enter a valid UPI ID');
      setIsProcessing(false);
      return;
    }
    if (activeTab === 'paypal' && !paypalEmail) {
      setErrorMsg('Please log in and authorize payment via PayPal first');
      setIsProcessing(false);
      return;
    }

    try {
      // Step 1: Create checkout session (Payment Intent) via Backend API
      const intentResponse = await fetch(
        'https://e-commerce-production-3156.up.railway.app/api/payments/create-intent',
        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: orderTotal,
          currency: 'USD',
          items: orderItems
        })
      });

      if (!intentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }

      const intentData = await intentResponse.json();
      const currentTxnId = intentData.transactionId;
      setTransactionId(currentTxnId);

      // Artifically delay slightly (1.5 seconds) to simulate transaction networking
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 2: Prepare confirmation details based on active tab
      let paymentDetails = {};
      if (activeTab === 'card') {
        paymentDetails = {
          cardNumber: cardNo,
          cardholderName: cardHolder,
          expiry: cardExpiry,
          cvv: cardCvv
        };
      } else if (activeTab === 'upi') {
        paymentDetails = {
          upiId,
          simulatedApproval: simulatedUpiApproval !== false // default true
        };
      } else if (activeTab === 'paypal') {
        paymentDetails = {
          email: paypalEmail,
          simulatedApproval: simulatedPaypalApproval !== false // default true
        };
      }

      // Step 3: Confirm payment with Backend API
      const confirmResponse = await fetch(
        'https://e-commerce-production-3156.up.railway.app/api/payments/confirm',
        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: currentTxnId,
          paymentMethod: activeTab,
          paymentDetails
        })
      });

      if (!confirmResponse.ok) {
        throw new Error('Error processing payment response');
      }

      const confirmData = await confirmResponse.json();

      if (confirmData.success) {
        setPaymentStatus('SUCCESS');
      } else {
        setPaymentStatus('FAILED');
        setErrorMsg(confirmData.message || 'Payment was declined.');
      }

    } catch (err) {
      console.error(err);
      setPaymentStatus('FAILED');
      setErrorMsg(err.message || 'Server error connection timed out.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-main">
      <h2>Payment Method</h2>

      {/* Tab Navigation */}
      <div className="payment-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'card' ? 'active' : ''}`}
          onClick={() => setActiveTab('card')}
        >
          <CardIcon />
          <span>Card</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'upi' ? 'active' : ''}`}
          onClick={() => setActiveTab('upi')}
        >
          <Send />
          <span>UPI</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'paypal' ? 'active' : ''}`}
          onClick={() => setActiveTab('paypal')}
        >
          <span style={{ fontWeight: 800 }}>PP</span>
          <span>PayPal</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'cod' ? 'active' : ''}`}
          onClick={() => setActiveTab('cod')}
        >
          <DollarSign />
          <span>COD</span>
        </button>
      </div>

      <form onSubmit={handleSubmitPayment} className="payment-form-wrapper">
        
        {/* Active Payment status screen */}
        {paymentStatus && (
          <SuccessScreen
            status={paymentStatus}
            errorMessage={errorMsg}
            transactionId={transactionId}
            paymentMethod={activeTab}
            orderTotal={orderTotal}
            onReset={handleResetCheckout}
          />
        )}

        {/* Tab 1: Credit Card */}
        {activeTab === 'card' && (
          <>
            <CreditCard
              cardNumber={cardNo}
              cardholderName={cardHolder}
              expiry={cardExpiry}
              cvv={cardCvv}
              focusedField={focusedField}
            />

            <div className="form-group">
              <label htmlFor="cardHolderName">Cardholder Name</label>
              <input
                type="text"
                id="cardHolderName"
                placeholder="John Doe"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                onFocus={() => setFocusedField('cardholderName')}
                onBlur={() => setFocusedField('')}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                placeholder="0000 0000 0000 0000"
                value={cardNo}
                onChange={handleCardNoChange}
                onFocus={() => setFocusedField('cardNumber')}
                onBlur={() => setFocusedField('')}
                required
              />
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', gap: '8px' }}>
                <span>* Ends with 4444 to simulate Decline</span>
                <span>* Ends with 0000 to simulate Block</span>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="cardExpiry">Expiration Date</label>
                <input
                  type="text"
                  id="cardExpiry"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  onFocus={() => setFocusedField('expiry')}
                  onBlur={() => setFocusedField('')}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cardCvv">CVV Code</label>
                <input
                  type="password"
                  id="cardCvv"
                  placeholder="123"
                  value={cardCvv}
                  onChange={handleCvvChange}
                  onFocus={() => setFocusedField('cvv')}
                  onBlur={() => setFocusedField('')}
                  required
                />
              </div>
            </div>
          </>
        )}

        {/* Tab 2: UPI */}
        {activeTab === 'upi' && (
          <UPIMethod
            upiId={upiId}
            onChangeUpiId={setUpiId}
            onSetSimulatedUpiApproval={setSimulatedUpiApproval}
          />
        )}

        {/* Tab 3: PayPal */}
        {activeTab === 'paypal' && (
          <PayPalMethod
            paypalEmail={paypalEmail}
            onChangePaypalEmail={setPaypalEmail}
            onSetSimulatedPaypalApproval={setSimulatedPaypalApproval}
          />
        )}

        {/* Tab 4: Cash on Delivery */}
        {activeTab === 'cod' && (
          <div className="cod-confirm">
            <DollarSign size={48} className="brand-icon" style={{ color: 'var(--color-accent)' }} />
            <h3>Cash on Delivery</h3>
            <p>
              Confirm your order now. You will pay in cash or via mobile scanner when our delivery agent delivers items to your shipping address.
            </p>
          </div>
        )}

        {/* Error message displays */}
        {errorMsg && !paymentStatus && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-error-glow)',
            border: '1px solid var(--color-error)',
            color: 'var(--color-error)',
            padding: '0.65rem 0.85rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            marginBottom: '1rem'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Checkout Execution Button */}
        <button
          type="submit"
          className="checkout-btn"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="spinner"></div>
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <Lock size={16} />
              <span>Confirm & Pay ${(orderTotal).toFixed(2)}</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default CheckoutForm;
