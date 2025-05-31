import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";



const EditProfile = () => {
  const [error, setError] = useState("");
useEffect(() => {
  if (error) {
    const timer = setTimeout(() => {
      setError(""); // εξαφάνιση μηνύματος μετά από 3 δευτερόλεπτα
    }, 3000);

    return () => clearTimeout(timer); // καθάρισμα του timer αν αλλάξει
  }
}, [error]);

  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem("activeProfile"));
  console.log(profile._id);

  const [username, setUsername] = useState(profile.username);
  const [avatar, setAvatar] = useState(profile.avatar || "/profile.jpg");

  const avatarOptions = [
  "/profile.jpg",
  "https://robohash.org/b8f4dc25639c08e3b63dedfd1c7c452f?set=set4&bgset=&size=400x400",
  "https://gravatar.com/avatar/b8f4dc25639c08e3b63dedfd1c7c452f?s=400&d=robohash&r=x",
  "https://robohash.org/user1?set=set4&size=400x400",
  "https://robohash.org/user2?set=set4&size=400x400",
  "https://robohash.org/user3?set=set4&size=400x400",
  "https://api.dicebear.com/6.x/adventurer/svg?seed=Alex",
  "https://api.dicebear.com/6.x/adventurer/svg?seed=Luna",
  "https://api.dicebear.com/6.x/bottts/svg?seed=Pixel",
  "https://api.dicebear.com/6.x/fun-emoji/svg?seed=Smiley",
  "https://api.dicebear.com/6.x/lorelei/svg?seed=Nightcat"
];


  const saveProfile = async () => {
  const res = await fetch("http://localhost:5000/api/profiles/updateProfile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: profile._id,
      newUsername: username,
      avatar,
    }),
  });

  if (res.ok) {
    const data = await res.json();
    const updated = data.updatedProfile;

    localStorage.setItem("activeProfile", JSON.stringify(updated));

    if (profile.username !== username) {
      const oldFavs = localStorage.getItem(`favorites_${profile.username}`);
      if (oldFavs) {
        localStorage.setItem(`favorites_${username}`, oldFavs);
        localStorage.removeItem(`favorites_${profile.username}`);
      }
    }

    const audio = new Audio("/transition-explosion-121425.mp3");
    audio.play();

    setTimeout(() => {
      navigate("/home");
    }, 800);
  } else {
    const errorData = await res.json();
    setError(errorData.msg || "❌ Σφάλμα αποθήκευσης.");
  }
};


  const handleSave = async () => {
    if (username !== profile.username) {
      const confirmChange = window.confirm(
        "⚠️ Με αυτό το όνομα θα συνδέεστε. Θέλετε σίγουρα να το αλλάξετε;"
      );
      if (!confirmChange) {
        setUsername(profile.username); // επαναφορά
        return;
      }
    }

    await saveProfile();
  };

  return (
    <div className="container content-container">
      <h2 style={{ marginTop: "2rem", color: "#4dbf00" }}>Επεξεργασία προφίλ</h2>

      <div style={{ marginTop: "2rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>Όνομα προφίλ</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="featured-desc"
          style={{ padding: "0.5rem", width: "300px" }}
        />
      </div>

      <div style={{ marginTop: "2rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>Επιλογή Avatar</label>
        <div style={{ display: "flex", gap: "1rem" }}>
          {avatarOptions.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`avatar ${i}`}
              onClick={() => setAvatar(img)}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                cursor: "pointer",
                border: avatar === img ? "3px solid #4dbf00" : "2px solid gray",
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <p>Προεπισκόπηση:</p>
        <img src={avatar} style={{ width: "100px", borderRadius: "50%" }} alt="selected avatar" />
      </div>
          {error && (
  <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
)}

      <button
        className="featured-button"
        onClick={handleSave}
        style={{ marginTop: "2rem" }}
      >
        ΑΠΟΘΗΚΕΥΣΗ
      </button>
    </div>
  );
};

export default EditProfile;
