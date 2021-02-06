const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const passport = require('passport');
const alert = require('alert');
const { ensureAuth, ensureGuest } = require('../middleware/auth')


router.get('/chatrooms', ensureAuth, (req, res) =>
 res.render('chat', {
  name1: req.user.firstName + ' ' + req.user.lastName,
 }));

 router.get('/chatrooms/chat', ensureAuth, (req, res) =>
  res.render('chatrooms', {
  name1: req.user.firstName + ' ' + req.user.lastName,
}));


module.exports = router
