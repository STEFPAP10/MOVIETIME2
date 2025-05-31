import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTopMovies,
  getMovieById,
  getTrending,
  getMovies,
  getPopularTV,
  getTvShowById
} from "../api/api";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import SearchPanel from "../components/SearchPanel";
import FavoritesPanel from "../components/FavoritesPanel";
import FeaturedMovie from "../components/FeaturedMovie";
import MovieList from "../components/MovieList";
import Popup from "../components/Popup";
import "../styles/App.css";
import { setupArrows } from "../api/api";


const IndexPage = () => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  useEffect(() => {
  setupArrows(); // ✅ Ενεργοποίηση scroll δεξιά
}, []);


  const toggleSearchPanel = () => {
    setShowSearch((prev) => !prev);
    setShowFavorites(false);
  };

  const toggleFavoritesPanel = () => {
    setShowFavorites((prev) => !prev);
    setShowSearch(false);
  };

const handleShowPopup = async (id, type = "movie") => {
  let item;

  if (type === "movie") {
    item = await getMovieById(id);
  } else if (type === "tv") {
    item = await getTvShowById(id);
  }

  setSelectedMovie({ ...item, media_type: type });
};


  const handleClosePopup = () => setSelectedMovie(null);

  return (
    <div className="page-wrapper">
      <Navbar />
      <Sidebar
        onSearchClick={toggleSearchPanel}
        onFavoritesClick={toggleFavoritesPanel}
      />
      {showSearch && <SearchPanel onClose={() => setShowSearch(false)} />}
      {showFavorites && <FavoritesPanel onClose={() => setShowFavorites(false)} />}

      <div className="content-container">
        <FeaturedMovie 
          backgroundImage="/f-1.jpg"
          titleImage="/f-t-1.png"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        />
        <MovieList
        id="new"
  title="NEW REALISES"
  fetchFunction={getTrending}
  onItemClick={(id) => handleShowPopup(id, "movie")}
/>

<MovieList
  title="TOP 10"
  id="top10"
  fetchFunction={getTopMovies}
  onItemClick={(id) => handleShowPopup(id, "movie")}
/>
        <FeaturedMovie 
          backgroundImage="/f-2.jpg"
          titleImage="/f-t-2.png"
          description="Dolor sit amet consectetur adipisicing elit."
        />
<MovieList
  title="MOVIES"
  id="movies"
  fetchFunction={getMovies}
  onItemClick={(id) => handleShowPopup(id, "movie")}
/>
<MovieList
  title="SETIES/TV"
  id="series"
  fetchFunction={getPopularTV}
  onItemClick={(id) => handleShowPopup(id, "tv")}
/>
      </div>

      <Popup movie={selectedMovie} onClose={handleClosePopup} />
    </div>
  );
};

export default IndexPage;