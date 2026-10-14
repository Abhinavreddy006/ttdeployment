/**
 * Offline & Fallback Mock Data Engine for CineRate
 * Provides complete data resilience so the website works smoothly
 * even if the Spring Boot server or TMDB API is offline or unconfigured.
 */

export const DEFAULT_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

export const INITIAL_CATALOG = [
  {
    id: 12445,
    tmdbId: 12445,
    title: 'Spider-Man: Brand New Day',
    overview: "Fighting crime full-time as Spider-Man in a world that doesn't remember him—and the pressure of seeing his old friends move on without him—sparks a change in Peter Parker he may not have the power to control. But that transformation brings threats and choices that test the very definition of a hero.",
    description: "Fighting crime full-time as Spider-Man in a world that doesn't remember him—and the pressure of seeing his old friends move on without him—sparks a change in Peter Parker he may not have the power to control. But that transformation brings threats and choices that test the very definition of a hero.",
    genre: 'Action, Sci-Fi, Adventure',
    genre_ids: [28, 878, 12],
    language: 'English',
    releaseYear: 2026,
    release_date: '2026-07-24',
    director: 'Destin Daniel Cretton',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
    vote_average: 8.4,
    averageRating: 8.4,
    vote_count: 4709,
    totalReviews: 4709,
    trailerKey: 'JfVOs4VSpmA',
    cast: [
      { name: 'Tom Holland', character: 'Peter Parker / Spider-Man' },
      { name: 'Zendaya', character: 'MJ Watson' },
      { name: 'Jacob Batalon', character: 'Ned Leeds' },
      { name: 'Benedict Cumberbatch', character: 'Doctor Strange' }
    ]
  },
  {
    id: 27205,
    tmdbId: 27205,
    title: 'Inception',
    overview: "Cobb steals information from his targets by entering their dreams. He is offered a chance to have his criminal history erased as payment for the implantation of another person's idea into a target's subconscious.",
    description: "Cobb steals information from his targets by entering their dreams. He is offered a chance to have his criminal history erased as payment for the implantation of another person's idea into a target's subconscious.",
    genre: 'Action, Sci-Fi, Adventure',
    genre_ids: [28, 878, 12],
    language: 'English',
    releaseYear: 2010,
    release_date: '2010-07-16',
    director: 'Christopher Nolan',
    posterUrl: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    vote_average: 8.8,
    averageRating: 8.8,
    vote_count: 3200,
    totalReviews: 3200,
    trailerKey: 'YoHD9XEInc0',
    cast: [
      { name: 'Leonardo DiCaprio', character: 'Dom Cobb' },
      { name: 'Joseph Gordon-Levitt', character: 'Arthur' },
      { name: 'Elliot Page', character: 'Ariadne' },
      { name: 'Tom Hardy', character: 'Eames' }
    ]
  },
  {
    id: 157336,
    tmdbId: 157336,
    title: 'Interstellar',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    description: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    genre: 'Adventure, Drama, Sci-Fi',
    genre_ids: [12, 18, 878],
    language: 'English',
    releaseYear: 2014,
    release_date: '2014-11-07',
    director: 'Christopher Nolan',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/rAiYTsqzbmuQ0zFuVaJwEDAVRY.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/rAiYTsqzbmuQ0zFuVaJwEDAVRY.jpg',
    vote_average: 8.7,
    averageRating: 8.7,
    vote_count: 2900,
    totalReviews: 2900,
    trailerKey: 'zSWdZVtXT7E',
    cast: [
      { name: 'Matthew McConaughey', character: 'Cooper' },
      { name: 'Anne Hathaway', character: 'Brand' },
      { name: 'Jessica Chastain', character: 'Murph' }
    ]
  },
  {
    id: 155,
    tmdbId: 155,
    title: 'The Dark Knight',
    overview: 'Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent, but finds himself facing the chaotic menace of the Joker.',
    description: 'Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent, but finds himself facing the chaotic menace of the Joker.',
    genre: 'Action, Crime, Drama',
    genre_ids: [28, 80, 18],
    language: 'English',
    releaseYear: 2008,
    release_date: '2008-07-18',
    director: 'Christopher Nolan',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    vote_average: 9.0,
    averageRating: 9.0,
    vote_count: 3100,
    totalReviews: 3100,
    trailerKey: 'EXeTwQWrcwY',
    cast: [
      { name: 'Christian Bale', character: 'Bruce Wayne / Batman' },
      { name: 'Heath Ledger', character: 'Joker' },
      { name: 'Aaron Eckhart', character: 'Harvey Dent' }
    ]
  },
  {
    id: 872585,
    tmdbId: 872585,
    title: 'Oppenheimer',
    overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    genre: 'Biography, Drama, History',
    genre_ids: [18, 36],
    language: 'English',
    releaseYear: 2023,
    release_date: '2023-07-21',
    director: 'Christopher Nolan',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/fm6K9vY9wgjBYhaYsS2fON39IXn.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/fm6K9vY9wgjBYhaYsS2fON39IXn.jpg',
    vote_average: 8.6,
    averageRating: 8.6,
    vote_count: 2400,
    totalReviews: 2400,
    trailerKey: 'uYPbbksJxIg',
    cast: [
      { name: 'Cillian Murphy', character: 'J. Robert Oppenheimer' },
      { name: 'Emily Blunt', character: 'Katherine Oppenheimer' },
      { name: 'Matt Damon', character: 'Leslie Groves' },
      { name: 'Robert Downey Jr.', character: 'Lewis Strauss' }
    ]
  },
  {
    id: 693134,
    tmdbId: 693134,
    title: 'Dune: Part Two',
    overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.',
    description: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.',
    genre: 'Action, Adventure, Sci-Fi',
    genre_ids: [28, 12, 878],
    language: 'English',
    releaseYear: 2024,
    release_date: '2024-03-01',
    director: 'Denis Villeneuve',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s520b4q.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s520b4q.jpg',
    vote_average: 8.5,
    averageRating: 8.5,
    vote_count: 2100,
    totalReviews: 2100,
    trailerKey: 'Way9Dexny3w',
    cast: [
      { name: 'Timothée Chalamet', character: 'Paul Atreides' },
      { name: 'Zendaya', character: 'Chani' },
      { name: 'Rebecca Ferguson', character: 'Lady Jessica' }
    ]
  },
  {
    id: 238,
    tmdbId: 238,
    title: 'The Godfather',
    overview: 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch Vito Corleone barely survives an attempt on his life, his youngest son steps in.',
    description: 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch Vito Corleone barely survives an attempt on his life, his youngest son steps in.',
    genre: 'Crime, Drama',
    genre_ids: [80, 18],
    language: 'English',
    releaseYear: 1972,
    release_date: '1972-03-24',
    director: 'Francis Ford Coppola',
    posterUrl: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    vote_average: 9.2,
    averageRating: 9.2,
    vote_count: 3500,
    totalReviews: 3500,
    trailerKey: 'sY1S34973zA',
    cast: [
      { name: 'Marlon Brando', character: 'Don Vito Corleone' },
      { name: 'Al Pacino', character: 'Michael Corleone' },
      { name: 'James Caan', character: 'Sonny Corleone' }
    ]
  },
  {
    id: 680,
    tmdbId: 680,
    title: 'Pulp Fiction',
    overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
    description: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
    genre: 'Crime, Drama',
    genre_ids: [80, 18],
    language: 'English',
    releaseYear: 1994,
    release_date: '1994-10-14',
    director: 'Quentin Tarantino',
    posterUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    vote_average: 8.9,
    averageRating: 8.9,
    vote_count: 2700,
    totalReviews: 2700,
    trailerKey: 's7EdQ4FqbhY',
    cast: [
      { name: 'John Travolta', character: 'Vincent Vega' },
      { name: 'Samuel L. Jackson', character: 'Jules Winnfield' },
      { name: 'Uma Thurman', character: 'Mia Wallace' }
    ]
  },
  {
    id: 278,
    tmdbId: 278,
    title: 'The Shawshank Redemption',
    overview: 'Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.',
    description: 'Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.',
    genre: 'Drama, Crime',
    genre_ids: [18, 80],
    language: 'English',
    releaseYear: 1994,
    release_date: '1994-09-23',
    director: 'Frank Darabont',
    posterUrl: 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    vote_average: 9.3,
    averageRating: 9.3,
    vote_count: 3800,
    totalReviews: 3800,
    trailerKey: 'PLl99DlL6b4',
    cast: [
      { name: 'Tim Robbins', character: 'Andy Dufresne' },
      { name: 'Morgan Freeman', character: 'Ellis Boyd "Red" Redding' }
    ]
  },
  {
    id: 496243,
    tmdbId: 496243,
    title: 'Parasite',
    overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    description: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    genre: 'Comedy, Drama, Thriller',
    genre_ids: [35, 18, 53],
    language: 'Korean',
    releaseYear: 2019,
    release_date: '2019-05-30',
    director: 'Bong Joon-ho',
    posterUrl: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg',
    vote_average: 8.5,
    averageRating: 8.5,
    vote_count: 2300,
    totalReviews: 2300,
    trailerKey: '5xH0hhMBqge',
    cast: [
      { name: 'Song Kang-ho', character: 'Kim Ki-taek' },
      { name: 'Lee Sun-kyun', character: 'Park Dong-ik' },
      { name: 'Cho Yeo-jeong', character: 'Choi Yeon-gyo' }
    ]
  },
  {
    id: 129,
    tmdbId: 129,
    title: 'Spirited Away',
    overview: 'A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.',
    description: 'A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.',
    genre: 'Animation, Family, Fantasy',
    genre_ids: [16, 10751, 14],
    language: 'Japanese',
    releaseYear: 2001,
    release_date: '2001-07-20',
    director: 'Hayao Miyazaki',
    posterUrl: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/mSDsSDwaP3E7dEfUPWy4J0djt4O.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/mSDsSDwaP3E7dEfUPWy4J0djt4O.jpg',
    vote_average: 8.6,
    averageRating: 8.6,
    vote_count: 2100,
    totalReviews: 2100,
    trailerKey: 'ByXuk9QqQkk',
    cast: [
      { name: 'Rumi Hiiragi', character: 'Chihiro Ogino (voice)' },
      { name: 'Miyu Irino', character: 'Haku (voice)' }
    ]
  },
  {
    id: 244786,
    tmdbId: 244786,
    title: 'Whiplash',
    overview: 'Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, pushing his physical and mental limits.',
    description: 'Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, pushing his physical and mental limits.',
    genre: 'Drama, Music',
    genre_ids: [18, 10402],
    language: 'English',
    releaseYear: 2014,
    release_date: '2014-10-10',
    director: 'Damien Chazelle',
    posterUrl: 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/vNXGrknW6F1i7848fP8O9Q4s1M.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/vNXGrknW6F1i7848fP8O9Q4s1M.jpg',
    vote_average: 8.5,
    averageRating: 8.5,
    vote_count: 1950,
    totalReviews: 1950,
    trailerKey: '7d_jQycdQGo',
    cast: [
      { name: 'Miles Teller', character: 'Andrew Neiman' },
      { name: 'J.K. Simmons', character: 'Terence Fletcher' }
    ]
  },
  {
    id: 313369,
    tmdbId: 313369,
    title: 'La La Land',
    overview: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.',
    description: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.',
    genre: 'Comedy, Drama, Romance, Music',
    genre_ids: [35, 18, 10749, 10402],
    language: 'English',
    releaseYear: 2016,
    release_date: '2016-12-09',
    director: 'Damien Chazelle',
    posterUrl: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/nlPCdZlHtRNcF6C9hzUH4ebmV1w.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/nlPCdZlHtRNcF6C9hzUH4ebmV1w.jpg',
    vote_average: 8.0,
    averageRating: 8.0,
    vote_count: 1800,
    totalReviews: 1800,
    trailerKey: '0pdqf4P9MB8',
    cast: [
      { name: 'Ryan Gosling', character: 'Sebastian Wilder' },
      { name: 'Emma Stone', character: 'Mia Dolan' }
    ]
  },
  {
    id: 579974,
    tmdbId: 579974,
    title: 'RRR',
    overview: "A fictional history of two legendary revolutionaries' journey away from home before they began fighting for their country in the 1920s.",
    description: "A fictional history of two legendary revolutionaries' journey away from home before they began fighting for their country in the 1920s.",
    genre: 'Action, Drama',
    genre_ids: [28, 18],
    language: 'Telugu',
    releaseYear: 2022,
    release_date: '2022-03-24',
    director: 'S.S. Rajamouli',
    posterUrl: 'https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/zGLHX92Gk96O1APvCr7NTzr94L4.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/zGLHX92Gk96O1APvCr7NTzr94L4.jpg',
    vote_average: 8.0,
    averageRating: 8.0,
    vote_count: 1400,
    totalReviews: 1400,
    trailerKey: 'GY4BgdUSpbE',
    cast: [
      { name: 'N.T. Rama Rao Jr.', character: 'Komaram Bheem' },
      { name: 'Ram Charan', character: 'Alluri Sitarama Raju' }
    ]
  },
  {
    id: 545611,
    tmdbId: 545611,
    title: 'Everything Everywhere All at Once',
    overview: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what's important to her by connecting with the lives she could have led in other universes.",
    description: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what's important to her by connecting with the lives she could have led in other universes.",
    genre: 'Action, Adventure, Sci-Fi',
    genre_ids: [28, 12, 878],
    language: 'English',
    releaseYear: 2022,
    release_date: '2022-03-25',
    director: 'Daniel Kwan, Daniel Scheinert',
    posterUrl: 'https://image.tmdb.org/t/p/w500/u68AjlvlutfEIcpmbYpKcdi09ut.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/u68AjlvlutfEIcpmbYpKcdi09ut.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/fIwiFha3WPu5nHkBeMQ4GzEk0Hv.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/fIwiFha3WPu5nHkBeMQ4GzEk0Hv.jpg',
    vote_average: 8.1,
    averageRating: 8.1,
    vote_count: 1600,
    totalReviews: 1600,
    trailerKey: 'wxN1T1uxQ2g',
    cast: [
      { name: 'Michelle Yeoh', character: 'Evelyn Wang' },
      { name: 'Ke Huy Quan', character: 'Waymond Wang' },
      { name: 'Stephanie Hsu', character: 'Joy Wang' }
    ]
  },
  {
    id: 569094,
    tmdbId: 569094,
    title: 'Spider-Man: Across the Spider-Verse',
    overview: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    genre: 'Animation, Action, Adventure, Sci-Fi',
    genre_ids: [16, 28, 12, 878],
    language: 'English',
    releaseYear: 2023,
    release_date: '2023-06-02',
    director: 'Joaquim Dos Santos, Kemp Powers',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    vote_average: 8.7,
    averageRating: 8.7,
    vote_count: 2500,
    totalReviews: 2500,
    trailerKey: 'cqGjhVJWtEg',
    cast: [
      { name: 'Shameik Moore', character: 'Miles Morales (voice)' },
      { name: 'Hailee Steinfeld', character: 'Gwen Stacy (voice)' },
      { name: 'Oscar Isaac', character: 'Miguel O\'Hara (voice)' }
    ]
  },
  {
    id: 550,
    tmdbId: 550,
    title: 'Fight Club',
    overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
    description: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
    genre: 'Drama',
    genre_ids: [18],
    language: 'English',
    releaseYear: 1999,
    release_date: '1999-10-15',
    director: 'David Fincher',
    posterUrl: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    vote_average: 8.8,
    averageRating: 8.8,
    vote_count: 2900,
    totalReviews: 2900,
    trailerKey: 'qtRKdVHc6nM',
    cast: [
      { name: 'Edward Norton', character: 'The Narrator' },
      { name: 'Brad Pitt', character: 'Tyler Durden' },
      { name: 'Helena Bonham Carter', character: 'Marla Singer' }
    ]
  },
  {
    id: 98,
    tmdbId: 98,
    title: 'Gladiator',
    overview: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
    description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
    genre: 'Action, Adventure, Drama',
    genre_ids: [28, 12, 18],
    language: 'English',
    releaseYear: 2000,
    release_date: '2000-05-05',
    director: 'Ridley Scott',
    posterUrl: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/Ar7kP2yR5H7PZ9L15P7eM8w1X0.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/Ar7kP2yR5H7PZ9L15P7eM8w1X0.jpg',
    vote_average: 8.5,
    averageRating: 8.5,
    vote_count: 2150,
    totalReviews: 2150,
    trailerKey: 'owK1qxAo36k',
    cast: [
      { name: 'Russell Crowe', character: 'Maximus' },
      { name: 'Joaquin Phoenix', character: 'Commodus' },
      { name: 'Connie Nielsen', character: 'Lucilla' }
    ]
  },
  {
    id: 603,
    tmdbId: 603,
    title: 'The Matrix',
    overview: 'Set in the 22nd century, a computer hacker joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.',
    description: 'Set in the 22nd century, a computer hacker joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.',
    genre: 'Action, Sci-Fi',
    genre_ids: [28, 878],
    language: 'English',
    releaseYear: 1999,
    release_date: '1999-03-31',
    director: 'Lana Wachowski, Lilly Wachowski',
    posterUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/ncEHGiyMRGH9VOGBoDcRU1Sp48o.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/ncEHGiyMRGH9VOGBoDcRU1Sp48o.jpg',
    vote_average: 8.7,
    averageRating: 8.7,
    vote_count: 2850,
    totalReviews: 2850,
    trailerKey: 'vKQi3bBA1y8',
    cast: [
      { name: 'Keanu Reeves', character: 'Neo' },
      { name: 'Laurence Fishburne', character: 'Morpheus' },
      { name: 'Carrie-Anne Moss', character: 'Trinity' }
    ]
  },
  {
    id: 299534,
    tmdbId: 299534,
    title: 'Avengers: Endgame',
    overview: 'After the devastating events of Infinity War, the remaining Avengers assemble once more in order to reverse Thanos\' actions.',
    description: 'After the devastating events of Infinity War, the remaining Avengers assemble once more in order to reverse Thanos\' actions.',
    genre: 'Adventure, Sci-Fi, Action',
    genre_ids: [12, 878, 28],
    language: 'English',
    releaseYear: 2019,
    release_date: '2019-04-26',
    director: 'Anthony Russo, Joe Russo',
    posterUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    vote_average: 8.3,
    averageRating: 8.3,
    vote_count: 2600,
    totalReviews: 2600,
    trailerKey: 'TcMBFSGVi1c',
    cast: [
      { name: 'Robert Downey Jr.', character: 'Tony Stark / Iron Man' },
      { name: 'Chris Evans', character: 'Steve Rogers / Captain America' },
      { name: 'Mark Ruffalo', character: 'Bruce Banner / Hulk' }
    ]
  },
  {
    id: 354912,
    tmdbId: 354912,
    title: 'Coco',
    overview: 'Despite his family\'s generations-old ban on music, Miguel dreams of becoming an accomplished musician like his idol, Ernesto de la Cruz.',
    description: 'Despite his family\'s generations-old ban on music, Miguel dreams of becoming an accomplished musician like his idol, Ernesto de la Cruz.',
    genre: 'Animation, Family, Fantasy, Music',
    genre_ids: [16, 10751, 14, 10402],
    language: 'Spanish',
    releaseYear: 2017,
    release_date: '2017-10-27',
    director: 'Lee Unkrich',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/askg3SMvhqEl4OL52YuvdtQw40Y.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/askg3SMvhqEl4OL52YuvdtQw40Y.jpg',
    vote_average: 8.4,
    averageRating: 8.4,
    vote_count: 1800,
    totalReviews: 1800,
    trailerKey: 'Rvr68u6k5sI',
    cast: [
      { name: 'Anthony Gonzalez', character: 'Miguel (voice)' },
      { name: 'Gael García Bernal', character: 'Héctor (voice)' }
    ]
  },
  {
    id: 769,
    tmdbId: 769,
    title: 'GoodFellas',
    overview: 'The story of Henry Hill and his life in the mafia, covering his relationship with his mob partners Jimmy Conway and Tommy DeVito.',
    description: 'The story of Henry Hill and his life in the mafia, covering his relationship with his mob partners Jimmy Conway and Tommy DeVito.',
    genre: 'Drama, Crime',
    genre_ids: [18, 80],
    language: 'English',
    releaseYear: 1990,
    release_date: '1990-09-12',
    director: 'Martin Scorsese',
    posterUrl: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/sw7mordbZxgITU877yTpZCud90M.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/sw7mordbZxgITU877yTpZCud90M.jpg',
    vote_average: 8.7,
    averageRating: 8.7,
    vote_count: 1750,
    totalReviews: 1750,
    trailerKey: '2ilzidi_J8Q',
    cast: [
      { name: 'Robert De Niro', character: 'James Conway' },
      { name: 'Ray Liotta', character: 'Henry Hill' },
      { name: 'Joe Pesci', character: 'Tommy DeVito' }
    ]
  },
  {
    id: 807,
    tmdbId: 807,
    title: 'Seven',
    overview: 'Two homicide detectives are on a desperate hunt for a serial killer whose crimes are based on the seven deadly sins.',
    description: 'Two homicide detectives are on a desperate hunt for a serial killer whose crimes are based on the seven deadly sins.',
    genre: 'Crime, Mystery, Thriller',
    genre_ids: [80, 9648, 53],
    language: 'English',
    releaseYear: 1995,
    release_date: '1995-09-22',
    director: 'David Fincher',
    posterUrl: 'https://image.tmdb.org/t/p/w500/69Sns8WoET6CfaYlIkHbla4l7nC.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/69Sns8WoET6CfaYlIkHbla4l7nC.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/ba4CpLnvv1vrzSQb7XYT9pmD82l.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/ba4CpLnvv1vrzSQb7XYT9pmD82l.jpg',
    vote_average: 8.6,
    averageRating: 8.6,
    vote_count: 1920,
    totalReviews: 1920,
    trailerKey: 'znmZoVkCjpI',
    cast: [
      { name: 'Brad Pitt', character: 'Detective David Mills' },
      { name: 'Morgan Freeman', character: 'Detective Lt. William Somerset' }
    ]
  },
  {
    id: 120,
    tmdbId: 120,
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    overview: 'Young hobbit Frodo Baggins must leave his home in order to destroy a mysterious ring before it falls into the hands of the Dark Lord Sauron.',
    description: 'Young hobbit Frodo Baggins must leave his home in order to destroy a mysterious ring before it falls into the hands of the Dark Lord Sauron.',
    genre: 'Adventure, Fantasy, Action',
    genre_ids: [12, 14, 28],
    language: 'English',
    releaseYear: 2001,
    release_date: '2001-12-19',
    director: 'Peter Jackson',
    posterUrl: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/9DeGfFIqjph5CBcuF3hg2rV9M1w.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/9DeGfFIqjph5CBcuF3hg2rV9M1w.jpg',
    vote_average: 8.9,
    averageRating: 8.9,
    vote_count: 3400,
    totalReviews: 3400,
    trailerKey: 'V75dMMIW2B4',
    cast: [
      { name: 'Elijah Wood', character: 'Frodo Baggins' },
      { name: 'Ian McKellen', character: 'Gandalf' },
      { name: 'Viggo Mortensen', character: 'Aragorn' }
    ]
  },
  {
    id: 372058,
    tmdbId: 372058,
    title: 'Your Name.',
    overview: 'High schoolers Mitsuha and Taki are complete strangers living separate lives, until they suddenly begin swapping bodies.',
    description: 'High schoolers Mitsuha and Taki are complete strangers living separate lives, until they suddenly begin swapping bodies.',
    genre: 'Animation, Romance, Drama',
    genre_ids: [16, 10749, 18],
    language: 'Japanese',
    releaseYear: 2016,
    release_date: '2016-08-26',
    director: 'Makoto Shinkai',
    posterUrl: 'https://image.tmdb.org/t/p/w500/vfJFJPepRKapMd5G2ro7klIRysq.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/vfJFJPepRKapMd5G2ro7klIRysq.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/dIWwZW7dJJ1q48oQWumbkNOYsRt.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/dIWwZW7dJJ1q48oQWumbkNOYsRt.jpg',
    vote_average: 8.8,
    averageRating: 8.8,
    vote_count: 1650,
    totalReviews: 1650,
    trailerKey: 'xU47nhruN-Q',
    cast: [
      { name: 'Ryunosuke Kamiki', character: 'Taki Tachibana (voice)' },
      { name: 'Mone Kamishiraishi', character: 'Mitsuha Miyamizu (voice)' }
    ]
  },
  {
    id: 274,
    tmdbId: 274,
    title: 'The Silence of the Lambs',
    overview: 'Clarice Starling must interview Dr. Hannibal Lecter, a brilliant psychiatrist who is also a violent psychopath, to catch a serial killer.',
    description: 'Clarice Starling must interview Dr. Hannibal Lecter, a brilliant psychiatrist who is also a violent psychopath, to catch a serial killer.',
    genre: 'Crime, Drama, Thriller',
    genre_ids: [80, 18, 53],
    language: 'English',
    releaseYear: 1991,
    release_date: '1991-02-14',
    director: 'Jonathan Demme',
    posterUrl: 'https://image.tmdb.org/t/p/w500/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/mfwq2nMBzArzQ7Y9R5KN0j5gL9n.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/mfwq2nMBzArzQ7Y9R5KN0j5gL9n.jpg',
    vote_average: 8.6,
    averageRating: 8.6,
    vote_count: 2100,
    totalReviews: 2100,
    trailerKey: 'W6Mm8Sbe__o',
    cast: [
      { name: 'Jodie Foster', character: 'Clarice Starling' },
      { name: 'Anthony Hopkins', character: 'Dr. Hannibal Lecter' }
    ]
  },
  {
    id: 335984,
    tmdbId: 335984,
    title: 'Blade Runner 2049',
    overview: 'Thirty years after the events of the first film, a new blade runner unearths a long-buried secret that has the potential to plunge society into chaos.',
    description: 'Thirty years after the events of the first film, a new blade runner unearths a long-buried secret that has the potential to plunge society into chaos.',
    genre: 'Sci-Fi, Drama, Mystery',
    genre_ids: [878, 18, 9648],
    language: 'English',
    releaseYear: 2017,
    release_date: '2017-10-06',
    director: 'Denis Villeneuve',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/ilRyASDvt7v5o06v74bF359Qn8b.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/ilRyASDvt7v5o06v74bF359Qn8b.jpg',
    vote_average: 8.5,
    averageRating: 8.5,
    vote_count: 1800,
    totalReviews: 1800,
    trailerKey: 'gCcx85zbxz4',
    cast: [
      { name: 'Ryan Gosling', character: 'K' },
      { name: 'Harrison Ford', character: 'Rick Deckard' },
      { name: 'Ana de Armas', character: 'Joi' }
    ]
  },
  {
    id: 49018,
    tmdbId: 49018,
    title: 'Insidious',
    overview: 'A family discovers that dark spirits have invaded their home after their son inexplicably falls into an endless sleep. When they reach out to a professional for help, they learn things are a lot more personal than they thought.',
    description: 'A family discovers that dark spirits have invaded their home after their son inexplicably falls into an endless sleep. When they reach out to a professional for help, they learn things are a lot more personal than they thought.',
    genre: 'Horror, Mystery, Thriller',
    genre_ids: [27, 9648, 53],
    language: 'English',
    releaseYear: 2010,
    release_date: '2010-09-14',
    director: 'James Wan',
    posterUrl: 'https://image.tmdb.org/t/p/w500/tmlDFIUpGRKiuWm9Ixc6CYDk4y0.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/tmlDFIUpGRKiuWm9Ixc6CYDk4y0.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/aXOUc4dkzp9wmJG5lC2iAE6VUdt.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/aXOUc4dkzp9wmJG5lC2iAE6VUdt.jpg',
    vote_average: 7.0,
    averageRating: 7.0,
    vote_count: 1600,
    totalReviews: 1600,
    trailerKey: 'zuZnRUcoW22',
    cast: [
      { name: 'Patrick Wilson', character: 'Josh Lambert' },
      { name: 'Rose Byrne', character: 'Renai Lambert' }
    ]
  },
  {
    id: 1184918,
    tmdbId: 1184918,
    title: 'The Wild Robot',
    overview: 'After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island and must learn to adapt to the harsh surroundings, gradually building relationships with the local animals and becoming the adoptive parent of an orphaned gosling.',
    description: 'After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island and must learn to adapt to the harsh surroundings, gradually building relationships with the local animals and becoming the adoptive parent of an orphaned gosling.',
    genre: 'Animation, Sci-Fi, Family',
    genre_ids: [16, 878, 10751],
    language: 'English',
    releaseYear: 2024,
    release_date: '2024-09-27',
    director: 'Chris Sanders',
    posterUrl: 'https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/eG9lz41mJqsI4J6ubMtVqD26q2J.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/eG9lz41mJqsI4J6ubMtVqD26q2J.jpg',
    vote_average: 8.5,
    averageRating: 8.5,
    vote_count: 2200,
    totalReviews: 2200,
    trailerKey: '67vbA5ZJb3s',
    cast: [
      { name: 'Lupita Nyong\'o', character: 'Roz (voice)' },
      { name: 'Pedro Pascal', character: 'Fink (voice)' },
      { name: 'Kit Connor', character: 'Brightbill (voice)' }
    ]
  },
  {
    id: 533535,
    tmdbId: 533535,
    title: 'Deadpool & Wolverine',
    overview: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.',
    description: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.',
    genre: 'Action, Comedy, Sci-Fi',
    genre_ids: [28, 35, 878],
    language: 'English',
    releaseYear: 2024,
    release_date: '2024-07-26',
    director: 'Shawn Levy',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    poster_path: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    vote_average: 7.7,
    averageRating: 7.7,
    vote_count: 3600,
    totalReviews: 3600,
    trailerKey: '73_1biulkYk',
    cast: [
      { name: 'Ryan Reynolds', character: 'Wade Wilson / Deadpool' },
      { name: 'Hugh Jackman', character: 'Logan / Wolverine' },
      { name: 'Emma Corrin', character: 'Cassandra Nova' }
    ]
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 1,
    tmdbId: 12445,
    author: 'CineCritic99',
    rating: 9,
    content: 'An incredible emotional turnaround for Peter Parker! The stakes are intimate yet universe-altering.',
    reviewDate: '2026-08-01'
  },
  {
    id: 2,
    tmdbId: 12445,
    author: 'WebSlingerFan',
    rating: 8.5,
    content: 'Destin Daniel Cretton brings grounded martial arts choreography and deep comic-book heart.',
    reviewDate: '2026-08-05'
  },
  {
    id: 3,
    tmdbId: 27205,
    author: 'DreamWeaver',
    rating: 9.5,
    content: 'One of the greatest cinematic achievements of the 21st century. Flawless direction and Zimmer score.',
    reviewDate: '2024-05-12'
  },
  {
    id: 4,
    tmdbId: 157336,
    author: 'AstroFilm',
    rating: 9.0,
    content: 'A soaring masterpiece that marries theoretical physics with the raw gravity of love.',
    reviewDate: '2024-06-18'
  },
  {
    id: 5,
    tmdbId: 155,
    author: 'GothamWatch',
    rating: 10,
    content: 'Heath Ledger redefined the cinematic villain forever. Nolan at his finest.',
    reviewDate: '2024-07-01'
  }
];

