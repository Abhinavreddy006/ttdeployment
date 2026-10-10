
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Film, Search } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

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
            <Link to="/sign-in" className="navbar-login" onClick={closeMenu}>Login</Link>
            <Link to="/create-account" className="navbar-signup" onClick={closeMenu}>Sign Up</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
