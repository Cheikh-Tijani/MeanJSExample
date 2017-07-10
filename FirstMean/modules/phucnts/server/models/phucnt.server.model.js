'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Phucnt Schema
 */
var PhucntSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Phucnt name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Phucnt', PhucntSchema);
