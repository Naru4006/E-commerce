import React from 'react';

const CreditCard = ({ cardNumber, cardholderName, expiry, cvv, focusedField }) => {
  // Simple card type detection
  const getCardType = (number) => {
    const cleanNum = number.replace(/\D/g, '');
    if (cleanNum.startsWith('4')) return 'VISA';
    if (/^5[1-5]/.test(cleanNum)) return 'MASTERCARD';
    if (/^3[47]/.test(cleanNum)) return 'AMEX';
    return 'CREDIT CARD';
  };

  // Helper to format card number with spaces for mockup
  const formatCardDisplay = (number) => {
    let raw = number.replace(/\D/g, '').substring(0, 16);
    // Pad with dots if incomplete
    let padded = raw.padEnd(16, '•');
    let parts = [];
    for (let i = 0; i < 16; i += 4) {
      parts.push(padded.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  // Format expiry display
  const formatExpiryDisplay = (exp) => {
    if (!exp) return 'MM/YY';
    let clean = exp.replace(/\D/g, '').substring(0, 4);
    if (clean.length > 2) {
      return `${clean.substring(0, 2)}/${clean.substring(2, 4)}`;
    }
    return clean;
  };

  const isFlipped = focusedField === 'cvv';
  const cardType = getCardType(cardNumber);

  return (
    <div className="card-preview-container">
      <div className={`credit-card ${isFlipped ? 'flipped' : ''}`}>
        
        {/* Front Face */}
        <div className="card-face card-front">
          <div className="card-top">
            <div className="card-chip"></div>
            <div className="card-type">{cardType}</div>
          </div>
          
          <div className="card-number">
            {formatCardDisplay(cardNumber)}
          </div>
          
          <div className="card-info">
            <div>
              <div className="card-label">Card Holder</div>
              <div className="card-holder-name">
                {cardholderName.toUpperCase() || 'NAME SURNAME'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="card-label">Expires</div>
              <div className="card-expiry-val">
                {formatExpiryDisplay(expiry)}
              </div>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div className="card-face card-back">
          <div className="card-magnetic-strip"></div>
          
          <div>
            <div className="card-label" style={{ paddingLeft: '1.5rem', marginBottom: '4px' }}>CVV</div>
            <div className="card-signature-area">
              <span>Authorized Signature</span>
              {cvv || '•••'}
            </div>
          </div>
          
          <div className="card-back-text">
            This card is simulated for checkout demonstration purposes. Do not submit active credit details. Processed via local Node.js proxy environment.
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreditCard;
