import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, clearCart } from '../redux/cartSlice';

const Cart = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items } = useSelector(state => state.cart);
  const { user }  = useSelector(state => state.auth);

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>🛒</div>
        <h2>Your cart is empty</h2>
        <p style={{ color: '#666' }}>Add some products to get started</p>
        <button
          onClick={() => navigate('/products')}
          style={styles.shopBtn}>
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Cart</h2>

      <div style={styles.layout}>
        {/* Cart Items */}
        <div style={styles.items}>
          {items.map(item => (
            <div key={item._id} style={styles.card}>
              <div style={styles.icon}>📦</div>
              <div style={styles.info}>
                <h3 style={styles.name}>{item.name}</h3>
                <p style={styles.category}>{item.category}</p>
                <p style={styles.price}>₹{item.price} x {item.qty}</p>
                <p style={styles.subtotal}>
                  Subtotal: ₹{item.price * item.qty}
                </p>
              </div>
              <button
                onClick={() => dispatch(removeFromCart(item._id))}
                style={styles.removeBtn}>
                ✕ Remove
              </button>
            </div>
          ))}

          <button
            onClick={() => dispatch(clearCart())}
            style={styles.clearBtn}>
            🗑 Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>

          {items.map(item => (
            <div key={item._id} style={styles.summaryRow}>
              <span>{item.name} x{item.qty}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}

          <div style={styles.divider} />

          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalAmount}>₹{total}</span>
          </div>

          <button
            onClick={handleCheckout}
            style={styles.checkoutBtn}>
            Proceed to Checkout →
          </button>

          <button
            onClick={() => navigate('/products')}
            style={styles.continueBtn}>
            ← Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container:    { padding: '2rem', maxWidth: '1100px', margin: '0 auto' },
  title:        { fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e',
                  marginBottom: '2rem' },
  layout:       { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' },
  items:        { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card:         { background: 'white', borderRadius: '12px', padding: '1.5rem',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  display: 'flex', alignItems: 'center', gap: '1rem' },
  icon:         { fontSize: '3rem' },
  info:         { flex: 1 },
  name:         { fontWeight: 'bold', fontSize: '1.1rem', color: '#1a1a2e' },
  category:     { color: '#718096', fontSize: '0.85rem', margin: '0.2rem 0' },
  price:        { color: '#555', margin: '0.3rem 0' },
  subtotal:     { fontWeight: 'bold', color: '#1a1a2e' },
  removeBtn:    { background: '#fff5f5', color: '#e53e3e', border: '1px solid #e53e3e',
                  padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' },
  clearBtn:     { background: 'none', color: '#e53e3e', border: '1px solid #e53e3e',
                  padding: '0.75rem', borderRadius: '8px', cursor: 'pointer',
                  alignSelf: 'flex-start' },
  summary:      { background: 'white', borderRadius: '12px', padding: '1.5rem',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)', height: 'fit-content' },
  summaryTitle: { fontSize: '1.3rem', fontWeight: 'bold', color: '#1a1a2e',
                  marginBottom: '1rem' },
  summaryRow:   { display: 'flex', justifyContent: 'space-between',
                  padding: '0.5rem 0', color: '#555', fontSize: '0.9rem' },
  divider:      { borderTop: '2px solid #f0f0f0', margin: '1rem 0' },
  totalRow:     { display: 'flex', justifyContent: 'space-between',
                  marginBottom: '1.5rem' },
  totalLabel:   { fontSize: '1.1rem', fontWeight: 'bold' },
  totalAmount:  { fontSize: '1.3rem', fontWeight: 'bold', color: '#1a1a2e' },
  checkoutBtn:  { width: '100%', padding: '1rem', background: '#1a1a2e',
                  color: 'white', border: 'none', borderRadius: '8px',
                  fontSize: '1rem', cursor: 'pointer', marginBottom: '0.75rem' },
  continueBtn:  { width: '100%', padding: '0.85rem', background: 'white',
                  color: '#1a1a2e', border: '2px solid #1a1a2e', borderRadius: '8px',
                  fontSize: '1rem', cursor: 'pointer' },
  empty:        { textAlign: 'center', padding: '5rem 2rem' },
  emptyIcon:    { fontSize: '5rem', marginBottom: '1rem' },
  shopBtn:      { marginTop: '1rem', padding: '0.85rem 2rem', background: '#1a1a2e',
                  color: 'white', border: 'none', borderRadius: '8px',
                  fontSize: '1rem', cursor: 'pointer' }
};

export default Cart;