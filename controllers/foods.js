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

router.get('/:itemId/edit', async (req, res) => {
  const userId = req.session.user._id
  const {itemId} = req.params
  const currentUser = await User.findById(userId)
  const pantryItem = currentUser.pantry.find(item => item._id.toString() === itemId);
  res.render('foods/edit.ejs', {userId: userId, pantryItem: pantryItem.food, itemId: itemId})
})

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

router.put('/:itemId', async (req, res) => { //ChatGPT
  try {
    const userId = req.session?.user?._id;
    if (!userId) {
      return res.status(401).send('Unauthorized: User not logged in');
    }

    const { itemId } = req.params;
    const updatedItem = req.body;

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).send('User not found');
    }

    // Find the index of the pantry item
    const itemIndex = currentUser.pantry.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).send('Pantry item not found');
    }

    // Update the item's properties
    currentUser.pantry[itemIndex] = updatedItem;

    // Save the updated user
    await currentUser.save();

    // Redirect to the user's foods page
    res.redirect(`/users/${userId}/foods`);
  } catch (error) {
    console.error('Error updating pantry item:', error);
    res.status(500).send('Internal server error');
  }
});

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
