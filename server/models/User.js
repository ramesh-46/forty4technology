// const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

// const userSchema = new mongoose.Schema({
//   _id: { type: Number },
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true },
//   company: { type: String, required: true },
//   address: {
//     street: String,
//     city: String,
//     zipcode: String,
//     geo: { lat: String, lng: String },
//   },
// });

// // Apply the auto-increment plugin
// userSchema.plugin(AutoIncrement, { inc_field: '_id' });

// module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
  _id: { type: Number },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  address: {
    street: String,
    city: String,
    zipcode: String,
    geo: { lat: String, lng: String },
  },
});

// Apply the auto-increment plugin
userSchema.plugin(AutoIncrement, { inc_field: '_id' });

module.exports = mongoose.model('User', userSchema);
