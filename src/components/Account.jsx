import React from "react";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem("activeProfile"));

  const handleDelete = async () => {
    const confirmed = window.confirm("❗ Είσαι σίγουρος/η ότι θέλεις να διαγράψεις το προφίλ σου;");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/profiles/${profile._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      console.log(data.msg);

      localStorage.removeItem("activeProfile");
      alert("✅ Το προφίλ διαγράφηκε!");
      navigate("/");
    } catch (error) {
      console.error("❌ Σφάλμα διαγραφής προφίλ:", error);
      alert("❌ Σφάλμα κατά τη διαγραφή. Δοκίμασε ξανά.");
    }
  };

  return (
    <div className="account-container">
      <h1>👤 Λογαριασμός</h1>
      <img
        src={profile?.avatar || "/profile.jpg"}
        alt="Avatar"
        className="avatar"
      />
      <p>👤 Όνομα: {profile?.username}</p>
      <p>📧 Email: {profile?.email}</p>

      <button onClick={() => navigate(-1)}>🔙 Επιστροφή</button>
      <button onClick={handleDelete} className="delete-btn">
        🗑️ Διαγραφή προφίλ
      </button>

      <div className="game-preview">
        🕹️ Παιχνίδι προφίλ – Έρχεται σύντομα! <br />
        Μάζεψε πόντους με το προφίλ σου και ανταγωνίσου τους άλλους!
      </div>
    </div>
  );
};

export default Account;
