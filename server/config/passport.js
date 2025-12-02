const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          user.lastLogin = Date.now();
          user.username = profile.username;
          user.displayName = profile.displayName;
          user.avatarUrl = profile.photos?.[0]?.value;
          user.email = profile.emails?.[0]?.value;
          await user.save();
        } else {
          user = await User.create({
            githubId: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            avatarUrl: profile.photos?.[0]?.value,
            email: profile.emails?.[0]?.value,
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;
