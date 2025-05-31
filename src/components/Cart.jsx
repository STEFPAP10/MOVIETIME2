import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup
 from "./Popup";
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState(null);
const [showPopup, setShowPopup] = useState(false);


  const activeProfile = JSON.parse(localStorage.getItem("activeProfile"));
  const username = activeProfile?.username || "guest";
  const cartKey = `cart_${username}`;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCartItems(saved);
  }, [cartKey]);

  const handleCheckout = () => {
    localStorage.removeItem(cartKey);
    setCartItems([]);
    alert("✅ Η αγορά ολοκληρώθηκε με επιτυχία!");
    navigate("/home");
  };

 return (
  <div className="cart-page">
    <h1 style={{ textAlign: "center", color: "#00ff00" }}>🛒 Καλάθι Αγορών</h1>

    {cartItems.length === 0 ? (
      <p style={{ textAlign: "center" }}>Το καλάθι σου είναι άδειο.</p>
    ) : (
      <div className="cart-layout">
        {/* Αριστερή στήλη - Ταινίες */}
        <div className="cart-left">
          {cartItems.map((movie) => (
            <div
              key={movie.id}
              className="movie-list-item"
              onClick={() => {
                setSelectedMovie(movie);
                setShowPopup(true);
              }}
            >
              <img
                className="movie-list-item-img"
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/no-poster.jpg"
                }
                alt={movie.title || movie.name}
              />
              <span className="movie-list-item-title">
                {movie.title || movie.name}
              </span>
              <p className="movie-list-item-desc">
                {movie.overview?.slice(0, 100) + "..." || ""}
              </p>
              <button className="movie-list-item-button">WATCH</button>
            </div>
          ))}
        </div>

        {/* Δεξιά στήλη - Κουμπιά */}
        <div className="cart-right">
          <button className="cart-button continue" onClick={() => navigate("/checkout")}>
  Συνέχεια
</button>

          <button
            className="cart-button exit"
            onClick={() => {
              navigate("/home");
            }}
          >
            Έξοδος
          </button>
        </div>
      </div>
    )}

    {/* Popup */}
    {showPopup && selectedMovie && (
      <Popup
        movie={selectedMovie}
        onClose={() => setShowPopup(false)}
        onFavoriteToggle={() => {}}
      />
    )}
  </div>
);

};

export default Cart;
