import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getMyOrders } from '../services/api';

const statusColors = {
  pending:    { bg: '#fffbeb', color: '#d97706' },
  processing: { bg: '#eff6ff', color: '#2563eb' },
  shipped:    { bg: '#f0fdf4', color: '#16a34a' },
  delivered:  { bg: '#f0fdf4', color: '#15803d' },
  cancelled:  { bg: '#fff1f2', color: '#e11d48' }
};

const Orders = () => {
  const navigate    = useNavigate();
  const { user }    = useSelector(state => state.auth);
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const fetchOrders = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data.orders);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  if (loading) return <div style={styles.center}>Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={{ fontSize: '4rem' }}>📦</div>
        <h2>No orders yet</h2>
        <p style={{ color: '#666' }}>Your orders will appear here</p>
        <button
          onClick={() => navigate('/products')}
          style={styles.shopBtn}>
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Orders</h2>
      <p style={styles.subtitle}>{orders.length} order(s) found</p>

      <div style={styles.list}>
        {orders.map(order => (
          <div key={order._id} style={styles.card}>

            {/* Order Header */}
            <div style={styles.header}>
              <div>
                <p style={styles.orderId}>
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p style={styles.date}>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
              <span style={{
                ...styles.status,
                background: statusColors[order.status]?.bg,
                color: statusColors[order.status]?.color
              }}>
                {order.status.toUpperCase()}
              </span>
            </div>

            {/* Order Items */}
            <div style={styles.items}>
              {order.items.map(item => (
                <div key={item._id} style={styles.item}>
                  <span style={styles.itemIcon}>📦</span>
                  <div style={styles.itemInfo}>
                    <p style={styles.itemName}>{item.name}</p>
                    <p style={styles.itemQty}>Qty: {item.qty}</p>
                  </div>
                  <span style={styles.itemPrice}>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div style={styles.footer}>
              <div style={styles.address}>
                📍 {order.shippingAddress.street},{' '}
                {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} -{' '}
                {order.shippingAddress.zip}
              </div>
              <div style={styles.total}>
                Total: <strong>₹{order.total}</strong>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  title:     { fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e' },
  subtitle:  { color: '#718096', marginBottom: '2rem' },
  list:      { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  card:      { background: 'white', borderRadius: '12px',
               boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  header:    { display: 'flex', justifyContent: 'space-between',
               alignItems: 'flex-start', padding: '1.5rem',
               borderBottom: '1px solid #f0f0f0' },
  orderId:   { fontWeight: 'bold', color: '#1a1a2e', margin: 0 },
  date:      { color: '#718096', fontSize: '0.85rem', margin: '0.3rem 0 0' },
  status:    { padding: '0.4rem 1rem', borderRadius: '20px',
               fontSize: '0.8rem', fontWeight: 'bold' },
  items:     { padding: '1rem 1.5rem', borderBottom: '1px solid #f0f0f0' },
  item:      { display: 'flex', alignItems: 'center', gap: '1rem',
               padding: '0.5rem 0' },
  itemIcon:  { fontSize: '1.5rem' },
  itemInfo:  { flex: 1 },
  itemName:  { fontWeight: '600', color: '#1a1a2e', margin: 0 },
  itemQty:   { color: '#718096', fontSize: '0.85rem', margin: 0 },
  itemPrice: { fontWeight: 'bold', color: '#1a1a2e' },
  footer:    { padding: '1rem 1.5rem', display: 'flex',
               justifyContent: 'space-between', alignItems: 'center',
               background: '#f7f8fc' },
  address:   { color: '#555', fontSize: '0.85rem' },
  total:     { fontSize: '1.1rem', color: '#1a1a2e' },
  center:    { textAlign: 'center', padding: '4rem', fontSize: '1.2rem' },
  empty:     { textAlign: 'center', padding: '5rem 2rem' },
  shopBtn:   { marginTop: '1rem', padding: '0.85rem 2rem', background: '#1a1a2e',
               color: 'white', border: 'none', borderRadius: '8px',
               fontSize: '1rem', cursor: 'pointer' }
};

export default Orders;