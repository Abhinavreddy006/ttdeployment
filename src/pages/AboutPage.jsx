import React from 'react';
import { Sparkles, Bookmark, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="about-page fade-in" style={{ padding: '3.5rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '880px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>
            Cinema Concierge & Discovery
          </span>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-ivory)' }}>
            About CineRate
          </h1>
          <p style={{ color: 'var(--text-ivory-dim)', fontSize: '1.12rem', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
            A curated movie platform built to help cinephiles and curious viewers navigate the rich tapestry of world cinema.
          </p>
        </div>

        {/* Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.75rem',
          marginBottom: '3.5rem'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.75rem'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '6px',
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Sparkles size={22} style={{ color: 'var(--gold-primary)' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-ivory)' }}>
              Find My Film
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Cut through choice paralysis. Our guided assistant recommends titles tuned to your mood, available viewing time, and language.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.75rem'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '6px',
              backgroundColor: 'rgba(122, 28, 45, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Bookmark size={22} style={{ color: '#ff9fae' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-ivory)' }}>
              Personal Watchlist
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Save films effortlessly with one click. Build your personal watchlist queue and keep track of films you intend to watch.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.75rem'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '6px',
              backgroundColor: 'rgba(78, 168, 222, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Award size={22} style={{ color: 'var(--info)' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-ivory)' }}>
              Community Reflections
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Read and contribute thoughtful reviews tagged with emotional sentiment, performances, and cinematography insights.
            </p>
          </div>
        </div>

        {/* Catalog information */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.85rem',
            backgroundColor: 'rgba(1, 180, 228, 0.1)',
            border: '1px solid rgba(1, 180, 228, 0.3)',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <span style={{ fontWeight: 800, color: 'var(--accent-red-bright)', fontSize: '1.1rem', letterSpacing: '0.05em' }}>CINE</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-ivory)' }}>
            CineRate Movie Catalog
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto', lineHeight: '1.6' }}>
            CineRate uses live movie information from TMDB. Spring Boot and MySQL store CineRate accounts, reviews, and watchlists, and help personalize recommendations.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '1rem auto 0', maxWidth: '580px' }}>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
