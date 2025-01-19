const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  name: {
    type: String,
    required: true // This is correct
  },
  locality: {
    type: String,
    required: true // This is correct
  },
  problem: {
    type: String,
    required: true // This is correct
  },
  measures: {
    type: String,
    required: true // This is correct
  },
  landmark: {
    type: String,
    required: true // This is correct
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
