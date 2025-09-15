const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
const { post } = require('.');


mongoose.connect('mongodb://127.0.0.1:27017/pinterestDB');

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  profileImage: String,
  contact: String,
  boards:{
    type: Array,
    default: [],
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]

});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);