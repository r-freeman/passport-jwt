import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import approotdir from '../approotdir.js';
import passportJwt from 'passport-jwt';
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const User = mongoose.model('User');
console.log(approotdir);
const pathToKey = path.join(approotdir, 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256']
};

const verifyCallback = function(payload, done) {
  User.findOne({_id: payload.sub})
    .then((user) => {
      if (user) {
          return done(null, user);
      } else {
          return done(null, false);
      }        
    })
    .catch(err => done(err, null));
  
};
const strategy = new JwtStrategy(options, verifyCallback) 
const passportUseStrategy = (passport) => {
  // The JWT payload is passed into the veripassportUseStrategyy callback
  passport.use(strategy);
};
export default passportUseStrategy;