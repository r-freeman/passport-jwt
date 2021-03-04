import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import { validPassword,  genPassword, issueJWT } from '../lib/utils.js';
const Router = express.Router;

const usersRouter = Router();   
const User = mongoose.model('User');

usersRouter.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
});

// Validate an existing user and issue a JWT
usersRouter.post('/login', function(req, res, next){

  User.findOne({ username: req.body.username })
      .then((user) => {

          if (!user) {
              res.status(401).json({ success: false, msg: "could not find user" });
          }
          
          // Function defined at bottom of app.js
          const isValid = validPassword(req.body.password, user.hash, user.salt);
          
          if (isValid) {

              const tokenObject = issueJWT(user);

              res.status(200).json({ success: true, user: user, token: tokenObject.token, expiresIn: tokenObject.expires });

          } else {

              res.status(401).json({ success: false, msg: "you entered the wrong password" });

          }

      })
      .catch((err) => {
          next(err);
      });
});

// Register a new user
usersRouter.post('/register', function(req, res, next){
  const saltHash = genPassword(req.body.password);
  
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
      username: req.body.username,
      hash: hash,
      salt: salt
  });

  try {
  
      newUser.save()
          .then((user) => {

              const tokenObject = issueJWT(user);

              res.json({ success: true, user: user, token: tokenObject.token, expiresIn: tokenObject.expires });
          });

  } catch (err) {
      
      res.json({ success: false, msg: err });
  
  }

});

export default usersRouter;