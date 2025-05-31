import React, { useEffect, useState } from "react";
import "../styles/App.css";
import { useNavigate } from "react-router-dom";

const Popup = ({ movie, onClose, onFavoriteToggle }) => {
  if (!movie) return null;

  const [trailerKey, setTrailerKey] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showAddedMessage, setShowAddedMessage] = useState(false);


  const activeProfile = JSON.parse(localStorage.getItem("activeProfile"));
  const username = activeProfile?.username || "guest";

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem(`favorites_${username}`)) || [];
    const alreadyFav = favorites.some((fav) => fav.id === movie.id);
    setIsFavorite(alreadyFav);
  }, [movie, username]);

  const navigate = useNavigate();

const handleAddToCart = () => {
  const cartKey = `cart_${username}`;
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  // Αν δεν υπάρχει ήδη η ταινία
  if (!cart.some(item => item.id === movie.id)) {
    const updated = [...cart, movie]; // ✅ όλο το αντικείμενο
    localStorage.setItem(cartKey, JSON.stringify(updated));
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000); // εξαφανίζεται σε 3 sec
  }
};


  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem(`favorites_${username}`)) || [];
    const updated = isFavorite
      ? favorites.filter((fav) => fav.id !== movie.id)
      : [...favorites, { id: movie.id, type: movie.media_type || "movie" }];
    localStorage.setItem(`favorites_${username}`, JSON.stringify(updated));
    setIsFavorite(!isFavorite);
    if (onFavoriteToggle) onFavoriteToggle();
  };

  const sendRating = async (newScore) => {
  if (!activeProfile || !activeProfile._id) return;

  const key = `rated-${username}-${movie.id}`;
  const saved = localStorage.getItem(key);
  const oldScore = saved ? parseInt(saved) : 0;
  const delta = newScore - oldScore;

  if (delta === 0) return;

  try {
    await fetch("http://localhost:5000/api/profiles/update-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: activeProfile._id, score: delta }),
    });

    // Μην ξεχάσεις να ενημερώσεις το localStorage!
    localStorage.setItem(key, newScore);
  } catch (err) {
    console.error("❌ Σφάλμα αποστολής βαθμολογίας:", err);
  }
};

  useEffect(() => {
    async function fetchTrailer() {
      if (!movie) return;

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${movie.media_type || "movie"}/${movie.id}/videos?api_key=09d4d155f252fcf9cec509ee46d291f2&language=en-US`
        );
        const data = await res.json();
        const trailer = data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (trailer) {
          setTrailerKey(trailer.key);
        } else {
          setTrailerKey(null);
        }
      } catch (err) {
        console.error("Trailer fetch error:", err);
        setTrailerKey(null);
      }
    }

    fetchTrailer();

    if (movie && movie.id) {
      const saved = localStorage.getItem(`rated-${username}-${movie.id}`);
      if (saved) {
        setRating(parseInt(saved));
        setHoverRating(parseInt(saved));
      } else {
        setRating(0);
        setHoverRating(0);
      }
    }
  }, [movie]);

  return (
    <div
      className="popup-container show-popup"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 1)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <span className="x-icon" onClick={onClose}>
        &#10006;
      </span>
      <div className="content">
        <div className="left">
          <div className="poster-img">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title || movie.name}
            />
          </div>
          <div className="single-info">
            <span>Add to favorites:</span>
            <span
              className={`heart-icon ${isFavorite ? "active" : ""}`}
              onClick={toggleFavorite}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              &#9829;
            </span>
          </div>
          <div className="single-info rating-section">
            <span>Βαθμολόγησε:</span>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= hoverRating ? "filled" : ""}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(rating)}
                  onClick={() => {
                    setRating(star);
                    sendRating(star);
                    localStorage.setItem(`rated-${username}-${movie.id}`, star);
                  }}
                >
                  ★
                </span>
              ))}
              <span className="score-display">{rating} / 5</span>
            </div>
          </div>
          <div className="single-info">
            <span>Αγορά:</span>
        <span
            className="cart-icon"
          title="Προσθήκη στο καλάθι"
          onClick={handleAddToCart}
              >
             🛒
              </span>
            </div>
            {showAddedMessage && (
  <div className="cart-toast">✅ Προστέθηκε στο καλάθι!</div>
)}

        </div>
        
        <div className="right">
          <h1>{movie.title || movie.name}</h1>
          <h3>{movie.tagline}</h3>
          <div className="single-info-container">
            <div className="single-info">
              <span>Language:</span>
              <span>{movie.original_language}</span>
            </div>
            <div className="single-info">
              <span>Length:</span>
              <span>{movie.runtime || movie.episode_run_time?.[0] || "N/A"} min</span>
            </div>
            <div className="single-info">
              <span>Rate:</span>
              <span>{movie.vote_average} / 10</span>
            </div>
            <div className="single-info">
              <span>Budget:</span>
              <span>
                {movie.budget ? "$" + movie.budget.toLocaleString() : "N/A"}
              </span>
            </div>
            <div className="single-info">
              <span>Release Date:</span>
              <span>{movie.release_date || movie.first_air_date}</span>
            </div>
          </div>
          <div className="genres">
            <h2>Genres</h2>
            <ul>
              {(movie.genres || []).map((g) => (
                <li key={g.id}>{g.name}</li>
              ))}
            </ul>
          </div>
          <div className="overview">
            <h2>Overview</h2>
            <p>{movie.overview}</p>
          </div>

          {trailerKey && (
            <div className="trailer">
              <h2>Trailer</h2>
              <iframe
                width="100%"
                height="300"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="YouTube trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
