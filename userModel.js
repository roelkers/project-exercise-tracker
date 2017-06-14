'use strict'

const mongoose = require('mongoose');
const shortid = require('shortid');

let userPrototype = mongoose.Schema({
  _id:{
      type: String,
      'default': shortid.generate
  },
  name:  String
});

let userModel = mongoose.model('user',userPrototype);

module.exports = userModel;
