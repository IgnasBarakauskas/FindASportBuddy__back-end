const express = require("express");
const { findById } = require("../models/Court");
const router = express.Router();
const Court = require("../models/Court");
const Group = require("../models/Group")
const { courtAddValidation } = require("../user-validation/courtValidation.js");
router.get("/", async (req, res) => {
    try {
      res.status(200);
      const courts = await Court.find();
      if (!courts.length) { 
        res.status(404);
      } else {
        res.json(courts);
      }
    } catch (err) {
      res.status(400);
      res.json({ message: err });
    }
  });

  router.post("/", async (req, res) => {
    const {error} = courtAddValidation(req.body)
    if(error){
    return res.status(400).json({Message:error.details[0].message})
    }
    const court = new Court({
      type: req.body.type,
      ammountOfCourts: req.body.ammountOfCourts,
      price: req.body.price,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      photo: req.body.photo,
    });
    try {
      res.status(201);
      await court.save();
      res.json({message: "Court added"});
    } catch (err) {
      res.status(400);
      res.json({ message: err });
    }
  });
  router.get("/:courtId", async (req, res) => {
	try {
	  res.status(200);
	  const court = await Court.findById(req.params.courtId);
	  if (court === null) {
		res.status(404);
		res.json({Message:"There is no court with given ID"});
	  } else {
		res.json(court);
	  }
	} catch (err) {
	  res.status(404);
	  res.json({ message: err });
	}})
	router.delete("/:courtId", async (req, res) => {
		try {
		  res.status(204);
		  const removedCourt = await Court.deleteOne({ _id: req.params.courtId });
		  if (removedCourt.deletedCount === 0) {
			res.status(404);
			res.json({Message:"Court was not found"});
		  } else {
			res.json(removedCourt);
		  }
		} catch (error) {
		  res.status(404);
		  res.json({ Message: error });
		}
	  });
	  router.get("/:courtId/getGroups", async (req,res) =>{
		  try{
			res.status(200);
      		const court = await Court.findById(req.params.courtId)
			const groupsId = court.groups;
			let groups =[];
			for(const index in groupsId){
				const group = await Group.findById(_id=groupsId[index])
				groups.push(group)
			}
			if(!groups.length){
				res.status(404)
				res.json({Message:"No groups to show"})
			}
			res.json(groups)
		  }
		  catch(err){
			res.status(404);
			res.json({ message: err });
		  }
	  })
  module.exports = router;