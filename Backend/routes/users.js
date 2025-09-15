const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');


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

});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);