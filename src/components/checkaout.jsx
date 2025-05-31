import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const activeProfile = JSON.parse(localStorage.getItem("activeProfile"));
    const username = activeProfile?.username || "guest";
    const cartKey = `cart_${username}`;
    localStorage.removeItem(cartKey);
  }, []);

  return (
    <div className="checkout-page">
      <h1>🎉 Ευχαριστούμε για την αγορά!</h1>
      <p>Η παραγγελία σου καταχωρήθηκε επιτυχώς.</p>
      <button onClick={() => navigate("/home")} className="cart-button continue">
        Επιστροφή στην αρχική
      </button>
    </div>
  );
};

export default Checkout;
