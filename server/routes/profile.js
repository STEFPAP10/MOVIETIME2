const express = require("express");
const router = express.Router();
const User = require("../models/User"); // ή άλλο μοντέλο εάν έχεις ξεχωριστό για profiles

// GET /api/profiles?email=example@example.com
router.get("/", async (req, res) => {
  console.log("✅ GET /api/profiles ενεργοποιήθηκε");
  const email = req.query.email;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  try {
    // const profiles = await User.find({ email }).select("username");
const profiles = await User.find({ email }).select("username avatar email");
    console.log("📤 Αποστολή profiles:", profiles);

    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// POST /api/updateProfile
router.post("/updateProfile", async (req, res) => {
  console.log("📩 Λήφθηκε αίτημα updateProfile με:", req.body);

  const { id, newUsername, avatar } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("❌ Χρήστης ΔΕΝ βρέθηκε με ID:", id);
      return res.status(404).json({ msg: "❌ Ο χρήστης δεν βρέθηκε." });
    }
     console.log("✅ Βρέθηκε χρήστης:", user);
    user.username = newUsername;
    user.avatar = avatar;
    await user.save();

    res.status(200).json({
      msg: "✅ Το προφίλ ενημερώθηκε!",
      updatedProfile: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || null,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "❌ Σφάλμα ενημέρωσης προφίλ." });
  }
});


// GET /api/profiles/ranking
router.get("/ranking", async (req, res) => {
  try {
    const profiles = await User.find().select("username avatar score");

    const sorted = profiles
      .filter((p) => typeof p.score === "number")
      .sort((a, b) => b.score - a.score);

    res.json(sorted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Σφάλμα κατά την άντληση κατάταξης." });
  }
});

// POST /api/profiles/update-score
router.post("/update-score", async (req, res) => {
  const { id, score } = req.body;

  if (!id || typeof score !== "number") {
    return res.status(400).json({ msg: "id και score απαιτούνται." });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "Ο χρήστης δεν βρέθηκε." });
    }

    if (typeof user.score !== "number") {
      user.score = 0;
    }

    user.score += score;
    await user.save();

    res.json({ msg: "✅ Score ενημερώθηκε!", newScore: user.score });
  } catch (err) {
    console.error("❌ Σφάλμα ενημέρωσης score:", err);
    res.status(500).json({ msg: "Σφάλμα ενημέρωσης score." });
  }
});

// DELETE /api/profiles/:id
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "❌ Ο χρήστης δεν βρέθηκε." });
    }

    res.json({ msg: "✅ Ο χρήστης διαγράφηκε." });
  } catch (err) {
    console.error("❌ Σφάλμα διαγραφής χρήστη:", err);
    res.status(500).json({ msg: "❌ Σφάλμα κατά τη διαγραφή." });
  }
});



module.exports = router;
