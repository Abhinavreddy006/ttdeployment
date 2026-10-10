```jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthPage.css';

function AuthPage({ mode = 'login' }) {
  const isLogin = mode === 'login';
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Connect your existing Spring Boot login API here.
    console.log({ email, password });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        <p>
          {isLogin
            ? 'Sign in to continue your CineRate journey.'
            : 'Join CineRate and discover your next favorite film.'}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {isLogin && (
            <div className="auth-options">
              <label className="remember-label">
                <input type="checkbox" />
                Remember me
              </label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          )}

          <button type="submit" className="auth-submit">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? (
            <>
              New to CineRate? <Link to="/create-account">Create an account</Link>
            </>
          ) : (
            <>
              Already a member? <Link to="/sign-in">Sign in</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
```