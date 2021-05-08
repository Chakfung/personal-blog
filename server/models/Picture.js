const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: { type: String },
  src: { type: String }
})

module.exports = mongoose.model('Picture', schema)