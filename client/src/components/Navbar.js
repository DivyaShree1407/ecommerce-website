import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

const Navbar = () => {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const { user }    = useSelector(state => state.auth);
  const { items }   = useSelector(state => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🛒 ShopEasy</Link>

      <div style={styles.links}>
        <Link to="/products" style={styles.link}>Products</Link>

        {user ? (
          <>
            <Link to="/orders" style={styles.link}>My Orders</Link>
            {user.role === 'admin' && (
              <>
                <Link to="/admin/products" style={styles.link}>Admin Products</Link>
                <Link to="/admin/orders"   style={styles.link}>Admin Orders</Link>
              </>
            )}
            <Link to="/cart" style={styles.link}>
              🛒 Cart ({items.length})
            </Link>
            <span style={styles.user}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav:   { display:'flex', justifyContent:'space-between', alignItems:'center',
           padding:'1rem 2rem', background:'#1a1a2e', color:'white' },
  brand: { color:'white', textDecoration:'none', fontSize:'1.5rem', fontWeight:'bold' },
  links: { display:'flex', gap:'1rem', alignItems:'center' },
  link:  { color:'white', textDecoration:'none' },
  user:  { color:'#a0aec0' },
  btn:   { background:'#e53e3e', color:'white', border:'none',
           padding:'0.4rem 1rem', borderRadius:'4px', cursor:'pointer' }
};

export default Navbar;