import React from 'react';
import { ShoppingBag, Tag, Truck, ShieldCheck } from 'lucide-react';

const CartSummary = ({ items, subtotal, shipping, tax, total }) => {
  return (
    <aside className="checkout-sidebar">
      <h3 className="sidebar-title">Order Summary</h3>
      
      <div className="cart-items-list">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-img-placeholder">
              <ShoppingBag size={20} />
            </div>
            <div className="item-details">
              <h4 className="item-name">{item.name}</h4>
              <p className="item-qty">Qty: {item.qty} • Size: {item.size || 'M'}</p>
            </div>
            <span className="item-price">${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="pricing-breakdown">
        <div className="price-row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="price-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Truck size={14} /> Shipping
          </span>
          <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="price-row">
          <span>Estimated Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <div className="price-row total">
          <span>Total Due</span>
          <span className="price-val">${total.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        fontSize: '0.75rem', 
        color: 'var(--color-accent)', 
        background: 'rgba(6, 182, 212, 0.05)',
        border: '1px solid rgba(6, 182, 212, 0.15)',
        padding: '0.65rem',
        borderRadius: '8px',
        marginTop: '0.5rem'
      }}>
        <ShieldCheck size={18} style={{ flexShrink: 0 }} />
        <span>Fully encrypted. Secure servers protect transaction data with standard SSL connection protocols.</span>
      </div>
    </aside>
  );
};

export default CartSummary;
