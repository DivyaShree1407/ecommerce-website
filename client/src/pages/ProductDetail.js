import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getProduct } from '../services/api';
import { addToCart } from '../redux/cartSlice';

const ProductDetail = () => {
  const { id }    = useParams();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added,   setAdded]   = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProduct(id);
        setProduct(data.product);
      } catch (err) {
        console.error('Failed to fetch product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div style={styles.center}>Loading product...</div>;
  if (!product) return <div style={styles.center}>Product not found</div>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/products')} style={styles.back}>
        ← Back to Products
      </button>

      <div style={styles.layout}>
        {/* Product Image */}
        <div style={styles.imageBox}>
          {product.image && product.image.startsWith('http')
            ? <img src={product.image} alt={product.name} style={styles.img} />
            : <div style={styles.placeholder}>📦</div>
          }
        </div>

        {/* Product Info */}
        <div style={styles.info}>
          <span style={styles.category}>{product.category}</span>
          <h1 style={styles.name}>{product.name}</h1>
          <p style={styles.desc}>{product.description}</p>

          <div style={styles.priceBox}>
            <span style={styles.price}>₹{product.price}</span>
            <span style={{
              ...styles.stockBadge,
              background: product.stock > 0 ? '#f0fff4' : '#fff5f5',
              color: product.stock > 0 ? '#48bb78' : '#e53e3e'
            }}>
              {product.stock > 0 ? `✅ In Stock (${product.stock})` : '❌ Out of Stock'}
            </span>
          </div>

          <div style={styles.buttons}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{
                ...styles.cartBtn,
                background: added ? '#48bb78' : '#1a1a2e'
              }}>
              {added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
            </button>

            <button
              onClick={() => navigate('/cart')}
              style={styles.viewCartBtn}>
              View Cart
            </button>
          </div>

          <div style={styles.meta}>
            <div style={styles.metaRow}>
              <span style={styles.metaLabel}>Category</span>
              <span>{product.category}</span>
            </div>
            <div style={styles.metaRow}>
              <span style={styles.metaLabel}>Stock</span>
              <span>{product.stock} units</span>
            </div>
            <div style={styles.metaRow}>
              <span style={styles.metaLabel}>Added</span>
              <span>{new Date(product.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container:   { padding: '2rem', maxWidth: '1000px', margin: '0 auto' },
  back:        { background: 'none', border: 'none', color: '#1a1a2e',
                 fontSize: '1rem', cursor: 'pointer', marginBottom: '1.5rem',
                 fontWeight: '600' },
  layout:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' },
  imageBox:    { background: '#f7f8fc', borderRadius: '16px', height: '350px',
                 display: 'flex', alignItems: 'center', justifyContent: 'center' },
  img:         { width: '100%', height: '350px', objectFit: 'cover',
                 borderRadius: '16px' },
  placeholder: { fontSize: '8rem' },
  info:        { display: 'flex', flexDirection: 'column', gap: '1rem' },
  category:    { background: '#e8f0fe', color: '#1a1a2e', padding: '0.3rem 0.8rem',
                 borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600',
                 alignSelf: 'flex-start' },
  name:        { fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e', margin: 0 },
  desc:        { color: '#555', lineHeight: '1.7', fontSize: '1rem' },
  priceBox:    { display: 'flex', alignItems: 'center', gap: '1rem' },
  price:       { fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e' },
  stockBadge:  { padding: '0.4rem 1rem', borderRadius: '20px',
                 fontSize: '0.9rem', fontWeight: '600' },
  buttons:     { display: 'flex', gap: '1rem' },
  cartBtn:     { flex: 1, padding: '1rem', color: 'white', border: 'none',
                 borderRadius: '8px', fontSize: '1rem', cursor: 'pointer',
                 fontWeight: '600', transition: 'background 0.3s' },
  viewCartBtn: { flex: 1, padding: '1rem', background: 'white', color: '#1a1a2e',
                 border: '2px solid #1a1a2e', borderRadius: '8px',
                 fontSize: '1rem', cursor: 'pointer', fontWeight: '600' },
  meta:        { background: '#f7f8fc', borderRadius: '12px', padding: '1.5rem' },
  metaRow:     { display: 'flex', justifyContent: 'space-between',
                 padding: '0.5rem 0', borderBottom: '1px solid #eee',
                 fontSize: '0.95rem' },
  metaLabel:   { fontWeight: '600', color: '#555' },
  center:      { textAlign: 'center', padding: '4rem', fontSize: '1.2rem' }
};

export default ProductDetail;