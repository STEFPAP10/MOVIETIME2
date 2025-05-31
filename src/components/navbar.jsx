import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfiles } from "../api/api";
import "../styles/App.css";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const navigate = useNavigate();
  const playSound = () => {
  const audio = new Audio("/fast-whoosh-118248.mp3");
  audio.play().catch((e) => console.warn("🔇 Ήχος δεν παίχτηκε:", e));
};


 useEffect(() => {
  const fetchProfiles = async () => {
    try {
      // 📥 Πάρε το ενεργό προφίλ
      const stored = localStorage.getItem("activeProfile");
      if (!stored) return;

      const parsed = JSON.parse(stored);
      const email = parsed.email;
      if (!email) return;

      // 📡 Φέρε τα profiles με βάση το email
      const data = await getProfiles(email);
      console.log("🎯 Profiles loaded:", data);
      setProfiles(data);
      setActiveProfile(parsed);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  fetchProfiles();
}, []);


//   useEffect(() => {
//   async function fetchProfiles() {
//     try {
//       const data = await getProfiles();
//       console.log("🎯 Profiles loaded:", data); // 👈 εδώ!
//       setProfiles(data);
//       const stored = localStorage.getItem("activeProfile");
//       if (stored) {
//         setActiveProfile(JSON.parse(stored)); // 👈 Εδώ παίρνεις το όνομα!
//       }
      
//     } catch (error) {
//       console.error("Error fetching profiles:", error);
//     }
//   }
//   fetchProfiles();
// }, []);
useEffect(() => {
  const syncActiveProfile = () => {
    const stored = localStorage.getItem("activeProfile");
    if (stored) {
      setActiveProfile(JSON.parse(stored));
    }
  };

  window.addEventListener("storage", syncActiveProfile);

  // Και άμεσα στην αρχή
  syncActiveProfile();

  return () => window.removeEventListener("storage", syncActiveProfile);
}, []);
 // Εκτελείται ξανά μόνο όταν αλλάξει το activeProfile


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          <h1 className="logo">MovieTime</h1>
        </div>

        <div className="menu-container">
          <ul className="menu-list">
            <li className="menu-list-item active"><a href="#home">Home</a></li>
            <li className="menu-list-item"><a href="#movies">Movies</a></li>
            <li className="menu-list-item"><a href="#series">Series</a></li>
            <li className="menu-list-item"><a href="#top10">Top 10</a></li>
            <li className="menu-list-item"><a href="#new">New Releases</a></li>
          </ul>
        </div>

        <div className="profile-container" onClick={() => setOpenMenu(!openMenu)}>
          <img
  className="profile-picture"
  src={activeProfile?.avatar || "/profile.jpg"}
  onClick={() => setOpenMenu(!openMenu)}
  alt="Profile"
  />

          <span>
            {activeProfile?.username}
          </span>
          {openMenu && (
            <div className="dropdown-menu extended">
              <div className="profile-dropdown">
                {profiles.map((profile, i) => {
  console.log("🔍 profile στο dropdown:", profile); // 👈 Εδώ!

  return (
    <div
      className={`profile-item ${profile.username === activeProfile?.username ? "active" : ""}`}
      key={i}
  onClick={() => {
  const fullProfile = { ...profile, email: activeProfile.email };
  setActiveProfile(fullProfile);
  localStorage.setItem("activeProfile", JSON.stringify(fullProfile));
  setOpenMenu(false);
  playSound(); // ✅ Παίζει ήχος κατά την αλλαγή
}}


    >
      <img
        src={profile.avatar || "/profile.jpg"}
        alt="avatar"
        className="profile-avatar"
      />
      <span>{profile.username}</span>
    </div>
  );
})}

              </div>
              <hr />
              <ul className="menu-options">
                <li onClick={() => navigate("/edit-profile")}>🛠 Επεξεργασία προφίλ</li>
                <li onClick={() => navigate("/settings")}>⚙️ Ρυθμίσεις εφαρμογής </li>
                <li onClick={()=>navigate("/account")}>👤 Λογαριασμός</li>
                <li onClick={(e) => {
  e.stopPropagation(); // αποτρέπει το κλείσιμο του dropdown
  alert("📧 Για υποστήριξη: support@mysite.com\n📞 Τηλέφωνο: 210-1234567");
}}>
  ❓ Βοήθεια
</li>

                <li onClick={handleLogout}>🚪 Αποσύνδεση</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
