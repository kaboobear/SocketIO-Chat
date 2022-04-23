const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('./models/user_model');

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) token = req.cookies['access_token'];
  return token;
};

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) return done(err);
      if (!user)
        return done(null, { errors: { mail: 'User not found' }, error: true });
      user.comparePassword(password, done);
    });
  }),
);

passport.use(
  new JwtStrategy(
    { jwtFromRequest: cookieExtractor, secretOrKey: 'kaboo' },
    (payload, done) => {
      User.findById({ _id: payload.sub }, (err, user) => {
        if (err) return done(err, false);
        if (user) return done(null, user);
        return done(null, false);
      });
    },
  ),
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
