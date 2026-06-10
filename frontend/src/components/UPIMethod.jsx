import React, { useState, useEffect } from 'react';
import { QrCode, AlertCircle, Sparkles } from 'lucide-react';

const UPIMethod = ({ upiId, onChangeUpiId, onSetSimulatedUpiApproval }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="upi-container">
      <div className="form-group" style={{ width: '100%' }}>
        <label htmlFor="upiId">Enter UPI ID</label>
        <input
          type="text"
          id="upiId"
          placeholder="yourname@okbank"
          value={upiId}
          onChange={(e) => onChangeUpiId(e.target.value)}
          required
        />
      </div>

      <div style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        — OR Scan QR Code —
      </div>

      <div className="upi-qr-wrapper">
        {/* SVG QR Code Simulation */}
        <svg className="upi-qr-code" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Border markers */}
          <rect x="5" y="5" width="20" height="20" fill="none" stroke="#111" strokeWidth="4" />
          <rect x="10" y="10" width="10" height="10" fill="#111" />
          
          <rect x="75" y="5" width="20" height="20" fill="none" stroke="#111" strokeWidth="4" />
          <rect x="80" y="10" width="10" height="10" fill="#111" />
          
          <rect x="5" y="75" width="20" height="20" fill="none" stroke="#111" strokeWidth="4" />
          <rect x="10" y="80" width="10" height="10" fill="#111" />

          {/* Random mock QR pixels */}
          <rect x="35" y="10" width="10" height="5" fill="#111" />
          <rect x="55" y="5" width="5" height="15" fill="#111" />
          <rect x="30" y="30" width="15" height="10" fill="#111" />
          <rect x="60" y="35" width="10" height="15" fill="#111" />
          <rect x="10" y="35" width="15" height="5" fill="#111" />
          <rect x="10" y="50" width="5" height="15" fill="#111" />
          
          <rect x="35" y="50" width="20" height="20" fill="#111" />
          <rect x="65" y="60" width="15" height="15" fill="#111" />
          <rect x="35" y="80" width="15" height="10" fill="#111" />
          <rect x="80" y="35" width="10" height="10" fill="#111" />
          <rect x="85" y="80" width="10" height="15" fill="#111" />
          <rect x="10" y="60" width="15" height="5" fill="#111" />
          <rect x="55" y="75" width="15" height="5" fill="#111" />
        </svg>
        <div className="upi-qr-scanner"></div>
      </div>

      <div className="timer-box">
        <Sparkles size={14} />
        QR Code expires in: {formatTime(timeLeft)}
      </div>

      {/* UPI Simulation controls */}
      <div className="simulation-controller" style={{ width: '100%' }}>
        <span>UPI Sandbox Simulator</span>
        <div className="sim-btn-row">
          <button 
            type="button" 
            className="sim-btn success-btn"
            onClick={() => onSetSimulatedUpiApproval(true)}
          >
            Simulate App Approval
          </button>
          <button 
            type="button" 
            className="sim-btn error-btn"
            onClick={() => onSetSimulatedUpiApproval(false)}
          >
            Simulate Decline/Expiry
          </button>
        </div>
      </div>
    </div>
  );
};

export default UPIMethod;
