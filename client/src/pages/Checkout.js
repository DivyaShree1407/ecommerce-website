import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/api';
import { clearCart } from '../redux/cartSlice';

const Checkout = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { items } = useSelector(state => state.cart);
  const { user }  = useSelector(state => state.auth);

  const [address, setAddress] = useState({
    street: '', city: '', state: '', zip: ''
  });
  const [card, setCard] = useState({
    number: '', expiry: '', cvv: '', name: ''
  });
  const [step,    setStep]    = useState(1); // 1=address, 2=payment
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleAddress = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleCard = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Place order after "payment"
      const orderData = {
        items: items.map(item => ({
          productId: item._id,
          qty:       item.qty
        })),
        shippingAddress: address
      };

      await placeOrder(orderData);
      dispatch(clearCart());
      alert('🎉 Payment Successful! Order placed.');
      navigate('/orders');

    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>No items to checkout</h2>
        <button onClick={() => navigate('/products')} style={styles.btn}>
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Checkout</h2>

      {/* Progress Steps */}
      <div style={styles.steps}>
        <div style={{
          ...styles.step,
          background: step >= 1 ? '#1a1a2e' : '#e2e8f0',
          color: step >= 1 ? 'white' : '#555'
        }}>
          1 — Shipping Address
        </div>
        <div style={styles.stepLine} />
        <div style={{
          ...styles.step,
          background: step >= 2 ? '#1a1a2e' : '#e2e8f0',
          color: step >= 2 ? 'white' : '#555'
        }}>
          2 — Payment
        </div>
      </div>

      <div style={styles.layout}>
        <div style={styles.formBox}>

          {/* STEP 1 — Address */}
          {step === 1 && (
            <>
              <h3 style={styles.sectionTitle}>📦 Shipping Address</h3>
              <form onSubmit={handleAddressSubmit}>
                <div style={styles.field}>
                  <label style={styles.label}>Street Address</label>
                  <input
                    name="street"
                    placeholder="123 Main Street"
                    value={address.street}
                    onChange={handleAddress}
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>City</label>
                    <input
                      name="city"
                      placeholder="Chennai"
                      value={address.city}
                      onChange={handleAddress}
                      required
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>State</label>
                    <input
                      name="state"
                      placeholder="Tamil Nadu"
                      value={address.state}
                      onChange={handleAddress}
                      required
                      style={styles.input}
                    />
                  </div>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>ZIP Code</label>
                  <input
                    name="zip"
                    placeholder="600001"
                    value={address.zip}
                    onChange={handleAddress}
                    required
                    style={styles.input}
                  />
                </div>
                <button type="submit" style={styles.btn}>
                  Continue to Payment →
                </button>
              </form>
            </>
          )}

          {/* STEP 2 — Payment */}
          {step === 2 && (
            <>
              <h3 style={styles.sectionTitle}>💳 Payment Details</h3>
              <div style={styles.testCardInfo}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  🧪 Use Test Card Details:
                </p>
                <p>Card Number: 4111 1111 1111 1111</p>
                <p>Expiry: 12/26 &nbsp; CVV: 123</p>
                <p>Name: Any Name</p>
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <form onSubmit={handlePayment}>
                <div style={styles.field}>
                  <label style={styles.label}>Cardholder Name</label>
                  <input
                    name="name"
                    placeholder="John Doe"
                    value={card.name}
                    onChange={handleCard}
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Card Number</label>
                  <input
                    name="number"
                    placeholder="4111 1111 1111 1111"
                    value={card.number}
                    onChange={handleCard}
                    maxLength={19}
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>Expiry Date</label>
                    <input
                      name="expiry"
                      placeholder="MM/YY"
                      value={card.expiry}
                      onChange={handleCard}
                      maxLength={5}
                      required
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>CVV</label>
                    <input
                      name="cvv"
                      placeholder="123"
                      value={card.cvv}
                      onChange={handleCard}
                      maxLength={3}
                      required
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.buttons}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={styles.backBtn}>
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={styles.payBtn}>
                    {loading ? '⏳ Processing Payment...' : `💳 Pay ₹${total}`}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Order Summary */}
        <div style={styles.summary}>
          <h3 style={styles.sectionTitle}>🧾 Order Summary</h3>
          {items.map(item => (
            <div key={item._id} style={styles.summaryRow}>
              <div>
                <p style={styles.itemName}>{item.name}</p>
                <p style={styles.itemQty}>Qty: {item.qty}</p>
              </div>
              <span style={styles.itemPrice}>₹{item.price * item.qty}</span>
            </div>
          ))}
          <div style={styles.divider} />
          <div style={styles.totalRow}>
            <span style={{ fontWeight: 'bold' }}>Total</span>
            <span style={styles.total}>₹{total}</span>
          </div>
          <div style={styles.userInfo}>
            <p>👤 {user?.name}</p>
            <p>📧 {user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container:    { padding: '2rem', maxWidth: '1000px', margin: '0 auto' },
  title:        { fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e',
                  marginBottom: '1.5rem' },
  steps:        { display: 'flex', alignItems: 'center', marginBottom: '2rem' },
  step:         { padding: '0.6rem 1.5rem', borderRadius: '20px',
                  fontWeight: '600', fontSize: '0.9rem' },
  stepLine:     { flex: 1, height: '2px', background: '#e2e8f0', margin: '0 1rem' },
  layout:       { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' },
  formBox:      { background: 'white', padding: '2rem', borderRadius: '12px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  sectionTitle: { fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a2e',
                  marginBottom: '1.5rem' },
  testCardInfo: { background: '#fffbeb', padding: '1rem', borderRadius: '8px',
                  marginBottom: '1.5rem', fontSize: '0.9rem',
                  color: '#555', lineHeight: '1.8' },
  error:        { background: '#fff5f5', color: '#e53e3e', padding: '0.75rem',
                  borderRadius: '6px', marginBottom: '1rem' },
  field:        { marginBottom: '1.2rem', flex: 1 },
  row:          { display: 'flex', gap: '1rem' },
  label:        { display: 'block', marginBottom: '0.4rem',
                  fontWeight: '600', color: '#333' },
  input:        { width: '100%', padding: '0.75rem', border: '1px solid #ddd',
                  borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' },
  buttons:      { display: 'flex', gap: '1rem', marginTop: '0.5rem' },
  backBtn:      { flex: 1, padding: '1rem', background: 'white', color: '#1a1a2e',
                  border: '2px solid #1a1a2e', borderRadius: '8px',
                  fontSize: '1rem', cursor: 'pointer' },
  payBtn:       { flex: 2, padding: '1rem', background: '#1a1a2e', color: 'white',
                  border: 'none', borderRadius: '8px', fontSize: '1rem',
                  cursor: 'pointer', fontWeight: '600' },
  btn:          { width: '100%', padding: '1rem', background: '#1a1a2e',
                  color: 'white', border: 'none', borderRadius: '8px',
                  fontSize: '1.1rem', cursor: 'pointer', marginTop: '0.5rem' },
  summary:      { background: 'white', padding: '1.5rem', borderRadius: '12px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)', height: 'fit-content' },
  summaryRow:   { display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', padding: '0.75rem 0',
                  borderBottom: '1px solid #f0f0f0' },
  itemName:     { fontWeight: '600', color: '#1a1a2e', margin: 0 },
  itemQty:      { color: '#718096', fontSize: '0.85rem', margin: '0.2rem 0 0' },
  itemPrice:    { fontWeight: 'bold' },
  divider:      { borderTop: '2px solid #f0f0f0', margin: '1rem 0' },
  totalRow:     { display: 'flex', justifyContent: 'space-between',
                  marginBottom: '1rem' },
  total:        { fontSize: '1.3rem', fontWeight: 'bold', color: '#1a1a2e' },
  userInfo:     { background: '#f7f8fc', padding: '1rem', borderRadius: '8px',
                  color: '#555', lineHeight: '1.8' }
};

export default Checkout;