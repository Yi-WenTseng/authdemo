'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var questionSchema = Schema( {
  subject:String,
  author:ObjectId,
  date:Date,
  question:String,
  answer:[{type:Schema.Types.Objected, ref:"User"}],
} );

module.exports = mongoose.model( 'QuestionYT', questionSchema );
