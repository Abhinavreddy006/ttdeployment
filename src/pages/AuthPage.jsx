import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import ErrorAlert from '../components/ErrorAlert';

const AuthPage = ({ mode }) => {
  const isRegistration = mode === 'register';
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (isRegistration) {
        await authService.register({ displayName: displayName.trim(), email: email.trim(), password });
        setSuccess('Account created. You can now sign in.');
      } else {
        const user = await authService.login({ email: email.trim(), password });
        window.dispatchEvent(new CustomEvent('cinerate-auth-changed', { detail: user }));
        navigate('/');
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
      <section className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem', color: 'var(--text-ivory)' }}>
          {isRegistration ? 'Create Account' : 'Sign In'}
        </h1>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          {isRegistration ? 'Create your CineRate account.' : 'Sign in to your CineRate account.'}
        </p>

        {error && <ErrorAlert message={error} />}
        {success && <p role="status" style={{ marginBottom: '1rem', color: 'var(--success)' }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          {isRegistration && (
            <div className="form-group">
              <label className="form-label" htmlFor="display-name">Name</label>
              <input
                id="display-name"
                className="form-input"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                autoComplete="name"
                maxLength={80}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="form-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              maxLength={254}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="form-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isRegistration ? 'new-password' : 'current-password'}
              minLength={8}
              maxLength={72}
              required
            />
          </div>
          <button className="btn btn-gold" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : isRegistration ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '1.25rem', color: 'var(--text-muted)' }}>
          {isRegistration ? 'Already have an account? ' : 'New to CineRate? '}
          <Link
            to={isRegistration ? '/sign-in' : '/create-account'}
            style={{ color: 'var(--accent-red-bright)' }}
          >
            {isRegistration ? 'Sign In' : 'Create Account'}
          </Link>
        </p>
      </section>
    </div>
  );
};

export default AuthPage;
