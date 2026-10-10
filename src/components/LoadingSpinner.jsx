import React from 'react';

const LoadingSpinner = ({ message = 'Consulting the CineRate archive...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      textAlign: 'center'
    }}>
      <div
        style={{
          width: '44px',
          height: '44px',
          border: '3px solid rgba(212, 175, 55, 0.18)',
          borderTop: '3px solid var(--gold-primary)',
          borderRadius: '50%',
          animation: 'spin 0.85s linear infinite',
          marginBottom: '1.25rem'
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.05rem',
        color: 'var(--text-ivory-dim)',
        letterSpacing: '0.02em'
      }}>
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
