// src/components/MovieCard.jsx
import React from "react";

function MovieCard({ backgroundImage, titleImage, description,onClick}) {
  return (
    <div className="featured-content" style={{ backgroundImage: `url(${backgroundImage})` }} onClick={onClick} >
      <img className="featured-title" src={titleImage} alt="Title" />
      <p className="featured-desc">{description}</p>
      <button className="featured-button">WATCH</button>
    </div>
  );
}

export default MovieCard;
