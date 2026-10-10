import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="container" style={{
      padding: '6rem 1.5rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'rgba(122, 28, 45, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        border: '1px solid var(--burgundy-border)'
      }}>
        <Film size={32} style={{ color: 'var(--gold-primary)' }} />
      </div>

      <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', color: 'var(--text-ivory)' }}>
        404
      </h1>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-ivory-dim)' }}>
        Frame Not Found
      </h2>

      <p style={{ color: 'var(--text-muted)', maxWidth: '440px', marginBottom: '2rem' }}>
        The reel or scene you requested does not exist in the CineRate catalog.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary">
          <Home size={16} /> Return to Home
        </Link>
        <Link to="/explore" className="btn btn-outline">
          <Compass size={16} /> Explore Archive
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
