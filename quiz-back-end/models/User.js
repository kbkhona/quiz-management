const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, maxlength: 90 },
  password: { type: String, required: true }, // hashed
  isAdmin: { type: Boolean, default: false }, // true only after approval
  isPendingAdmin: { type: Boolean, default: false }, // true when user requested admin on registration
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
