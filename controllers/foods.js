// controllers/foods.js

import express from "express";
const router = express.Router();

import User from "../models/user.js";

router.get("/", (req, res) => {
  res.render("foods/index.ejs");
});

router.get("/new", (req, res) => {
  res.render("foods/new.ejs");
});

router.post(('/'), async (req, res) => {
  try {
    const newFood = req.body;
    const currentUser = await User.findById(req.session.user._id)
    currentUser.pantry.push(newFood)
    await currentUser.save()
    res.redirect('/users/:userId/foods');
  } catch (error) {
    console.log(error);
    res.status(418).send('There was an error adding a new food.')
  }
})

export default router;
