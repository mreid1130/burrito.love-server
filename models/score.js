var mongoose = require('mongoose');

var scoreSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  game: String,
  when: {
    type: Date,
    default: new Date()
  },
  time: String,
  burritosEaten: String,
  opponentsTackled: String,
  shipsDestroyed: String,
  asteroidsDestroyed: String,
  wallsDestroyed: String
});

// sets a hashed _id
scoreSchema.index({
  _id: 'hashed'
});

module.exports = mongoose.model('Score', scoreSchema);
