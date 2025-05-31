import React, { useEffect, useState } from "react";
import Popup from "./Popup";

const API_KEY = "09d4d155f252fcf9cec509ee46d291f2";
const image_path = "https://image.tmdb.org/t/p/w1280";

const SearchPanel = ({ onClose }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
const [showPopup, setShowPopup] = useState(false);

const handleOpenPopup = async (id) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
  );
  const data = await res.json();
  setSelectedMovie(data);
  setShowPopup(true);
};

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        searchMovies(searchTerm);
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const searchMovies = async (term) => {
    const resp = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${term}`
    );
    const data = await resp.json();
    setResults(data.results || []);
  };

  return (
    <div id="search-panel" className="search-panel">
      <div className="search-header">
        <input
          type="text"
          id="search-input"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button id="close-search" onClick={onClose}>
          &times;
        </button>
      </div>

      <div className="search-results movie-list">
        {results.map((movie) => (
          <div className="movie-list-item" key={movie.id} onClick={()=>handleOpenPopup(movie.id)}>
            <img
              className="movie-list-item-img"
              src={image_path + movie.poster_path}
              alt={movie.title}
            />
            <span className="movie-list-item-title">{movie.title}</span>
            <p className="movie-list-item-desc">
              {movie.overview
                ? movie.overview.slice(0, 100) + "..."
                : "No description available."}
            </p>
            <button className="movie-list-item-button">Watch</button>
          </div>
        ))}
      </div>
    {showPopup && (
  <Popup
    movie={selectedMovie}
    onClose={() => setShowPopup(false)}
  />
)}  
    </div>
    
    
  )};
export default SearchPanel;

