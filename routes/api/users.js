const express = require("express");
const {
  signup,
  login,
  logout,
  currentUser,
  updateUserSubscription,
} = require("../../models/users");
const { authMiddleware } = require("../../models/users");

const router = express.Router();

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

module.exports = router;
