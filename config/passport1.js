const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const alert = require('alert')
// Load User model
const User = require('../models/User');

function myFunction1(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          alert("That email is not registered")
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            alert("Password incorrect")
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};

// function myFunction2(passport) {
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: '/auth/google/callback',
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         const newUser = {
//           googleId: profile.id,
//           displayName: profile.displayName,
//           firstName: profile.name.givenName,
//           lastName: profile.name.familyName,
//           image: profile.photos[0].value,
//         }

//         try {
//           let user = await User.findOne({ googleId: profile.id })

//           if (user) {
//             done(null, user)
//           } else {
//             user = await User.create(newUser)
//             done(null, user)
//           }
//         } catch (err) {
//           console.error(err)
//         }
//       }
//     )
//   )

//   passport.serializeUser((user, done) => {
//     done(null, user.id)
//   })

//   passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => done(err, user))
//   })
// }


module.exports = {
  myFunction1,
  

}