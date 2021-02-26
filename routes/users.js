const express = require("express");
const { userRegistrationValidation, userLoginValidation } = require("./validation");
const User = require("../models/User");
const bcrypt = require("bcryptjs")
const router = express.Router();
const jwt = require("jsonwebtoken");

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
  const {error} = userRegistrationValidation(req.body)
  if(error){
  return res.status(400).json({Message:error.details[0].message})
  }
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

router.post("/login", async (req, res) => {
  const {error} = userLoginValidation(req.body)
  if(error)
  return res.status(400).json({Message:error.details[0].message})
  const user = await User.findOne({email: req.body.email});
  if(!user) return res.status(400).json({Message: "Email or password is wrong"})
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if(!validPass) return res.status(400).json({Message: "Email or password is wrong"})

  const token = jwt.sign({_id: user._id, role:user.role}, process.env.TOKEN_SECRET)
  res.body({Token:token})
  res.status(200).json({Message:"Loged in"
})
});

module.exports = router;