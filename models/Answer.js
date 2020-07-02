'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var answerSchema = Schema( {
  author:String,
  date:Date,
  question:ObjectId,
  answer:String
} );

module.exports = mongoose.model( 'AnswerYT', answerSchema );
