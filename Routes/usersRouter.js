const express = require("express");
const router = express.Router();
const { registerUser,loginuser, logoutuser } = require("../controllers/authController");

router.get("/", (req, res) => {
  res.send("seyy hi");
});

router.post("/register", registerUser);

router.post("/login", loginuser)



router.get("/logout", logoutuser)






module.exports = router;
