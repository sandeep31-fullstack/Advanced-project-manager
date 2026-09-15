import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '50px',
        borderRadius: '20px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        maxWidth: '600px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: 'bold' ,lineHeight:'1.2' }}>
          Advanced Project Manager
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '40px', lineHeight: '1.6', color: '#e0f2fe' }}>
          Welcome, Sandeep! Streamline your agile engineering workflows, track enterprise project tasks, and optimize collaboration with our modern 3-column Kanban interface.
        </p>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            background: '#ffffff',
            color: '#1e3a8a',
            border: 'none',
            padding: '15px 40px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: '30px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Get Started ➔
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
