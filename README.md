# CineRate — Smart Movie Review & Personalized Recommendation Platform

> **Visual Theme:** CineRate Afterdark (Cinematic Editorial)
> **Frontend Architecture:** React 18 + Vite + React Router + Axios + Lucide Icons
> **Backend Integration:** Java Spring Boot (Spring Tool Suite / STS) + Spring Data JPA + MySQL (`cinerate`)

---

## 1. Project Overview

**CineRate** is an independent cinematic editorial and personal recommendation concierge. It allows film enthusiasts to:
- Browse live trending, popular, top-rated, now-playing, upcoming, and genre-based movies from TMDB through the Spring Boot proxy.
- Search titles, open TMDB movie details, and view posters, backdrops, cast, and trailers where available.
- Filter films by genre, language, release year, and community score.
- Keep CineRate accounts, reviews, and watchlists in the existing Spring Boot and MySQL backend.
- Receive recommendations based on saved watchlist genres and CineRate review ratings, with movie candidates supplied by TMDB.

---

## 2. Directory Structure

```text
cinerate-frontend/
├── .env                     # API Base URL (http://localhost:8080/api)
├── .env.example             # Template without credentials
├── index.html               # HTML entry with Google Fonts (Cinzel, Playfair Display, Inter)
├── package.json             # React 18, Vite, React Router, Axios, Lucide React
├── vite.config.js           # Vite dev server configuration
├── README.md                # Documentation and setup guide
└── src/
    ├── main.jsx             # React DOM root entry
    ├── App.jsx              # Main router and layout shell
    ├── index.css            # CineRate Afterdark visual design system
    ├── services/
    │   └── api.js           # Centralized Axios client & Spring Boot API calls
    ├── components/
    │   ├── Navbar.jsx       # Editorial top navigation & quick search
    │   ├── Footer.jsx       # Architectural summary & links
    │   ├── MovieCard.jsx    # Movie poster card with hover transitions
    │   ├── PosterImage.jsx  # Graceful placeholder for missing/broken artwork
    │   ├── RatingStars.jsx  # Champagne-gold rating stars and badge
    │   ├── LoadingSpinner.jsx # Cinema loading spinner
    │   ├── ErrorAlert.jsx   # Compact service errors with retry
    │   └── EmptyState.jsx   # Friendly empty database prompt
    └── pages/
        ├── HomePage.jsx     # TMDB hero, movie shelves, search, Find My Film teaser
        ├── ExplorePage.jsx  # TMDB title search, dynamic discovery filters
        ├── MovieDetailsPage.jsx # TMDB synopsis, cast, trailer, and CineRate reviews
        ├── FindMyFilmPage.jsx   # Signature recommendation assistant & explanations
        ├── AddMoviePage.jsx # Form to test POST /api/movies directly into MySQL
        ├── AboutPage.jsx    # Platform purpose & architecture explanation
        └── NotFoundPage.jsx # 404 handler
```

---

## 3. Quick Start (Windows & Command Line)

### Step 1: Open PowerShell or Command Prompt
Navigate to the frontend directory:
```powershell
cd c:\Temp\sts-5.2.0.RELEASE\cinerate-frontend
```

### Step 2: Install Node.js Dependencies
```powershell
npm install
```

### Step 3: Start the Vite Development Server
```powershell
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### Step 4: Verify Production Build
To verify clean compilation without errors:
```powershell
npm run build
```

---

## 4. Starting the Spring Boot Backend in STS

This frontend workspace contains a `backend-src` source snapshot but does not contain a Maven/Gradle project file or wrapper. Run the full Spring Boot project from its existing backend project in Spring Tool Suite (STS); do not try to launch the Java source snapshot as a standalone application.

1. Start the existing MySQL service and verify the `cinerate` database and credentials configured by your Spring Boot project.
2. Set `TMDB_API_READ_ACCESS_TOKEN` in the Spring Boot runtime environment. In STS, open **Run Configurations → Spring Boot App → Environment**, add that variable, and save. Do not put the TMDB token in the React `.env` file or commit it to source control.
3. In STS, run the existing CineRate backend using **Run As → Spring Boot App**. The frontend calls `http://localhost:8080/api` by default.
4. Alternatively, start the backend from PowerShell with a token prompt:

   ```powershell
   cd C:\Users\malli\Documents\workspace-spring-tools-for-eclipse-5.2.0.RELEASE\cinerate
   $secureToken = Read-Host -Prompt 'TMDB API Read Access Token' -AsSecureString
   $env:TMDB_API_READ_ACCESS_TOKEN = [System.Net.NetworkCredential]::new('CineRate', $secureToken).Password
   Remove-Variable secureToken
   .\mvnw.cmd spring-boot:run
   ```

   The environment variable applies only to that PowerShell window. To compile without starting the backend, use `.\mvnw.cmd compile`.

5. Start the frontend separately in another PowerShell terminal:

   ```powershell
   cd C:\Temp\sts-5.2.0.RELEASE\cinerate-frontend
   npm run dev
   ```

   Open `http://localhost:5173`.

The browser never receives the TMDB credential. Movie requests go through the Spring Boot `/api/tmdb/**` proxy. CineRate accounts, reviews, and watchlists continue to use the backend and MySQL.

---

## 5. Connecting with Spring Boot in Spring Tool Suite (STS)

Your Spring Boot project proxies official TMDB API calls and continues serving CineRate user data:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tmdb/trending`, `/popular`, `/top-rated`, `/now-playing`, `/upcoming` | Live TMDB movie lists |
| `GET` | `/api/tmdb/genres`, `/discover`, `/search?query={title}` | Genres, filtered discovery, and search |
| `GET` | `/api/tmdb/movie/{id}` | Movie details, credits, images, videos, and similar movies |
| `GET` | `/api/tmdb/status` | Reports whether a token is configured; does not validate it |
| `GET`, `POST` | `/api/reviews/movie/{tmdbId}`, `/api/reviews` | Reads and saves CineRate reviews in MySQL |
| `GET`, `POST`, `DELETE` | `/api/watchlist` | Reads and changes the CineRate watchlist in MySQL |

---

## 6. End-to-End Verification Checklist

1. **Start both services:** Start MySQL and Spring Boot with `TMDB_API_READ_ACCESS_TOKEN` set, then run the Vite frontend.
2. **Verify TMDB configuration:** Open `http://localhost:8080/api/tmdb/status`. `configured: true` means a value was provided, not that TMDB accepted it.
3. **Verify live TMDB data:** Open `http://localhost:8080/api/tmdb/trending?timeWindow=week&page=1`. A successful JSON response contains a `results` array; HTTP 401 means the backend token was rejected.
4. **Test the UI:** Use Home for trending and genre shelves, Discover for search and filters, and a movie page for TMDB details plus CineRate reviews.
5. **Test saved features:** Sign in, save a movie to Watchlist, add a review, and reload each page to verify the changes persisted.
6. **Recover from a TMDB outage:** The CineRate homepage, navigation, search, and retry controls remain visible; no sample movies are substituted for live results.
