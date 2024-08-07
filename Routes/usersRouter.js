const express = require("express");
const router = express.Router();
const { registerUser,loginuser } = require("../controllers/authController");

router.get("/", (req, res) => {
  res.send("seyy hi");
});

router.post("/register", registerUser);

router.post("/login", loginuser)


module.exports = router;
