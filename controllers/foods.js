// controllers/foods.js

import express from 'express';
const router = express.Router();

import User from '../models/user.js';

router.get('/', (req, res) => {
    res.render('foods/index.ejs')
  });  

export default router;
