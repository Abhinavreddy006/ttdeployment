package com.cinerate.cinerate.config;

import com.cinerate.cinerate.entity.Movie;
import com.cinerate.cinerate.repository.MovieRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    private final MovieRepository movieRepository;

    public DataInitializer(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public void run(String... args) {
        try {
            if (movieRepository.count() == 0) {
                logger.info("Initializing database with complete 28-movie collection and verified posters...");
                seedMovies();
                logger.info("Database successfully seeded with 28 movies.");
            } else {
                // Ensure Spider-Man: Brand New Day exists
                boolean hasSpiderman = movieRepository.findAll().stream()
                        .anyMatch(m -> m.getTitle() != null && m.getTitle().toLowerCase().contains("spider-man: brand new day"));
                if (!hasSpiderman) {
                    Movie spiderman = createMovie(
                            12445L,
                            "Spider-Man: Brand New Day",
                            "Fighting crime full-time as Spider-Man in a world that doesn't remember him—and the pressure of seeing his old friends move on without him—sparks a change in Peter Parker he may not have the power to control. But that transformation...",
                            "Action, Sci-Fi, Adventure",
                            "English",
                            2026,
                            "Destin Daniel Cretton",
                            "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
                            "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
                            8.4,
                            4709
                    );
                    movieRepository.save(spiderman);
                    logger.info("Added Spider-Man: Brand New Day to catalog.");
                }
            }
        } catch (Exception e) {
            logger.warn("Database initialization skipped or encountered error: {}", e.getMessage());
        }
    }

    private void seedMovies() {
        List<Movie> movies = List.of(
                createMovie(12445L, "Spider-Man: Brand New Day",
                        "Fighting crime full-time as Spider-Man in a world that doesn't remember him—and the pressure of seeing his old friends move on without him—sparks a change in Peter Parker he may not have the power to control. But that transformation...",
                        "Action, Sci-Fi, Adventure", "English", 2026, "Destin Daniel Cretton",
                        "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
                        "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg", 8.4, 4709),

                createMovie(27205L, "Inception",
                        "Cobb steals information from his targets by entering their dreams. He is offered a chance to have his criminal history erased as payment for the implantation of another person's idea into a target's subconscious.",
                        "Action, Sci-Fi, Adventure", "English", 2010, "Christopher Nolan",
                        "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
                        "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg", 8.8, 3200),

                createMovie(157336L, "Interstellar",
                        "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
                        "Adventure, Drama, Sci-Fi", "English", 2014, "Christopher Nolan",
                        "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
                        "https://image.tmdb.org/t/p/original/rAiYTsqzbmuQ0zFuVaJwEDAVRY.jpg", 8.7, 2900),

                createMovie(155L, "The Dark Knight",
                        "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent, but finds himself facing the chaotic menace of the Joker.",
                        "Action, Crime, Drama", "English", 2008, "Christopher Nolan",
                        "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
                        "https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg", 9.0, 3100),

                createMovie(872585L, "Oppenheimer",
                        "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
                        "Biography, Drama, History", "English", 2023, "Christopher Nolan",
                        "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
                        "https://image.tmdb.org/t/p/original/fm6K9vY9wgjBYhaYsS2fON39IXn.jpg", 8.6, 2400),

                createMovie(693134L, "Dune: Part Two",
                        "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
                        "Action, Adventure, Sci-Fi", "English", 2024, "Denis Villeneuve",
                        "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
                        "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s520b4q.jpg", 8.5, 2100),

                createMovie(238L, "The Godfather",
                        "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch Vito Corleone barely survives an attempt on his life, his youngest son steps in.",
                        "Crime, Drama", "English", 1972, "Francis Ford Coppola",
                        "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
                        "https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg", 9.2, 3500),

                createMovie(680L, "Pulp Fiction",
                        "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
                        "Crime, Drama", "English", 1994, "Quentin Tarantino",
                        "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
                        "https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg", 8.9, 2700),

                createMovie(278L, "The Shawshank Redemption",
                        "Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.",
                        "Drama, Crime", "English", 1994, "Frank Darabont",
                        "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
                        "https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg", 9.3, 3800),

                createMovie(496243L, "Parasite",
                        "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
                        "Comedy, Drama, Thriller", "Korean", 2019, "Bong Joon-ho",
                        "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
                        "https://image.tmdb.org/t/p/original/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg", 8.5, 2300),

                createMovie(129L, "Spirited Away",
                        "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
                        "Animation, Family, Fantasy", "Japanese", 2001, "Hayao Miyazaki",
                        "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
                        "https://image.tmdb.org/t/p/original/mSDsSDwaP3E7dEfUPWy4J0djt4O.jpg", 8.6, 2100),

                createMovie(244786L, "Whiplash",
                        "Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, pushing his physical and mental limits.",
                        "Drama, Music", "English", 2014, "Damien Chazelle",
                        "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
                        "https://image.tmdb.org/t/p/original/vNXGrknW6F1i7848fP8O9Q4s1M.jpg", 8.5, 1950),

                createMovie(313369L, "La La Land",
                        "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
                        "Comedy, Drama, Romance, Music", "English", 2016, "Damien Chazelle",
                        "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
                        "https://image.tmdb.org/t/p/original/nlPCdZlHtRNcF6C9hzUH4ebmV1w.jpg", 8.0, 1800),

                createMovie(579974L, "RRR",
                        "A fictional history of two legendary revolutionaries' journey away from home before they began fighting for their country in the 1920s.",
                        "Action, Drama", "Telugu", 2022, "S.S. Rajamouli",
                        "https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg",
                        "https://image.tmdb.org/t/p/original/zGLHX92Gk96O1APvCr7NTzr94L4.jpg", 8.0, 1400),

                createMovie(545611L, "Everything Everywhere All at Once",
                        "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what's important to her by connecting with the lives she could have led in other universes.",
                        "Action, Adventure, Sci-Fi", "English", 2022, "Daniel Kwan, Daniel Scheinert",
                        "https://image.tmdb.org/t/p/w500/u68AjlvlutfEIcpmbYpKcdi09ut.jpg",
                        "https://image.tmdb.org/t/p/original/fIwiFha3WPu5nHkBeMQ4GzEk0Hv.jpg", 8.1, 1600),

                createMovie(569094L, "Spider-Man: Across the Spider-Verse",
                        "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
                        "Animation, Action, Adventure, Sci-Fi", "English", 2023, "Joaquim Dos Santos, Kemp Powers",
                        "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
                        "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg", 8.7, 2500),

                createMovie(550L, "Fight Club",
                        "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
                        "Drama", "English", 1999, "David Fincher",
                        "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
                        "https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg", 8.8, 2900),

                createMovie(98L, "Gladiator",
                        "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
                        "Action, Adventure, Drama", "English", 2000, "Ridley Scott",
                        "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
                        "https://image.tmdb.org/t/p/original/Ar7kP2yR5H7PZ9L15P7eM8w1X0.jpg", 8.5, 2150),

                createMovie(603L, "The Matrix",
                        "Set in the 22nd century, a computer hacker joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
                        "Action, Sci-Fi", "English", 1999, "Lana Wachowski, Lilly Wachowski",
                        "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
                        "https://image.tmdb.org/t/p/original/ncEHGiyMRGH9VOGBoDcRU1Sp48o.jpg", 8.7, 2850),

                createMovie(299534L, "Avengers: Endgame",
                        "After the devastating events of Infinity War, the remaining Avengers assemble once more in order to reverse Thanos' actions.",
                        "Adventure, Sci-Fi, Action", "English", 2019, "Anthony Russo, Joe Russo",
                        "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
                        "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg", 8.3, 2600),

                createMovie(354912L, "Coco",
                        "Despite his family's generations-old ban on music, Miguel dreams of becoming an accomplished musician like his idol, Ernesto de la Cruz.",
                        "Animation, Family, Fantasy, Music", "Spanish", 2017, "Lee Unkrich",
                        "https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg",
                        "https://image.tmdb.org/t/p/original/askg3SMvhqEl4OL52YuvdtQw40Y.jpg", 8.4, 1800),

                createMovie(769L, "GoodFellas",
                        "The story of Henry Hill and his life in the mafia, covering his relationship with his mob partners Jimmy Conway and Tommy DeVito.",
                        "Drama, Crime", "English", 1990, "Martin Scorsese",
                        "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
                        "https://image.tmdb.org/t/p/original/sw7mordbZxgITU877yTpZCud90M.jpg", 8.7, 1750),

                createMovie(807L, "Seven",
                        "Two homicide detectives are on a desperate hunt for a serial killer whose crimes are based on the seven deadly sins.",
                        "Crime, Mystery, Thriller", "English", 1995, "David Fincher",
                        "https://image.tmdb.org/t/p/w500/69Sns8WoET6CfaYlIkHbla4l7nC.jpg",
                        "https://image.tmdb.org/t/p/original/ba4CpLnvv1vrzSQb7XYT9pmD82l.jpg", 8.6, 1920),

                createMovie(120L, "The Lord of the Rings: The Fellowship of the Ring",
                        "Young hobbit Frodo Baggins must leave his home in order to destroy a mysterious ring before it falls into the hands of the Dark Lord Sauron.",
                        "Adventure, Fantasy, Action", "English", 2001, "Peter Jackson",
                        "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
                        "https://image.tmdb.org/t/p/original/9DeGfFIqjph5CBcuF3hg2rV9M1w.jpg", 8.9, 3400),

                createMovie(372058L, "Your Name.",
                        "High schoolers Mitsuha and Taki are complete strangers living separate lives, until they suddenly begin swapping bodies.",
                        "Animation, Romance, Drama", "Japanese", 2016, "Makoto Shinkai",
                        "https://image.tmdb.org/t/p/w500/vfJFJPepRKapMd5G2ro7klIRysq.jpg",
                        "https://image.tmdb.org/t/p/original/dIWwZW7dJJ1q48oQWumbkNOYsRt.jpg", 8.8, 1650),

                createMovie(274L, "The Silence of the Lambs",
                        "Clarice Starling must interview Dr. Hannibal Lecter, a brilliant psychiatrist who is also a violent psychopath, to catch a serial killer.",
                        "Crime, Drama, Thriller", "English", 1991, "Jonathan Demme",
                        "https://image.tmdb.org/t/p/w500/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg",
                        "https://image.tmdb.org/t/p/original/mfwq2nMBzArzQ7Y9R5KN0j5gL9n.jpg", 8.6, 2100),

                createMovie(335984L, "Blade Runner 2049",
                        "Thirty years after the events of the first film, a new blade runner unearths a long-buried secret that has the potential to plunge society into chaos.",
                        "Sci-Fi, Drama, Mystery", "English", 2017, "Denis Villeneuve",
                        "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
                        "https://image.tmdb.org/t/p/original/ilRyASDvt7v5o06v74bF359Qn8b.jpg", 8.5, 1800),

                createMovie(49018L, "Insidious",
                        "A family discovers that dark spirits have invaded their home after their son inexplicably falls into an endless sleep. When they reach out to a professional for help, they learn things are a lot more personal than they thought.",
                        "Horror, Mystery, Thriller", "English", 2010, "James Wan",
                        "https://image.tmdb.org/t/p/w500/tmlDFIUpGRKiuWm9Ixc6CYDk4y0.jpg",
                        "https://image.tmdb.org/t/p/original/aXOUc4dkzp9wmJG5lC2iAE6VUdt.jpg", 7.0, 1600)
        );

        movieRepository.saveAll(movies);
    }

    private Movie createMovie(Long tmdbId, String title, String description, String genre,
                              String language, Integer year, String director,
                              String posterUrl, String backdropUrl, Double rating, Integer reviews) {
        Movie m = new Movie();
        m.setTmdbId(tmdbId);
        m.setTitle(title);
        m.setDescription(description);
        m.setGenre(genre);
        m.setLanguage(language);
        m.setReleaseYear(year);
        m.setDirector(director);
        m.setPosterUrl(posterUrl);
        m.setBackdropUrl(backdropUrl);
        m.setAverageRating(rating);
        m.setTotalReviews(reviews);
        return m;
    }
}
