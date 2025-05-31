import React, { useState, useEffect } from "react";
import "../styles/App.css";
import { useNavigate } from "react-router-dom";

const SettingsPanel = () => {
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem("activeProfile")) || {};
  const [dataUsage, setDataUsage] = useState("auto");

  useEffect(() => {
    const stored = localStorage.getItem(`dataUsage_${profile.username}`);
    if (stored) setDataUsage(stored);
  }, [profile.username]);

  const handleSave = () => {
    localStorage.setItem(`dataUsage_${profile.username}`, dataUsage);

    const audio = new Audio("/start-13691.mp3");
    audio.volume = 0.5;
    audio.play().catch((e) => console.log("🔇 Ήχος μπλοκαρίστηκε:", e));

    setTimeout(() => {
      navigate("/home");
    }, 800);
  };

  const options = [
    {
      id: "auto",
      title: "Αυτόματη",
      desc: "Προβολή στην υψηλότερη διαθέσιμη ποιότητα έως 4K UHD (4,2 GB/ώρα)",
    },
    {
      id: "medium",
      title: "Μέτρια",
      desc: "Χρήση λιγότερων δεδομένων για προβολή ποιότητας έως HD (1,2 GB/ώρα)",
    },
    {
      id: "low",
      title: "Εξοικονόμηση δεδομένων",
      desc: "Χρήση των λιγότερων δυνατών δεδομένων για προβολή ποιότητας SD (0,6 GB/ώρα)",
    },
  ];

  return (
    <div className="container content-container">
      <h2 style={{ marginTop: "2rem", color: "#4dbf00" }}>Ρυθμίσεις εφαρμογής</h2>

      <div className="settings-section" style={{ marginTop: "3rem" }}>
        <p style={{ fontWeight: "bold" }}>ΧΡΗΣΗ ΔΕΔΟΜΕΝΩΝ</p>
        {options.map((option) => (
          <div
            key={option.id}
            className={`option-item ${dataUsage === option.id ? "selected" : ""}`}
            onClick={() => setDataUsage(option.id)}
            style={{
              borderBottom: "1px solid gray",
              padding: "1.5rem 0",
              cursor: "pointer",
            }}
          >
            <h3
              style={{
                marginBottom: "0.5rem",
                color: dataUsage === option.id ? "#4dbf00" : "white",
              }}
            >
              {option.title} {dataUsage === option.id && "✔"}
            </h3>
            <p style={{ color: "lightgray" }}>{option.desc}</p>
          </div>
        ))}
      </div>

      <button
        className="featured-button"
        onClick={handleSave}
        style={{ marginTop: "2rem", fontSize: "1.1rem" }}
      >
        ΑΠΟΘΗΚΕΥΣΗ
      </button>
    </div>
  );
};

export default SettingsPanel;
