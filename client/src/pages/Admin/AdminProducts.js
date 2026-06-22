import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';

const empty = {
  name: '', description: '', price: '', stock: '', category: 'Electronics', image: ''
};

const AdminProducts = () => {
  const navigate       = useNavigate();
  const { user }       = useSelector(state => state.auth);
  const [products,    setProducts]   = useState([]);
  const [loading,     setLoading]    = useState(true);
  const [showForm,    setShowForm]   = useState(false);
  const [formData,    setFormData]   = useState(empty);
  const [editId,      setEditId]     = useState(null);
  const [error,       setError]      = useState('');
  const [success,     setSuccess]    = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const { data } = await getProducts();
      setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editId) {
        await updateProduct(editId, formData);
        setSuccess('Product updated successfully!');
      } else {
        await createProduct(formData);
        setSuccess('Product created successfully!');
      }
      setFormData(empty);
      setEditId(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name:        product.name,
      description: product.description,
      price:       product.price,
      stock:       product.stock,
      category:    product.category,
      image:       product.image
    });
    setEditId(product._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      setSuccess('Product deleted!');
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  if (loading) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Admin — Products</h2>
          <p style={styles.subtitle}>{products.length} products total</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setFormData(empty); setEditId(null); }}
          style={styles.addBtn}>
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {error   && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      {/* Form */}
      {showForm && (
        <div style={styles.formBox}>
          <h3 style={styles.formTitle}>
            {editId ? '✏️ Edit Product' : '➕ Add New Product'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Product Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="iPhone 15"
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={styles.input}>
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Food</option>
                  <option>Books</option>
                  <option>Other</option>
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Price (₹)</label>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="999"
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Stock</label>
                <input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="50"
                  required
                  style={styles.input}
                />
              </div>
              <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
                <label style={styles.label}>Image URL</label>
                <input
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  style={styles.input}
                />
              </div>
              <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
                <label style={styles.label}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Product description..."
                  required
                  rows={3}
                  style={{ ...styles.input, resize: 'vertical' }}
                />
              </div>
            </div>
            <button type="submit" style={styles.submitBtn}>
              {editId ? '💾 Update Product' : '➕ Create Product'}
            </button>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div style={styles.tableBox}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.productCell}>
                    <span style={styles.productIcon}>📦</span>
                    <div>
                      <p style={styles.productName}>{product.name}</p>
                      <p style={styles.productDesc}>
                        {product.description.slice(0, 40)}...
                      </p>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={styles.categoryBadge}>{product.category}</span>
                </td>
                <td style={styles.td}>
                  <strong>₹{product.price}</strong>
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.stockBadge,
                    color: product.stock > 0 ? '#16a34a' : '#e11d48',
                    background: product.stock > 0 ? '#f0fdf4' : '#fff1f2'
                  }}>
                    {product.stock} units
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      onClick={() => handleEdit(product)}
                      style={styles.editBtn}>
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      style={styles.deleteBtn}>
                      🗑 Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container:    { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  header:       { display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: '1.5rem' },
  title:        { fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e', margin: 0 },
  subtitle:     { color: '#718096', margin: '0.3rem 0 0' },
  addBtn:       { background: '#1a1a2e', color: 'white', border: 'none',
                  padding: '0.75rem 1.5rem', borderRadius: '8px',
                  cursor: 'pointer', fontWeight: '600' },
  error:        { background: '#fff5f5', color: '#e53e3e', padding: '0.75rem',
                  borderRadius: '6px', marginBottom: '1rem' },
  success:      { background: '#f0fff4', color: '#16a34a', padding: '0.75rem',
                  borderRadius: '6px', marginBottom: '1rem' },
  formBox:      { background: 'white', padding: '2rem', borderRadius: '12px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '2rem' },
  formTitle:    { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem',
                  color: '#1a1a2e' },
  formGrid:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field:        { display: 'flex', flexDirection: 'column' },
  label:        { fontWeight: '600', marginBottom: '0.4rem', color: '#333',
                  fontSize: '0.9rem' },
  input:        { padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px',
                  fontSize: '1rem', boxSizing: 'border-box', width: '100%' },
  submitBtn:    { marginTop: '1rem', padding: '0.85rem 2rem', background: '#1a1a2e',
                  color: 'white', border: 'none', borderRadius: '8px',
                  fontSize: '1rem', cursor: 'pointer', fontWeight: '600' },
  tableBox:     { background: 'white', borderRadius: '12px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table:        { width: '100%', borderCollapse: 'collapse' },
  thead:        { background: '#f7f8fc' },
  th:           { padding: '1rem', textAlign: 'left', fontWeight: '600',
                  color: '#555', fontSize: '0.9rem' },
  tr:           { borderBottom: '1px solid #f0f0f0' },
  td:           { padding: '1rem', verticalAlign: 'middle' },
  productCell:  { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  productIcon:  { fontSize: '1.8rem' },
  productName:  { fontWeight: '600', color: '#1a1a2e', margin: 0 },
  productDesc:  { color: '#718096', fontSize: '0.8rem', margin: 0 },
  categoryBadge:{ background: '#e8f0fe', color: '#1a1a2e', padding: '0.3rem 0.75rem',
                  borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' },
  stockBadge:   { padding: '0.3rem 0.75rem', borderRadius: '20px',
                  fontSize: '0.85rem', fontWeight: '600' },
  actions:      { display: 'flex', gap: '0.5rem' },
  editBtn:      { background: '#eff6ff', color: '#2563eb', border: 'none',
                  padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' },
  deleteBtn:    { background: '#fff1f2', color: '#e11d48', border: 'none',
                  padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' },
  center:       { textAlign: 'center', padding: '4rem', fontSize: '1.2rem' }
};

export default AdminProducts;