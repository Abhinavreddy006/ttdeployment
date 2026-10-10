import React from 'react';
import { Link } from 'react-router-dom';
import { Film, PlusCircle } from 'lucide-react';

const EmptyState = ({
  title = 'No Movies Found in Database',
  description = 'The MySQL cinerate database currently has no matching film records.',
  actionLink = '/add-movie',
  actionText = 'Add First Film'
}) => {
  return (
    <div style={{
      padding: '4rem 2rem',
      textAlign: 'center',
      backgroundColor: 'var(--bg-surface)',
      border: '1px dashed var(--border-medium)',
      borderRadius: 'var(--radius-lg)',
      margin: '2rem 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: '680px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem',
        border: '1px solid var(--border-gold)'
      }}>
        <Film size={28} style={{ color: 'var(--gold-primary)' }} />
      </div>

      <h3 style={{ fontSize: '1.45rem', marginBottom: '0.65rem', color: 'var(--text-ivory)' }}>
        {title}
      </h3>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '480px', marginBottom: '1.75rem' }}>
        {description}
      </p>

      {actionLink && (
        <Link to={actionLink} className="btn btn-gold btn-sm">
          <PlusCircle size={16} /> {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
