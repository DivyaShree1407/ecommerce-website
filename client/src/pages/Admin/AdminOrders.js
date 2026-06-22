import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAllOrders, updateStatus } from '../../services/api';

const statusColors = {
  pending:    { bg: '#fffbeb', color: '#d97706' },
  processing: { bg: '#eff6ff', color: '#2563eb' },
  shipped:    { bg: '#f0fdf4', color: '#16a34a' },
  delivered:  { bg: '#f0fdf4', color: '#15803d' },
  cancelled:  { bg: '#fff1f2', color: '#e11d48' }
};

const AdminOrders = () => {
  const navigate     = useNavigate();
  const { user }     = useSelector(state => state.auth);
  const [orders,    setOrders]   = useState([]);
  const [loading,   setLoading]  = useState(true);
  const [success,   setSuccess]  = useState('');
  const [filter,    setFilter]   = useState('all');

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const { data } = await getAllOrders();
      setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateStatus(orderId, newStatus);
      setSuccess(`Order status updated to ${newStatus}`);
      fetchOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  if (loading) return <div style={styles.center}>Loading orders...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Admin — Orders</h2>
          <p style={styles.subtitle}>{orders.length} total orders</p>
        </div>
      </div>

      {success && <div style={styles.success}>{success}</div>}

      {/* Stats Row */}
      <div style={styles.stats}>
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              ...styles.statBtn,
              background: filter === s ? '#1a1a2e' : 'white',
              color: filter === s ? 'white' : '#1a1a2e'
            }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
            {' '}({s === 'all'
              ? orders.length
              : orders.filter(o => o.status === s).length})
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div style={styles.center}>No orders found</div>
      ) : (
        <div style={styles.list}>
          {filtered.map(order => (
            <div key={order._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.orderId}>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                  {order.user && (
                    <p style={styles.orderUser}>
                      👤 {order.user.name} — {order.user.email}
                    </p>
                  )}
                </div>
                <div style={styles.rightHeader}>
                  <span style={{
                    ...styles.statusBadge,
                    background: statusColors[order.status]?.bg,
                    color: statusColors[order.status]?.color
                  }}>
                    {order.status.toUpperCase()}
                  </span>
                  <p style={styles.total}>₹{order.total}</p>
                </div>
              </div>

              {/* Items */}
              <div style={styles.items}>
                {order.items.map(item => (
                  <div key={item._id} style={styles.item}>
                    <span>📦 {item.name}</span>
                    <span>Qty: {item.qty}</span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              {/* Address */}
              <div style={styles.address}>
                📍 {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} - {order.shippingAddress.zip}
              </div>

              {/* Status Update */}
              <div style={styles.statusUpdate}>
                <label style={styles.statusLabel}>Update Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  style={styles.select}>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container:   { padding: '2rem', maxWidth: '1000px', margin: '0 auto' },
  header:      { marginBottom: '1.5rem' },
  title:       { fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e', margin: 0 },
  subtitle:    { color: '#718096', margin: '0.3rem 0 0' },
  success:     { background: '#f0fff4', color: '#16a34a', padding: '0.75rem',
                 borderRadius: '6px', marginBottom: '1rem' },
  stats:       { display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
                 marginBottom: '1.5rem' },
  statBtn:     { padding: '0.5rem 1rem', border: '2px solid #1a1a2e',
                 borderRadius: '20px', cursor: 'pointer', fontWeight: '600',
                 fontSize: '0.85rem' },
  list:        { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  card:        { background: 'white', borderRadius: '12px',
                 boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  cardHeader:  { display: 'flex', justifyContent: 'space-between',
                 padding: '1.5rem', borderBottom: '1px solid #f0f0f0' },
  orderId:     { fontWeight: 'bold', color: '#1a1a2e', margin: 0 },
  orderDate:   { color: '#718096', fontSize: '0.85rem', margin: '0.2rem 0' },
  orderUser:   { color: '#555', fontSize: '0.9rem', margin: 0 },
  rightHeader: { textAlign: 'right' },
  statusBadge: { padding: '0.4rem 1rem', borderRadius: '20px',
                 fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-block' },
  total:       { fontSize: '1.3rem', fontWeight: 'bold', color: '#1a1a2e',
                 margin: '0.5rem 0 0' },
  items:       { padding: '1rem 1.5rem', borderBottom: '1px solid #f0f0f0' },
  item:        { display: 'flex', justifyContent: 'space-between',
                 padding: '0.4rem 0', color: '#555', fontSize: '0.9rem' },
  address:     { padding: '0.75rem 1.5rem', background: '#f7f8fc',
                 color: '#555', fontSize: '0.85rem',
                 borderBottom: '1px solid #f0f0f0' },
  statusUpdate:{ display: 'flex', alignItems: 'center', gap: '1rem',
                 padding: '1rem 1.5rem' },
  statusLabel: { fontWeight: '600', color: '#333' },
  select:      { padding: '0.5rem 1rem', border: '1px solid #ddd',
                 borderRadius: '6px', fontSize: '0.9rem', cursor: 'pointer' },
  center:      { textAlign: 'center', padding: '4rem', fontSize: '1.2rem' }
};

export default AdminOrders;