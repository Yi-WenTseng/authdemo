'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var questionSchema = Schema( {
  subject:String,
  author:ObjectId,
  date:Date,
  question:String,
  answer:[{type:Schema.Types.ObjectId, ref:"User"}]
} );

module.exports = mongoose.model( 'QuestionYT', questionSchema );
