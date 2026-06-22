import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/api';
import { addToCart } from '../redux/cartSlice';

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProducts();
        setProducts(data.products);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    alert(`${product.name} added to cart!`);
  };

  if (loading) return <div style={styles.center}>Loading products...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>All Products</h2>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {filtered.length === 0 ? (
        <div style={styles.center}>No products found</div>
      ) : (
        <div style={styles.grid}>
          {filtered.map(product => (
            <div key={product._id} style={styles.card}>
              <div style={styles.image}>
                {product.image && product.image.startsWith('http')
                  ? <img src={product.image} alt={product.name} style={styles.img} />
                  : <div style={styles.placeholder}>📦</div>
                }
              </div>
              <div style={styles.info}>
                <h3 style={styles.name}>{product.name}</h3>
                <p style={styles.category}>{product.category}</p>
                <p style={styles.desc}>{product.description}</p>
                <p style={styles.price}>₹{product.price}</p>
                <p style={styles.stock}>
                  {product.stock > 0
                    ? `In Stock (${product.stock})`
                    : 'Out of Stock'}
                </p>
                <div style={styles.buttons}>
                  <button
                    onClick={() => navigate(`/products/${product._id}`)}
                    style={styles.viewBtn}>
                    View Details
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    style={styles.cartBtn}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  title:     { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem',
               color: '#1a1a2e' },
  search:    { width: '100%', padding: '0.75rem', border: '1px solid #ddd',
               borderRadius: '8px', fontSize: '1rem', marginBottom: '2rem',
               boxSizing: 'border-box' },
  grid:      { display: 'grid',
               gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
               gap: '1.5rem' },
  card:      { background: 'white', borderRadius: '12px',
               boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  image:     { height: '180px', background: '#f7f8fc',
               display: 'flex', alignItems: 'center', justifyContent: 'center' },
  img:       { width: '100%', height: '180px', objectFit: 'cover' },
  placeholder: { fontSize: '4rem' },
  info:      { padding: '1rem' },
  name:      { fontSize: '1.1rem', fontWeight: 'bold', color: '#1a1a2e',
               marginBottom: '0.3rem' },
  category:  { color: '#718096', fontSize: '0.85rem', marginBottom: '0.5rem' },
  desc:      { color: '#555', fontSize: '0.9rem', marginBottom: '0.5rem',
               display: '-webkit-box', WebkitLineClamp: 2,
               WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  price:     { fontSize: '1.3rem', fontWeight: 'bold', color: '#1a1a2e',
               marginBottom: '0.3rem' },
  stock:     { fontSize: '0.85rem', color: '#48bb78', marginBottom: '1rem' },
  buttons:   { display: 'flex', gap: '0.5rem' },
  viewBtn:   { flex: 1, padding: '0.6rem', background: 'white',
               color: '#1a1a2e', border: '2px solid #1a1a2e',
               borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  cartBtn:   { flex: 1, padding: '0.6rem', background: '#1a1a2e',
               color: 'white', border: 'none', borderRadius: '6px',
               cursor: 'pointer', fontWeight: '600' },
  center:    { textAlign: 'center', padding: '3rem', fontSize: '1.2rem' }
};

export default Products;