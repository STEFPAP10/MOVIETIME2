
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await User.findOne({ email, username });
    if (existing) {
      return res.status(400).json({ msg: "Ο χρήστης υπάρχει ήδη." });
    }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashed });
    await newUser.save();
    res.status(201).json({ msg: "✅ Εγγραφή επιτυχής!" });
  } catch (err) {
    res.status(500).json({ msg: "❌ Σφάλμα εγγραφής." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "❌ Ο χρήστης δεν βρέθηκε." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "❌ Λάθος κωδικός." });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1d" });
      res.status(200).json({
  token,
  _id: user._id,
  email: user.email,
  username: user.username,
  avatar: user.avatar // optional
});

  } catch (err) {
    res.status(500).json({ msg: "❌ Σφάλμα σύνδεσης." });
  }
});

// GET PROFILES BY EMAIL (protected)
router.get("/profiles/:email", verifyToken, async (req, res) => {
  try {
    const users = await User.find({ email: req.params.email }, "username");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: "❌ Σφάλμα λήψης προφίλ." });
  }
});


// UPDATE PROFILE
router.post("/updateProfile", async (req, res) => {
  const { id, newUsername, avatar } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "❌ Ο χρήστης δεν βρέθηκε." });
    }

    // Έλεγχος για υπάρχον username που ΔΕΝ είναι του ίδιου χρήστη
    const existing = await User.findOne({ username: newUsername, _id: { $ne: id } });
    if (existing) {
      return res.status(400).json({ msg: "❗ Το όνομα χρησιμοποιείται ήδη." });
    }

    user.username = newUsername;
    user.avatar = avatar;
    await user.save();

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "❌ Σφάλμα κατά την ενημέρωση προφίλ." });
  }
});


router.delete("/deleteProfile", async (req, res) => {
  const { id } = req.body;
  try {
    await User.findByIdAndDelete(id);
    res.json({ msg: "Προφίλ διαγράφηκε" });
  } catch (err) {
    res.status(500).json({ msg: "Σφάλμα διαγραφής" });
  }
});


module.exports = router;
