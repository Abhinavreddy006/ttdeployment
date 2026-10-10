import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="footer-columns">
        <div className="footer-brand-column">
          <Link to="/" className="footer-brand">
            <span className="footer-brand-icon"><Film size={19} /></span>
            <span>CINE<span>RATE</span></span>
          </Link>
          <p>
            Discover movies for every mood. Explore the CineRate catalog, find your next favorite,
            and keep a watchlist of the stories you want to see.
          </p>
        </div>
        <div>
          <h2>Quick Links</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/explore">Discover</Link></li>
            <li><Link to="/watchlist">Watchlist</Link></li>
            <li><Link to="/recommendations">Recommendations</Link></li>
            <li><Link to="/about">About CineRate</Link></li>
          </ul>
        </div>
        <div>
          <h2>Movie Data</h2>
          <p className="footer-attribution-copy">
            Movie metadata and artwork are provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} CineRate</span>
        <span>Made for movie lovers</span>
      </div>
    </div>
  </footer>
);

export default Footer;
