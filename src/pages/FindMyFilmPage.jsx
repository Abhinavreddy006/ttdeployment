import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recommendationService } from '../services/api';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import {
  Sparkles,
  RotateCcw,
  Clock,
  Globe,
  Smile,
  Calendar,
  Star,
  CheckCircle2,
  ArrowRight,
  Info
} from 'lucide-react';

const MOODS = [
  { id: 'relaxed', label: 'Relaxed & Lighthearted', genres: '35,16', explanation: 'Selected for light, cheerful comedic tone' },
  { id: 'happy', label: 'Uplifting & Joyful', genres: '35,12,10751', explanation: 'Selected for inspiring, family-friendly adventure' },
  { id: 'thoughtful', label: 'Thoughtful & Philosophical', genres: '18,9648,878', explanation: 'Selected for provocative themes and narrative depth' },
  { id: 'excited', label: 'High Energy & Adrenaline', genres: '28,53,878', explanation: 'Selected for gripping action and thrilling momentum' },
  { id: 'emotional', label: 'Deeply Emotional', genres: '18,10749', explanation: 'Selected for poignant dramatic performances' },
  { id: 'suspenseful', label: 'Tense & Suspenseful', genres: '53,9648,27', explanation: 'Selected for nail-biting suspense and mystery' },
  { id: 'adventurous', label: 'Adventurous & Grand', genres: '12,14,28', explanation: 'Selected for sweeping world-building and epic scale' }
];

const LANGUAGES = [
  { code: 'all', label: 'Any Language' },
  { code: 'te', label: 'Telugu' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ta', label: 'Tamil' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' }
];

const ERAS = [
  { id: 'any', label: 'Any Era', year: null },
  { id: 'modern', label: 'Modern (2020 – Present)', year: 2023 },
  { id: 'contemporary', label: 'Contemporary (2010 – 2019)', year: 2015 },
  { id: 'golden', label: 'Classic (2000s)', year: 2005 }
];

const FindMyFilmPage = () => {
  const [selectedMood, setSelectedMood] = useState('thoughtful');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedEra, setSelectedEra] = useState('any');
  const [minRating, setMinRating] = useState('7.0');

  const [recommendations, setRecommendations] = useState([]);
  const [recommendationBasis, setRecommendationBasis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const moodObj = MOODS.find(m => m.id === selectedMood);
      const eraObj = ERAS.find(e => e.id === selectedEra);

      const result = await recommendationService.getMovieRecommendations({
        language: selectedLanguage,
        fallbackGenres: moodObj ? moodObj.genres.split(',') : [],
        year: eraObj?.year || undefined,
        sortBy: 'vote_average.desc',
        minRating: Number(minRating)
      });

      setRecommendations(result.movies);
      setRecommendationBasis(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateRecommendations();
  }, [selectedMood, selectedLanguage, selectedEra, minRating]);

  const currentMoodObj = MOODS.find(m => m.id === selectedMood);

  return (
    <div className="find-my-film-page fade-in" style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container">

        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.9rem',
            backgroundColor: 'rgba(212, 175, 55, 0.12)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--gold-light)',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '1rem'
          }}>
            <Sparkles size={14} /> Cinema Concierge
          </div>

          <h1 style={{ fontSize: '3rem', marginBottom: '0.85rem', color: 'var(--text-ivory)' }}>
            Find My Film
          </h1>

          <p style={{ color: 'var(--text-ivory-dim)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Answer a few quick questions about your current mood, language, and era preferences. We match you with acclaimed cinema accompanied by clear reasoning.
          </p>
        </div>

        {/* Wizard Controls Card */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '3.5rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem'
          }}>

            {/* 1. Mood */}
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Smile size={16} style={{ color: 'var(--gold-primary)' }} />
                1. Current Mood or Vibe
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.5rem' }}>
                {MOODS.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMood(m.id)}
                    style={{
                      padding: '0.65rem 0.9rem',
                      textAlign: 'left',
                      backgroundColor: selectedMood === m.id ? 'var(--burgundy-dim)' : 'var(--bg-surface-elevated)',
                      border: selectedMood === m.id ? '1px solid var(--burgundy-hover)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: selectedMood === m.id ? '#fff' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.88rem'
                    }}
                  >
                    <span>{m.label}</span>
                    {selectedMood === m.id && <CheckCircle2 size={15} style={{ color: 'var(--gold-primary)' }} />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Language & Era */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Globe size={16} style={{ color: 'var(--gold-primary)' }} />
                  2. Preferred Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="form-select"
                >
                  {LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Calendar size={16} style={{ color: 'var(--gold-primary)' }} />
                  3. Preferred Era
                </label>
                <select
                  value={selectedEra}
                  onChange={(e) => setSelectedEra(e.target.value)}
                  className="form-select"
                >
                  {ERAS.map(era => (
                    <option key={era.id} value={era.id}>{era.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Star size={16} style={{ color: 'var(--gold-primary)' }} />
                  4. Minimum Rating Threshold
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="form-select"
                >
                  <option value="0">Any Rating</option>
                  <option value="6.0">6.0+ Stars</option>
                  <option value="7.0">7.0+ Stars (High Quality)</option>
                  <option value="8.0">8.0+ Stars (Masterpieces)</option>
                </select>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <button
                  type="button"
                  onClick={() => { setSelectedMood('relaxed'); setSelectedLanguage('all'); setSelectedEra('any'); setMinRating('7.0'); }}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%' }}
                >
                  <RotateCcw size={14} /> Reset Preferences
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Results Area */}
        {loading && <LoadingSpinner message="Evaluating films matching your mood and preferences..." />}
        {error && <ErrorAlert message={error} onRetry={generateRecommendations} />}

        {!loading && !error && (
          <section>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: '1.75rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.85rem'
            }}>
              <div>
                <h2 style={{ fontSize: '2rem', color: 'var(--text-ivory)' }}>
                  Recommended For You ({recommendations.length})
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {recommendationBasis?.basedOnWatchlist
                    ? `Your saved genres${recommendationBasis.genreNames.length ? ` (${recommendationBasis.genreNames.join(', ')})` : ''} are combined with community review ratings and your selected mood.`
                    : currentMoodObj?.explanation}
                </p>
              </div>
            </div>

            {recommendationBasis?.reviewFailures > 0 && (
              <p className="recommendation-notice" role="status">
                Community reviews could not be loaded for {recommendationBasis.reviewFailures} saved title(s). Recommendations still use the available watchlist genres and ratings.
              </p>
            )}

            {recommendations.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 1.5rem',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)'
              }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--text-ivory)' }}>
                  No Films Match All Strict Criteria
                </h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                  Try choosing 'Any Language' or lowering the minimum rating threshold.
                </p>
              </div>
            ) : (
              <div className="movie-grid">
                {recommendations.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
};

export default FindMyFilmPage;
