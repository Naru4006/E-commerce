import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes (to allow React frontend on port 5173)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// In-memory transaction database for lightweight demonstration
const transactions = {};

// Helper to generate custom transaction ID
const generateTxnId = () => {
  return 'txn_' + Math.random().toString(36).substring(2, 11).toUpperCase();
};

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root status endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

/**
 * Endpoint: Create Payment Intent
 * Registers a pending order and returns a transaction ID
 */
app.post('/api/payments/create-intent', (req, res) => {
  const { amount, currency, items } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid or missing amount' });
  }

  const txnId = generateTxnId();
  transactions[txnId] = {
    id: txnId,
    amount: parseFloat(amount),
    currency: currency || 'USD',
    items: items || [],
    status: 'PENDING',
    paymentMethod: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  console.log(`Payment Intent Created: ${txnId} for ${currency || 'USD'} ${amount}`);

  res.status(201).json({
    transactionId: txnId,
    amount: transactions[txnId].amount,
    currency: transactions[txnId].currency,
    status: transactions[txnId].status
  });
});

/**
 * Endpoint: Confirm Payment
 * Updates transaction status to SUCCESS or FAILED based on credentials provided
 */
app.post('/api/payments/confirm', (req, res) => {
  const { transactionId, paymentMethod, paymentDetails } = req.body;

  if (!transactionId || !transactions[transactionId]) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  const transaction = transactions[transactionId];
  if (transaction.status !== 'PENDING') {
    return res.status(400).json({ error: `Transaction is already in status: ${transaction.status}` });
  }

  transaction.paymentMethod = paymentMethod;
  transaction.updatedAt = new Date();

  // Process based on payment method
  if (paymentMethod === 'card') {
    const { cardNumber, cardholderName, expiry, cvv } = paymentDetails || {};

    if (!cardNumber || !cardholderName || !expiry || !cvv) {
      return res.status(400).json({ error: 'Missing card payment details' });
    }

    // Clean card number for check
    const cleanCard = cardNumber.replace(/\s+/g, '');
    
    // Simulate Decline: If card number ends with '4444', simulate declining the card
    if (cleanCard.endsWith('4444')) {
      transaction.status = 'FAILED';
      transaction.errorMessage = 'Card declined: Insufficient funds in the account.';
      return res.json({
        success: false,
        status: transaction.status,
        message: transaction.errorMessage,
        transactionId
      });
    }

    // Simulate Error: If card number ends with '0000', simulate card fraud block
    if (cleanCard.endsWith('0000')) {
      transaction.status = 'FAILED';
      transaction.errorMessage = 'Card declined: Flagged as suspicious activity by issuing bank.';
      return res.json({
        success: false,
        status: transaction.status,
        message: transaction.errorMessage,
        transactionId
      });
    }

    // Default successful transaction
    transaction.status = 'SUCCESS';
    transaction.maskedCardNumber = `•••• •••• •••• ${cleanCard.slice(-4)}`;
    return res.json({
      success: true,
      status: transaction.status,
      message: 'Card payment processed successfully.',
      transactionId,
      maskedCardNumber: transaction.maskedCardNumber
    });
  } 
  
  else if (paymentMethod === 'upi') {
    const { upiId, simulatedApproval } = paymentDetails || {};

    if (!upiId) {
      return res.status(400).json({ error: 'Missing UPI ID' });
    }

    if (simulatedApproval === false) {
      transaction.status = 'FAILED';
      transaction.errorMessage = 'UPI Payment request expired or declined by user.';
      return res.json({
        success: false,
        status: transaction.status,
        message: transaction.errorMessage,
        transactionId
      });
    }

    transaction.status = 'SUCCESS';
    transaction.upiId = upiId;
    return res.json({
      success: true,
      status: transaction.status,
      message: 'UPI payment received successfully.',
      transactionId,
      upiId
    });
  } 
  
  else if (paymentMethod === 'paypal') {
    const { email, simulatedApproval } = paymentDetails || {};

    if (!email) {
      return res.status(400).json({ error: 'Missing PayPal account email' });
    }

    if (simulatedApproval === false) {
      transaction.status = 'FAILED';
      transaction.errorMessage = 'PayPal checkout cancelled by user.';
      return res.json({
        success: false,
        status: transaction.status,
        message: transaction.errorMessage,
        transactionId
      });
    }

    transaction.status = 'SUCCESS';
    transaction.paypalEmail = email;
    return res.json({
      success: true,
      status: transaction.status,
      message: 'PayPal payment authorized successfully.',
      transactionId,
      paypalEmail: email
    });
  } 
  
  else if (paymentMethod === 'cod') {
    // Cash on Delivery is always successful initially
    transaction.status = 'SUCCESS';
    return res.json({
      success: true,
      status: transaction.status,
      message: 'Order placed successfully with Cash on Delivery.',
      transactionId
    });
  } 
  
  else {
    return res.status(400).json({ error: 'Unsupported payment method' });
  }
});

/**
 * Endpoint: Get Transaction Status
 */
app.get('/api/payments/status/:id', (req, res) => {
  const transaction = transactions[req.params.id];
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  res.json(transaction);
});

// Start server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 Payment Simulator Server is running on port ${PORT}`);
  console.log(`📂 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`===================================================`);
});
