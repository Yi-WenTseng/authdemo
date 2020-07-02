'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var questionSchema = Schema( {
  meeting:ObjectId,
  subject:String,
  author:ObjectId,
  name:String,
  date:Date,
  question:String,
  answers:[{type:Schema.Types.ObjectId, ref:"Answer"}]
} );

module.exports = mongoose.model( 'QuestionYT', questionSchema );
