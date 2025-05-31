import React from "react";

const FeaturedMovie = ({ backgroundImage, titleImage, description }) => {
  return (
    <div className="featured-content" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), #151515), url(${backgroundImage})` }}>
      <img className="featured-title" src={titleImage} alt="title" />
      <p className="featured-desc">{description}</p>
      <button className="featured-button">WATCH</button>
    </div>
  );
};

export default FeaturedMovie;