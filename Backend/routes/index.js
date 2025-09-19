var express = require('express');
var router = express.Router();
const passport = require('passport');
const userModel = require('./users');
const localStrategy = require('passport-local').Strategy;
passport.use(new localStrategy(userModel.authenticate()));
const upload = require('./multer');
const postModel = require('./post');

// Health check route
router.get('/health', (req, res) => {
  res.send('Backend is running!');
});

// Root route (safe for Render)
router.get('/', (req, res) => {
  res.send('Welcome to Feed-Pin backend!'); // simple message to prevent 404
});

// Register page
router.get('/register', (req, res) => {
  try {
    res.render('register', { nav: false });
  } catch (err) {
    res.send('Register page not available.');
  }
});

// Add post page
router.get('/add', isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    res.render('add', { user, nav: true });
  } catch (err) {
    res.send('Error loading Add Post page.');
  }
});

// Create post
router.post('/createpost', isLoggedIn, upload.single('postImage'), async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const post = await postModel.create({
      user: user._id,
      title: req.body.title,
      image: req.file.filename,
      description: req.body.description
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect('/profile');
  } catch (err) {
    res.send('Error creating post.');
  }
});

// Profile page
router.get('/profile', isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user }).populate('posts');
    res.render('profile', { user, nav: true });
  } catch (err) {
    res.send('Profile not available.');
  }
});

// Feed page
router.get('/feed', isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const posts = await postModel.find().populate('user');
    res.render('feed', { user, posts, nav: true });
  } catch (err) {
    res.send('Feed not available.');
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const data = new userModel({
      username: req.body.username,
      email: req.body.email,
      contact: req.body.contact,
      name: req.body.fullname,
    });
    await userModel.register(data, req.body.password);
    passport.authenticate('local')(req, res, () => {
      res.redirect('/profile');
    });
  } catch (err) {
    res.send('Registration failed.');
  }
});

// Login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/'
}));

// Logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.send('Logout failed.');
    res.redirect('/');
  });
});

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}

module.exports = router;
