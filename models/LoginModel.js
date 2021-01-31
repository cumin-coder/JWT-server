const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const LoginSchema = new Schema({
  name: String,
  password: Number | String
})

module.exports = mongoose.model('login', LoginSchema)
