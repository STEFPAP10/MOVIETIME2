import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import Popup from "./Popup";
import MovieList from "./MovieList";
import { getFavorites } from "../api/api"; // ή η σωστή σου διαδρομή


const FavoritesPanel = ({ onClose }) => {
  const [favorites, setFavorites] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ✅ 1. Φόρτωσε IDs από το localStorage
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("activeProfile"));
    const username = profile?.username || "guest";
    const stored = JSON.parse(localStorage.getItem(`favorites_${username}`)) || [];

    // ✅ 2. Κάνε fetch κάθε ταινία από το TMDB API
    const fetchAllFavorites = async () => {
      const results = await Promise.all(
        stored.map(async ({ id, type }) => {
          try {
            const res = await fetch(
              `https://api.themoviedb.org/3/${type}/${id}?api_key=09d4d155f252fcf9cec509ee46d291f2&language=en-US`
            );
            const data= await res.json();
            return {...data, media_type:type};
          } catch (err) {
            console.error("❌ Failed to fetch favorite:", id, type, err);
            return null;
          }
        })
      );

      // ✅ 3. Φιλτράρισε null (αποτυχημένα fetches)
      setFavorites(results.filter(Boolean));
    };

    fetchAllFavorites();
  }, [refreshTrigger]);

  // ✅ 4. Όταν πατιέται μία κάρτα, άνοιξε Popup
  const handleOpenPopup = async (id, type) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=09d4d155f252fcf9cec509ee46d291f2&language=en-US`
    );
    const data = await res.json();
    setSelectedMovie(data);
    setShowPopup(true);
  };

  return (
  <div id="favorites-container" className="favorites-panel">
    <span className="close-favorites" onClick={onClose}>
      &#10006;
    </span>
    <h2>Αγαπημένα</h2>
    <div className="favorites-list" id="favorites-list">
  {favorites.map((movie) => (
    <div key={movie.id} className="movie-list-item" onClick={() => handleOpenPopup(movie.id, movie.media_type)}>
      <img
        className="movie-list-item-img"
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/no-poster.jpg"}
        alt={movie.title || movie.name}
      />
      <span className="movie-list-item-title">{movie.title || movie.name}</span>
      <p className="movie-list-item-desc">
        {movie.overview ? movie.overview.slice(0, 100) + "..." : ""}
      </p>
      <button className="movie-list-item-button">WATCH</button>
    </div>
  ))}
  {showPopup && (
  <Popup
    movie={selectedMovie}
    onClose={() => setShowPopup(false)}
    onFavoriteToggle={() => setRefreshTrigger((prev) => prev + 1)}
  />
)}

</div>
  </div>
);

};

export default FavoritesPanel;
