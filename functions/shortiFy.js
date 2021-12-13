const mongoose = require('mongoose')

const shortiFySchema = new mongoose.Schema({
  long: {
    type: String,
    required: true
  },
  short: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('ShortiFy', shortiFySchema);
