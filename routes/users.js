const express = require("express");
const { userRegistrationValidation, userLoginValidation, userLocationValidation } = require("../user-validation/userValidation");
const User = require("../models/User");
const Group = require("../models/Group");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {isLoggedIn} =require("../token-verification/TokenVerification");
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
    await user.save();
    res.json({message: "Successfully registered"});
  } catch (err) {
    res.status(400);
    res.json({ message: err });
  }
});

router.post("/login", async (req, res) => {
  const {error} = userLoginValidation(req.body)
  if(error){
  return res.status(400).json({Message:error.details[0].message})
  }
  const user = await User.findOne({email: req.body.email});
  if(!user) return res.status(400).json({Message: "Email or password is wrong"})
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if(!validPass) return res.status(400).json({Message: "Email or password is wrong"})
  const token = jwt.sign({_id: user._id, role:user.role}, process.env.TOKEN_SECRET)
  res.json({Token:token})
  res.status(200).json({Message:"Successfully loged in"
})
});
router.patch("/location", isLoggedIn, async (req, res) => {
  const {errorLocation} = userLocationValidation(req.body)
  if(errorLocation){
  return res.status(400).json({Message:error.details[0].message})
  }
  const token = req.header("Token");
  const verified = jwt.verify(token, process.env.TOKEN_SECRET);
  const _id = verified._id
  try {
    res.status(202);
    const updatedUser = await User.updateOne(
      { _id: _id },
      {
        $set: {
          latitude: req.body.latitude,
          longitude: req.body.longitude,
        },
      }
    );
    if (updatedUser.n === 0) {
      res.status(404);
      res.json({Message:"User was not found"});
    } else if (updatedUser.nModified === 0) {
      res.json({Message:"No modifications was done"});
    } else {
      res.json(updatedUser);
    }
  } catch (error) {
    res.status(404);
    res.json({ Message: error });
  }
});
router.get("/:userId", async (req, res) => {
	try {
	  res.status(200);
	  const user = await User.findById(req.params.userId);
	  if (user === null) {
		res.status(404);
		res.json({Message:"There is no user with given ID"});
	  } else {
		res.json(user);
	  }
	} catch (err) {
	  res.status(404);
	  res.json({ message: err });
	}
  });
  router.get("/:userId/getGroups", async (req,res) =>{
	try{
	  res.status(200);
	  const user = await User.findById(req.params.userId)
	  const groupsId = user.groups;
	  let groups =[];
	  for(const index in groupsId){
		  const group = await Group.findById(_id=groupsId[index])
		  groups.push(group)
	  }
	  res.json(groups)
	}
	catch(err){
	  res.status(404);
	  res.json({ message: err });
	}
})
module.exports = router;