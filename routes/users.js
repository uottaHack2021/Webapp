const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const alert = require('alert');

// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login', {
  layout:'login'
}));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register', {
  layout:'register'
}));

// Register
router.post('/register', (req, res) => {
  const firstName = req.body.firstname
  const lastName = req.body.lastname
  const password = req.body.password
  const email = req.body.email
  const password2 = req.body.password2
  let errors = [];

  if (!firstName || !email || !password || !password2 || !lastName) {
    errors.push({ msg: 'Please enter all fields' });
    alert("Please fill all fields")

  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
    alert("passwords do not match")

  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
    alert("password must be 6 characters long")

  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      firstname,
      lastname,
      email,
      password,
      password2
    });
  }
  else {
   User.findOne({ email: email }).then(user => {
    if (user) {
     // errors.push({ msg: 'Email already exists' });
      alert("Email already exists")
        // res.render('register', {
        //   errors,
        //   firstname,
        //   lastname,
        //   email,
        //   password,
        //   password2
        // });
      } else {
        const newUser = new User({
          firstName,
          lastName,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
               
                res.redirect('/users/login');
                alert("Registration successful")
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  // req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
