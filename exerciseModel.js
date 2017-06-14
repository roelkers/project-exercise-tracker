'use strict'

const mongoose = require('mongoose');

const exercisePrototype = mongoose.Schema({
  uid : String,
  description: String,
  duration: Number,
  date: Date
})

const exerciseModel = mongoose.model('exercise',exercisePrototype);

module.exports = exerciseModel;
