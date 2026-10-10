import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { movieService } from '../services/api';
import PosterImage from '../components/PosterImage';
import { PlusCircle, Film, CheckCircle2, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';

const COMMON_GENRES = ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Western'];
const COMMON_LANGUAGES = ['English', 'Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada', 'Spanish', 'French', 'Korean', 'Japanese', 'German'];

const AddMoviePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: 'English',
    genre: 'Drama',
    releaseYear: new Date().getFullYear(),
    director: '',
    posterUrl: '',
    averageRating: '4.0',
    totalReviews: '0'
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [createdMovie, setCreatedMovie] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [importError, setImportError] = useState(null);

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Movie title is required.';
    }
    const year = Number(formData.releaseYear);
    if (!year || year < 1888 || year > 2035) {
      errors.releaseYear = 'Please provide a valid release year (between 1888 and 2035).';
    }
    const rating = Number(formData.averageRating);
    if (isNaN(rating) || rating < 0 || rating > 5) {
      errors.averageRating = 'Rating must be a number between 0.0 and 5.0.';
    }
    const reviews = Number(formData.totalReviews);
    if (isNaN(reviews) || reviews < 0) {
      errors.totalReviews = 'Total reviews must be 0 or greater.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = await movieService.createMovie(formData);
      setCreatedMovie(response || formData);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      language: 'English',
      genre: 'Drama',
      releaseYear: new Date().getFullYear(),
      director: '',
      posterUrl: '',
      averageRating: '4.0',
      totalReviews: '0'
    });
    setFieldErrors({});
    setSubmitError(null);
    setCreatedMovie(null);
  };

  const handleImportDataset = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    setImportStatus(null);
    setImportError(null);
    if (!file) return;

    let records;
    try {
      const parsed = JSON.parse(await file.text());
      records = Array.isArray(parsed) ? parsed : parsed?.movies;
      if (!Array.isArray(records)) {
        throw new Error('The JSON file must contain a movie array or a "movies" array.');
      }
    } catch (error) {
      setImportError(error.message || 'Could not read this JSON dataset.');
      return;
    }

    if (records.length === 0) {
      setImportError('The selected dataset contains no movies.');
      return;
    }

    const validRecords = [];
    const invalidRecords = [];
    records.forEach((record, index) => {
      if (!record || typeof record !== 'object' || Array.isArray(record) || !String(record.title || '').trim()) {
        invalidRecords.push(`Record ${index + 1}: a movie title is required.`);
        return;
      }

      const posterUrl = String(record.posterUrl || '').trim();
      const backdropUrl = String(record.backdropUrl || '').trim();
      const validImagePath = (value) => !value || value.startsWith('/') || /^https?:\/\/\S+$/i.test(value);
      if (!validImagePath(posterUrl) || !validImagePath(backdropUrl)) {
        invalidRecords.push(`Record ${index + 1}: image paths must be local absolute paths or valid HTTP(S) URLs.`);
        return;
      }

      const year = record.releaseYear === '' || record.releaseYear == null ? null : Number(record.releaseYear);
      const rating = record.averageRating === '' || record.averageRating == null ? 0 : Number(record.averageRating);
      const reviewCount = record.totalReviews === '' || record.totalReviews == null ? 0 : Number(record.totalReviews);
      if ((year !== null && (!Number.isInteger(year) || year < 1888 || year > 2100))
        || !Number.isFinite(rating) || rating < 0 || rating > 10
        || !Number.isInteger(reviewCount) || reviewCount < 0) {
        invalidRecords.push(`Record ${index + 1}: year, rating, or review count is invalid.`);
        return;
      }

      validRecords.push({
        title: String(record.title).trim(),
        description: String(record.description || ''),
        language: String(record.language || ''),
        genre: String(record.genre || ''),
        releaseYear: year,
        director: String(record.director || ''),
        posterUrl,
        backdropUrl,
        averageRating: rating,
        totalReviews: reviewCount
      });
    });

    if (validRecords.length === 0) {
      setImportError(invalidRecords.join(' '));
      return;
    }

    setImporting(true);
    const failedRecords = [...invalidRecords];
    let importedCount = 0;
    try {
      for (const [index, record] of validRecords.entries()) {
        try {
          await movieService.createMovie(record);
          importedCount += 1;
        } catch (error) {
          failedRecords.push(`Valid record ${index + 1}: ${error.message}`);
        }
      }
      setImportStatus(`${importedCount} of ${records.length} movie record(s) saved to MySQL.`);
      if (failedRecords.length > 0) {
        setImportError(failedRecords.join(' '));
      }
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="add-movie-page fade-in" style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '860px' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--gold-light)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Film size={15} /> Spring Boot REST API: POST /api/movies
          </div>
          <h1 style={{ fontSize: '2.75rem', marginBottom: '0.5rem', color: 'var(--text-ivory)' }}>
            Register Film in MySQL
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
            Submit a real movie record directly into your Spring Boot STS backend and persistent MySQL database table.
          </p>
        </div>

        {/* Success View */}
        {createdMovie ? (
          <div style={{
            backgroundColor: 'rgba(59, 178, 115, 0.1)',
            border: '1px solid var(--success)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(59, 178, 115, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <CheckCircle2 size={32} style={{ color: 'var(--success)' }} />
            </div>

            <h2 style={{ fontSize: '2rem', marginBottom: '0.65rem', color: 'var(--text-ivory)' }}>
              Movie Successfully Persisted!
            </h2>
            <p style={{ color: 'var(--text-ivory-dim)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 2rem auto' }}>
              <strong>"{createdMovie.title}"</strong> has been saved to MySQL table <code>cinerate</code> via <code>POST /api/movies</code>.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/explore" className="btn btn-primary">
                Explore in Archive <ArrowRight size={15} />
              </Link>
              <button onClick={handleReset} className="btn btn-outline">
                <RotateCcw size={15} /> Add Another Film
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-md)'
          }}>

            <section style={{
              padding: '1.25rem',
              marginBottom: '1.5rem',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-elevated)'
            }}>
              <h2 style={{ marginBottom: '0.4rem', fontSize: '1.15rem', color: 'var(--text-ivory)' }}>
                Import a local movie dataset
              </h2>
              <p style={{ marginBottom: '0.85rem', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                Choose a JSON array of movie records, or an object containing a <code>movies</code> array. Each record can include title, releaseYear, genre, description, averageRating, director, posterUrl, and backdropUrl. Image values must come from your dataset as local paths or HTTP(S) URLs.
              </p>
              <input
                type="file"
                accept=".json,application/json"
                aria-label="Import local movie JSON dataset"
                onChange={handleImportDataset}
                disabled={importing}
                className="form-input"
              />
              {importing && <p role="status" style={{ marginTop: '0.65rem', color: 'var(--text-muted)' }}>Saving movie records to MySQL...</p>}
              {importStatus && <p role="status" style={{ marginTop: '0.65rem', color: 'var(--success)' }}>{importStatus}</p>}
              {importError && <p role="alert" style={{ marginTop: '0.65rem', color: '#ff9ea9', fontSize: '0.86rem' }}>{importError}</p>}
            </section>

            {submitError && (
              <div style={{
                backgroundColor: 'rgba(224, 82, 99, 0.12)',
                border: '1px solid var(--error)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem 1.25rem',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#ff9ea9',
                fontSize: '0.92rem'
              }}>
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <span>{submitError}</span>
              </div>
            )}

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Movie Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. RRR, Inception, Oppenheimer"
                className="form-input"
                style={{ borderColor: fieldErrors.title ? 'var(--error)' : undefined }}
              />
              {fieldErrors.title && <span className="form-error-msg">{fieldErrors.title}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Synopsis / Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief summary of the story, themes, or historical context..."
                className="form-textarea"
                rows={4}
              />
            </div>

            {/* Grid 2-col: Genre & Language */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Genre</label>
                <input
                  type="text"
                  name="genre"
                  list="genre-suggestions"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="e.g. Action, Drama, Sci-Fi"
                  className="form-input"
                />
                <datalist id="genre-suggestions">
                  {COMMON_GENRES.map(g => <option key={g} value={g} />)}
                </datalist>
              </div>

              <div className="form-group">
                <label className="form-label">Language</label>
                <input
                  type="text"
                  name="language"
                  list="language-suggestions"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="e.g. Telugu, English, Hindi"
                  className="form-input"
                />
                <datalist id="language-suggestions">
                  {COMMON_LANGUAGES.map(l => <option key={l} value={l} />)}
                </datalist>
              </div>
            </div>

            {/* Grid 2-col: Director & Release Year */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Director</label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  placeholder="e.g. S. S. Rajamouli, Christopher Nolan"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Release Year *</label>
                <input
                  type="number"
                  name="releaseYear"
                  value={formData.releaseYear}
                  onChange={handleChange}
                  placeholder="2024"
                  className="form-input"
                  style={{ borderColor: fieldErrors.releaseYear ? 'var(--error)' : undefined }}
                />
                {fieldErrors.releaseYear && <span className="form-error-msg">{fieldErrors.releaseYear}</span>}
              </div>
            </div>

            {/* Poster URL with live preview */}
            <div className="form-group">
              <label className="form-label">Poster Image URL (Optional)</label>
              <input
                type="url"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/... or image link"
                className="form-input"
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', display: 'block', marginTop: '0.3rem' }}>
                If left blank or unavailable, CineRate will display an elegant editorial placeholder.
              </span>

              {formData.posterUrl && (
                <div style={{ marginTop: '0.85rem', width: '120px' }}>
                  <PosterImage src={formData.posterUrl} alt={formData.title || 'Preview'} />
                </div>
              )}
            </div>

            {/* Grid 2-col: Initial Average Rating & Total Reviews */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Average Rating (0.0 to 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  name="averageRating"
                  value={formData.averageRating}
                  onChange={handleChange}
                  className="form-input"
                  style={{ borderColor: fieldErrors.averageRating ? 'var(--error)' : undefined }}
                />
                {fieldErrors.averageRating && <span className="form-error-msg">{fieldErrors.averageRating}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Total Reviews</label>
                <input
                  type="number"
                  min="0"
                  name="totalReviews"
                  value={formData.totalReviews}
                  onChange={handleChange}
                  className="form-input"
                  style={{ borderColor: fieldErrors.totalReviews ? 'var(--error)' : undefined }}
                />
                {fieldErrors.totalReviews && <span className="form-error-msg">{fieldErrors.totalReviews}</span>}
              </div>
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '1rem',
              marginTop: '1.75rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-outline"
                disabled={submitting}
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn btn-gold"
                disabled={submitting}
              >
                {submitting ? 'Persisting to MySQL...' : <><PlusCircle size={16} /> Save Movie to MySQL</>}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default AddMoviePage;
