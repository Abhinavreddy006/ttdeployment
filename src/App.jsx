import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import WatchlistPage from './pages/WatchlistPage';
import FindMyFilmPage from './pages/FindMyFilmPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import AuthPage from './pages/AuthPage';
import AddMoviePage from './pages/AddMoviePage';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/movies/:id" element={<MovieDetailsPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/recommendations" element={<FindMyFilmPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/add-movie" element={<AddMoviePage />} />
          <Route path="/sign-in" element={<AuthPage mode="login" />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/create-account" element={<AuthPage mode="register" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
