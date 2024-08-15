const express = require("express");
const {
  signup,
  login,
  logout,
  currentUser,
  updateUserSubscription,
  updateAvatar,
} = require("../../models/users");
const { authMiddleware } = require("../../models/users");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const tmpDir = path.join(__dirname, "../../tmp");

const storage = multer.diskStorage({
  destination: tmpDir,
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/signup", (req, res) => {
  signup(req, res);
});

router.post("/login", (req, res) => {
  login(req, res);
});

router.get("/logout", authMiddleware, (req, res) => {
  logout(req, res);
});

router.get("/current", authMiddleware, (req, res) => {
  currentUser(req, res);
});

router.patch("/", authMiddleware, (req, res) => {
  updateUserSubscription(req, res);
});

router.patch(
  "/avatars",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const avatarURL = await updateAvatar(req, res);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
