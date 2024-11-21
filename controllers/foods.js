// controllers/foods.js

import express from "express";
const router = express.Router();
import methodOverride from 'method-override';

import User from "../models/user.js";

router.use(methodOverride('_method'))
router.use(express.urlencoded({extended: true}))

//index route for user pantry
router.get("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const fullPantry = currentUser.pantry;
    res.render("foods/index.ejs",{ pantry: fullPantry});
  } catch (error) {
    console.error(error)
    res.status(418).send('There was an error getting your pantry')
  }
});

//new form
router.get("/new", (req, res) => {
  res.render("foods/new.ejs");
});

//POST
router.post(('/'), async (req, res) => {
  try {
    const newFood = req.body;
    const currentUser = await User.findById(req.session.user._id)
    currentUser.pantry.push(newFood)
    await currentUser.save()
    res.redirect('/users/:userId/foods');
  } catch (error) {
    console.error(error);
    res.status(418).send('There was an error adding a new food.')
  }
})

//DELETE
router.delete(('/:itemId'), async (req, res) => {
  const userId = req.session.user._id
  const {itemId} = req.params;
  try {
    const foodRemoved = await User.updateOne(
      { _id: userId },
      { $pull: { pantry: { _id: itemId } } }
    );
    res.redirect(`/users/${userId}/foods`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Could not delete item')    
  }
})

export default router;
