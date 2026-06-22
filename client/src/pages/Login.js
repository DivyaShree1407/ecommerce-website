import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../redux/authSlice';
import { loginUser } from '../services/api';

const Login = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await loginUser(formData);
      dispatch(setCredentials({ user: data.user, token: data.token }));

      // Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/admin/products');
      } else {
        navigate('/products');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>Login to your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            style={styles.btn}
            disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display:'flex', justifyContent:'center',
               alignItems:'center', minHeight:'90vh', background:'#f7f8fc' },
  card:      { background:'white', padding:'2.5rem', borderRadius:'12px',
               boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:'100%', maxWidth:'400px' },
  title:     { fontSize:'1.8rem', fontWeight:'bold', marginBottom:'0.3rem',
               color:'#1a1a2e' },
  subtitle:  { color:'#666', marginBottom:'1.5rem' },
  error:     { background:'#fff5f5', color:'#e53e3e', padding:'0.75rem',
               borderRadius:'6px', marginBottom:'1rem', fontSize:'0.9rem' },
  field:     { marginBottom:'1.2rem' },
  label:     { display:'block', marginBottom:'0.4rem',
               fontWeight:'600', color:'#333' },
  input:     { width:'100%', padding:'0.75rem', border:'1px solid #ddd',
               borderRadius:'6px', fontSize:'1rem', boxSizing:'border-box' },
  btn:       { width:'100%', padding:'0.85rem', background:'#1a1a2e',
               color:'white', border:'none', borderRadius:'6px',
               fontSize:'1rem', cursor:'pointer', marginTop:'0.5rem' },
  footer:    { textAlign:'center', marginTop:'1.5rem', color:'#666' },
  link:      { color:'#1a1a2e', fontWeight:'bold' }
};

export default Login;