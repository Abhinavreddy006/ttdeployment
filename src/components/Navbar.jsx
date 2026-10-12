import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Film, Search, User, LogOut, PlusCircle } from 'lucide-react';
import { authService } from '../services/api';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    let isMounted = true;
    authService.getCurrentUser()
      .then(user => {
        if (isMounted) setCurrentUser(user);
      })
      .catch(() => {
        if (isMounted) setCurrentUser(null);
      });

    const handleAuthChange = (event) => {
      setCurrentUser(event.detail || null);
    };

    window.addEventListener('cinerate-auth-changed', handleAuthChange);
    return () => {
      isMounted = false;
      window.removeEventListener('cinerate-auth-changed', handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setCurrentUser(null);
    window.dispatchEvent(new CustomEvent('cinerate-auth-changed', { detail: null }));
    closeMenu();
    navigate('/');
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    if (query) {
      navigate(`/explore?search=${encodeURIComponent(query)}`);
      setSearchTerm('');
      closeMenu();
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon"><Film size={21} strokeWidth={2.2} /></span>
          <span className="navbar-brand-copy">
            <span className="navbar-brand-name">CineRate</span>
            <span className="navbar-brand-subtitle">Cinema Concierge</span>
          </span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/explore" onClick={closeMenu}>
            Discover
          </NavLink>

          <NavLink to="/watchlist" onClick={closeMenu}>
            Watchlist
          </NavLink>

          <NavLink to="/recommendations" onClick={closeMenu}>
            Recommendations
          </NavLink>

          <NavLink to="/add-movie" onClick={closeMenu} className="navbar-add-link">
            <PlusCircle size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Add Movie
          </NavLink>

          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>

          <form className="navbar-search" onSubmit={handleSearch} role="search">
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              aria-label="Search movies"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </form>

          <div className="navbar-auth-links">
            {currentUser ? (
              <div className="navbar-user-profile">
                <span className="navbar-user-badge" title={currentUser.email}>
                  <User size={14} className="user-icon" />
                  <span className="user-name">{currentUser.displayName || currentUser.email?.split('@')[0]}</span>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="navbar-logout-btn"
                  title="Sign out of CineRate"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link to="/sign-in" className="navbar-login" onClick={closeMenu}>Login</Link>
                <Link to="/create-account" className="navbar-signup" onClick={closeMenu}>Sign Up</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