// Helper to normalize strings for search and deduplication
export const normalizeText = (text) => {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
};

// Local storage management helpers
const STORAGE_KEYS = {
  WATCHLIST: 'cinerate_watchlist',
  REVIEWS: 'cinerate_reviews',
  CUSTOM_MOVIES: 'cinerate_custom_movies',
  USER: 'cinerate_current_user'
};

const getStoredJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const setStoredJson = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Could not save to localStorage key "${key}":`, err);
  }
};

/**
 * Combined catalog: seed movies + custom movies added by the user
 */
export const getOfflineCatalog = () => {
  const custom = getStoredJson(STORAGE_KEYS.CUSTOM_MOVIES, []);
  // Ensure custom movies don't collide with seed ids
  return [...INITIAL_CATALOG, ...custom];
};

/**
 * Filter catalog by genre, language, year, and search
 */
export const queryOfflineMovies = ({
  search = '',
  genre = '',
  language = '',
  year,
  sortBy = 'popularity.desc',
  page = 1,
  pageSize = 20
}) => {
  let movies = [...getOfflineCatalog()];

  // Search filter
  const cleanSearch = normalizeText(search);
  if (cleanSearch) {
    movies = movies.filter(m => {
      const titleMatch = normalizeText(m.title).includes(cleanSearch);
      const descMatch = normalizeText(m.overview || m.description).includes(cleanSearch);
      const directorMatch = normalizeText(m.director).includes(cleanSearch);
      const castMatch = (m.cast || []).some(c => normalizeText(c.name).includes(cleanSearch));
      return titleMatch || descMatch || directorMatch || castMatch;
    });
  }

  // Genre filter
  if (genre && genre !== 'all') {
    const genreNum = Number(genre);
    if (Number.isFinite(genreNum) && genreNum > 0) {
      movies = movies.filter(m => (m.genre_ids || []).includes(genreNum));
    } else {
      const cleanGenre = normalizeText(genre);
      movies = movies.filter(m => normalizeText(m.genre).includes(cleanGenre));
    }
  }

  // Language filter
  if (language && language !== 'all') {
    const cleanLang = normalizeText(language);
    movies = movies.filter(m => normalizeText(m.language).includes(cleanLang));
  }

  // Year filter
  if (year && Number.isFinite(Number(year))) {
    movies = movies.filter(m => Number(m.releaseYear) === Number(year));
  }

  // Sorting
  if (sortBy === 'vote_average.desc') {
    movies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  } else if (sortBy === 'release_date.desc') {
    movies.sort((a, b) => String(b.release_date || b.releaseYear).localeCompare(String(a.release_date || a.releaseYear)));
  } else if (sortBy === 'title.asc') {
    movies.sort((a, b) => String(a.title).localeCompare(String(b.title)));
  } else {
    // Default: popularity / review count
    movies.sort((a, b) => (b.vote_count || b.totalReviews || 0) - (a.vote_count || a.totalReviews || 0));
  }

  const totalResults = movies.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const offset = (currentPage - 1) * pageSize;
  const pagedResults = movies.slice(offset, offset + pageSize);

  return {
    page: currentPage,
    total_pages: totalPages,
    total_results: totalResults,
    results: pagedResults
  };
};

/**
 * Offline Watchlist API
 */
export const offlineWatchlist = {
  getWatchlist() {
    return getStoredJson(STORAGE_KEYS.WATCHLIST, []);
  },
  checkWatchlist(tmdbId) {
    const list = this.getWatchlist();
    const idNum = Number(tmdbId);
    return list.some(item => Number(item.tmdbId || item.id || item.movieId) === idNum);
  },
  addToWatchlist(movieData) {
    const list = this.getWatchlist();
    const tmdbId = Number(movieData.id || movieData.tmdbId);
    if (!list.some(item => Number(item.tmdbId || item.id || item.movieId) === tmdbId)) {
      const newItem = {
        id: Date.now(),
        tmdbId,
        movieId: tmdbId,
        title: movieData.title || movieData.name,
        posterUrl: movieData.poster_path || movieData.posterUrl,
        backdropUrl: movieData.backdrop_path || movieData.backdropUrl,
        genre: movieData.genre || (movieData.genres ? movieData.genres.map(g => g.name).join(', ') : ''),
        releaseYear: movieData.releaseYear || (movieData.release_date ? parseInt(movieData.release_date.substring(0, 4)) : 2024),
        voteAverage: movieData.vote_average || movieData.averageRating || 8.0,
        totalReviews: movieData.vote_count || movieData.totalReviews || 100,
        createdAt: new Date().toISOString()
      };
      list.unshift(newItem);
      setStoredJson(STORAGE_KEYS.WATCHLIST, list);
      return newItem;
    }
    return list.find(item => Number(item.tmdbId || item.id || item.movieId) === tmdbId);
  },
  removeFromWatchlist(tmdbId) {
    const list = this.getWatchlist();
    const idNum = Number(tmdbId);
    const updated = list.filter(item => Number(item.tmdbId || item.id || item.movieId) !== idNum);
    setStoredJson(STORAGE_KEYS.WATCHLIST, updated);
    return { success: true };
  }
};

/**
 * Offline Reviews API
 */
export const offlineReviews = {
  getReviews(tmdbId) {
    const stored = getStoredJson(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const idNum = Number(tmdbId);
    return stored.filter(r => Number(r.tmdbId) === idNum);
  },
  submitReview(reviewData) {
    const stored = getStoredJson(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const newReview = {
      id: Date.now(),
      tmdbId: Number(reviewData.tmdbId || reviewData.movieId),
      author: reviewData.author || 'Cinephile Critic',
      rating: Number(reviewData.rating) || 8,
      content: reviewData.content || reviewData.comment || 'Great cinematic storytelling!',
      reviewDate: new Date().toISOString().slice(0, 10)
    };
    stored.unshift(newReview);
    setStoredJson(STORAGE_KEYS.REVIEWS, stored);
    return newReview;
  }
};

/**
 * Offline Custom Movies API
 */
export const offlineMovieService = {
  getAll() {
    return getOfflineCatalog();
  },
  getById(id) {
    const catalog = getOfflineCatalog();
    const idNum = Number(id);
    return catalog.find(m => Number(m.id) === idNum || Number(m.tmdbId) === idNum) || null;
  },
  create(data) {
    const custom = getStoredJson(STORAGE_KEYS.CUSTOM_MOVIES, []);
    const newMovie = {
      ...data,
      id: Date.now(),
      tmdbId: Date.now(),
      isLocalCatalog: true,
      vote_average: Number(data.averageRating || data.vote_average) || 8.0,
      averageRating: Number(data.averageRating || data.vote_average) || 8.0,
      vote_count: Number(data.totalReviews || data.vote_count) || 1,
      totalReviews: Number(data.totalReviews || data.vote_count) || 1,
      poster_path: data.posterUrl,
      backdrop_path: data.backdropUrl || data.posterUrl
    };
    custom.unshift(newMovie);
    setStoredJson(STORAGE_KEYS.CUSTOM_MOVIES, custom);
    return newMovie;
  }
};

/**
 * Offline Auth API
 */
export const offlineAuth = {
  getCurrentUser() {
    return getStoredJson(STORAGE_KEYS.USER, {
      id: 1,
      displayName: 'Alex Mercer',
      email: 'alex@cinerate.com',
      role: 'USER'
    });
  },
  login({ email, password }) {
    const user = {
      id: 1,
      displayName: (email.split('@')[0] || 'Cinephile').replace(/[._]/g, ' '),
      email,
      role: 'USER'
    };
    setStoredJson(STORAGE_KEYS.USER, user);
    return user;
  },
  register({ displayName, email }) {
    const user = {
      id: Date.now(),
      displayName: displayName || email.split('@')[0],
      email,
      role: 'USER'
    };
    setStoredJson(STORAGE_KEYS.USER, user);
    return user;
  },
  logout() {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch {
      // ignore
    }
  }
};
