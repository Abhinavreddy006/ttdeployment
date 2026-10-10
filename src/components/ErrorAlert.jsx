import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorAlert = ({ message, onRetry }) => (
  <div style={{
    backgroundColor: 'rgba(122, 28, 45, 0.12)',
    border: '1px solid rgba(196, 92, 111, 0.35)',
    borderRadius: 'var(--radius-md)',
    padding: '0.8rem 1rem',
    margin: '0.8rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: 'var(--text-ivory-dim)',
    fontSize: '0.9rem'
  }} role="alert">
    <AlertCircle size={17} style={{ color: '#ffadb8', flexShrink: 0 }} aria-hidden="true" />
    <p style={{ margin: 0, lineHeight: 1.45, flex: 1 }}>{message}</p>
    {onRetry && (
      <button type="button" onClick={onRetry} className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>
        <RefreshCw size={14} /> Retry
      </button>
    )}
  </div>
);

export default ErrorAlert;
