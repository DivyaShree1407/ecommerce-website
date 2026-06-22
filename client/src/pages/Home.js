import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign:'center', padding:'4rem' }}>
      <h1 style={{ fontSize:'3rem' }}>Welcome to ShopEasy 🛒</h1>
      <p style={{ fontSize:'1.2rem', color:'#666', margin:'1rem 0' }}>
        Best products at best prices
      </p>
      <button
        onClick={() => navigate('/products')}
        style={{ background:'#1a1a2e', color:'white', padding:'1rem 2rem',
                 border:'none', borderRadius:'8px', fontSize:'1rem', cursor:'pointer' }}>
        Shop Now
      </button>
    </div>
  );
};

export default Home;