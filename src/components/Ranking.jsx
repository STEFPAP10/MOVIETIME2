import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Ranking = () => {
  const [profiles, setProfiles] = useState([]);
    const navigate = useNavigate();


  useEffect(() => {
    const fetchProfiles = async () => {
      const res = await fetch("http://localhost:5000/api/profiles/ranking");
      const data = await res.json();

      // Ταξινόμηση κατά βαθμολογία
      const sorted = data.sort((a, b) => b.score - a.score);
      setProfiles(sorted);
    };

    fetchProfiles();
  }, []);

  return (
    <div className="ranking-container">
      <h1>🏆 Κατάταξη Προφίλ</h1>
      <ul className="ranking-list">
        {profiles.map((profile, index) => (
          <li key={profile._id} className="ranking-item">
            <span className="rank">{index + 1}.</span>
            <img
              src={profile.avatar || "/profile.jpg"}
              alt={profile.username}
              className="ranking-avatar"
            />
            <span className="ranking-name">{profile.username}</span>
            <span className="ranking-score">{profile.score} πόντοι</span>
          </li>
        ))}
      </ul>


<div className="back-button" onClick={() => navigate("/home")} title="Πίσω">
  &#8592;
</div>


    </div>
    
  );
};

export default Ranking;
