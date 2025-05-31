const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const verifyToken = require("./middleware/verifyToken");


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB σύνδεση
mongoose.connect("mongodb://localhost:27017/moviestream", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Συνδέθηκε με MongoDB"))
.catch((err) => console.error("❌ Σφάλμα MongoDB:", err));

// Routes
app.use("/api/auth", authRoutes);
const profileRoutes = require("./routes/profile");
app.use("/api/profiles", profileRoutes);



// Εκκίνηση server
app.listen(PORT, () => {
  console.log(`🚀 Server τρέχει στη θύρα http://localhost:${PORT}`);
});


