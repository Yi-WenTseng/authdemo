'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var questionSchema = Schema( {
  meeting:ObjectId,
  subject:String,
  author:ObjectId,
  date:Date,
  question:String
} );

module.exports = mongoose.model( 'QuestionYT', questionSchema );
