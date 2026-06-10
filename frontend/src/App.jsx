import React from 'react';
import { ShieldAlert, ShieldCheck, CreditCard } from 'lucide-react';
import CartSummary from './components/CartSummary';
import CheckoutForm from './components/CheckoutForm';

const App = () => {
  // Mock shopping cart products
  const cartItems = [
    {
      id: 'prod_1',
      name: 'Aether Chronograph 42mm',
      qty: 1,
      price: 129.99,
      size: 'Graphite Black'
    },
    {
      id: 'prod_2',
      name: 'Zenith ANC Earbuds',
      qty: 1,
      price: 89.00,
      size: 'Liquid Silver'
    }
  ];

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = subtotal > 150 ? 0.00 : 15.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="app-container">
      {/* Header Row */}
      <header className="checkout-header">
        <div className="brand">
          <CreditCard className="brand-icon" size={26} />
          <span>QuantumPay</span>
        </div>
        <div className="secure-badge">
          <ShieldCheck size={14} />
          <span>Secure Checkout</span>
        </div>
      </header>

      {/* Column 1: Payment Method Form */}
      <CheckoutForm 
        orderTotal={total} 
        orderItems={cartItems} 
      />

      {/* Column 2: Order Review Sidebar */}
      <CartSummary 
        items={cartItems}
        subtotal={subtotal}
        shipping={shipping}
        tax={tax}
        total={total}
      />
    </div>
  );
};

export default App;
