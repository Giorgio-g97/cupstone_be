const express = require("express");
const gh = express.Router;
const password = require("passport");
const GithubStrategy = require("passport-github2").Strategy;
const jwt = require("jsonwebtoken");
const session = require("express-session");
require("dotenv").config();

// Presa da doc di passport e passport-github2
gh.use(
  session({
    secret: process.env.GITHUB_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

gh.use(passport.initialize());
gh.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_API_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    (accesToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// Metodo GET

gh.get(
  "/auth/github", password.authenticate("github", {scope: [" user: email"]}),(req, res) => {
    const redirectUrl = `http://localhot:3000/success?user=${encodeURIComponent(JSON.stringify(req.user))}`
    res.redirect(redirectUrl)
  }
);

gh.get('/auth/github/callback', passport.authenticate('github', { failureRetirect: '/' }), (req,res) => {
  const user = req.user
  const token = jwt.sign(user, process.env.JWT_SECRET)
  const redirectUrl = `http://localhost:3000/success?token=${encodeURIComponent(token)}`
  res.redirect(redirectUrl)
});

gh.get('/success', (req,res) => {
  res.redirect('http://localhost:3000/home')
})

module.exports = gh;
