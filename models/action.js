var mongoose = require('mongoose');

var actionSchema = mongoose.Schema({
  type: String, // Current Types: 'play'
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  game: String,
  when: {
    type: Date,
    default: new Date()
  }
});

// sets a hashed _id
actionSchema.index({
  _id: 'hashed'
});

module.exports = mongoose.model('Action', actionSchema);
