const {generateToken }= require("../utils/generateToken");
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt= require("jsonwebtoken")

module.exports.registerUser =  (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    bcrypt.genSalt(10, function (err, salt) {
      if (err) return res.send(err.message);

      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) return res.send(err.message);

        let user = await userModel.create({
          email,
          password: hash,
          fullname,
        });

        let token = jwt.sign({ email, id: user._id });
        res.cookie("token", token);

        res.send(user);
      });
    });
  } catch {
    res.status(500).send("error");
  }
};


