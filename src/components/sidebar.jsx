import React from "react";
import { useNavigate } from "react-router-dom";


const Sidebar = ({ onSearchClick, onFavoritesClick }) => {
  const navigate = useNavigate();


  return (
    <div className="sidebar">
      <i id="search-icon" className="left-menu-icon fas fa-search" onClick={onSearchClick}></i>
<i
  className="left-menu-icon fas fa-home"
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
/>
<i
  className="left-menu-icon fas fa-users"
  onClick={() => navigate("/ranking")}
/>
      <i id="favorites-icon" className="left-menu-icon fas fa-bookmark" onClick={onFavoritesClick}></i>
      
      <i
  className="left-menu-icon fas fa-shopping-cart"
  onClick={() => navigate("/cart")}
  title="Καλάθι"
></i>

    </div>
  );
};

export default Sidebar;