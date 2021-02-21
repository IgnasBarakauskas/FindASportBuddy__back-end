const express = require("express");
const { userValidation } = require("./validation");
const User = require("../models/User");
const bcrypt = require("bcryptjs")
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.status(200);
    const users = await User.find();
    if (!users.length) {
      res.status(404);
    } else {
      res.json(users);
    }
  } catch (err) {
    res.status(400);
    res.json({ message: err });
  }
});
router.post("/", async (req, res) => {
  const {error} = userValidation(req.body)
  console.log("test: ", req.body)
  if(error)
  return res.status(400).json({Message:error.details[0].message})
  const emailExist = await User.findOne({email: req.body.email});
  if(emailExist) return res.status(400).json({Message: "Email already exists"})
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password,salt);
  const user = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    password: hashedPassword,
    role: "0",
    birthdayDate: new Date(req.body.birthdayDate),
  });
  try {
    res.status(201);
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.status(400);
    res.json({ message: err });
  }
});

module.exports = router;