import React, { useState } from 'react';
import { X, Star, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { reviewService } from '../services/api';

const MOOD_FEELINGS = [
  'Laughing',
  'Inspired',
  'Uplifted',
  'Happy',
  'Creeped Out',
  'Heartbroken',
  'Nostalgic',
  'Romantic',
  'Mind-Blown',
  'Tense',
  'Melancholic'
];

const ReviewModal = ({ isOpen, onClose, movie, onReviewSubmitted }) => {
  const [rating, setRating] = useState(8);
  const [selectedMood, setSelectedMood] = useState('Uplifted');
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !movie) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please share your thoughts before submitting.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        tmdbId: movie.id || movie.tmdbId,
        movieTitle: movie.title || movie.name,
        authorName: authorName.trim() || 'Film Enthusiast',
        rating: Number(rating),
        moodTag: selectedMood,
        content: content.trim()
      };

      await reviewService.submitReview(payload);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onReviewSubmitted) onReviewSubmitted();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content fade-in" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle2 size={48} style={{ color: 'var(--success)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-ivory)' }}>
              Review Published!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Your rating and reflections have been recorded.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--gold-light)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                <Sparkles size={13} /> Rate Film
              </div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--text-ivory)' }}>
                {movie.title || movie.name}
              </h2>
            </div>

            {error && (
              <div style={{
                backgroundColor: 'rgba(224, 82, 99, 0.15)',
                border: '1px solid var(--error)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                color: '#ff9ea9',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Rating Score Slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Your Score</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--gold-light)', fontWeight: 700, fontSize: '1.2rem' }}>
                  <Star size={18} style={{ fill: 'var(--gold-primary)', color: 'var(--gold-primary)' }} />
                  <span>{rating} / 10</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--gold-primary)',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Mood / Feeling Chips */}
            <div className="form-group">
              <label className="form-label">How did it make you feel?</label>
              <div className="mood-chips-container">
                {MOOD_FEELINGS.map(mood => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => setSelectedMood(mood)}
                    className={`mood-chip ${selectedMood === mood ? 'selected' : ''}`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Reviewer Name */}
            <div className="form-group">
              <label className="form-label">Your Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. CinemaLover, Angela"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Thoughts Textarea */}
            <div className="form-group">
              <label className="form-label">What were your thoughts? *</label>
              <textarea
                rows={4}
                placeholder="Share your perspective on the performances, pacing, cinematography, and themes..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="form-textarea"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button type="submit" className="btn btn-gold btn-sm" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
