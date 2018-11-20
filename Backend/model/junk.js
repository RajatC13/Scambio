var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var junk = new Schema({
  title: String,
  description: String,
  condition: String,
  likes: {type: Number, default: 0}
});

module.exports = mongoose.model('Junk', junk)
