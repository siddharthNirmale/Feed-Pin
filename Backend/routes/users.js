const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

// Connect to MongoDB Atlas using environment variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  profileImage: String,
  contact: String,
  boards: {
    type: Array,
    default: [],
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

// Add passport-local-mongoose plugin
userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);
