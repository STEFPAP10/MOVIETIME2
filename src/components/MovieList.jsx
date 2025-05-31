import React, { useEffect, useState } from "react";
import { IMAGE_PATH } from "../api/api";

const MovieList = ({ title, fetchFunction, onItemClick,id,mediaType }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchFunction();
        setMovies(data.slice(0, 10));
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    }
    fetchData();
  }, [fetchFunction]);

  return (
    <div id={id} className="movie-list-container">
      <h1  className="movie-list-title">{title}</h1>
      <div className="movie-list-wrapper">
        <div  className="movie-list">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-list-item">
              <img
                className="movie-list-item-img"
                src={movie.poster_path ? IMAGE_PATH + movie.poster_path : "/no-poster.jpg"}
                alt={movie.title || movie.name}
                onClick={() => onItemClick && onItemClick(movie.id, mediaType)}
              />
              <span className="movie-list-item-title">
                {movie.title || movie.name}
              </span>
              <p className="movie-list-item-desc">
                {movie.overview ? movie.overview.slice(0, 100) + "..." : ""}
              </p>
              <button className="movie-list-item-button">WATCH</button>
            </div>
          ))}
        </div>
<i
  className="fas fa-chevron-right arrow"
  onClick={(e) => {
    const movieList = e.currentTarget
      .closest(".movie-list-wrapper")
      .querySelector(".movie-list");

    if (movieList) {
      const maxScrollLeft = movieList.scrollWidth - movieList.clientWidth;

      // Αν φτάσαμε στο τέλος ή είμαστε πολύ κοντά, γυρνάει στην αρχή
      if (movieList.scrollLeft + 300 >= maxScrollLeft - 5) {
        movieList.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        movieList.scrollBy({ left: 450, behavior: "smooth" });
      }
    }
  }}
  title="Scroll δεξιά"
/>

      </div>
    </div>
  );
};

export default MovieList;