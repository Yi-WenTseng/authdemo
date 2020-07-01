'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var answerSchema = Schema( {
  author:ObjectId,
  date:Date,
  questionID:ObjectId,
  answer:String
} );

module.exports = mongoose.model( 'AnswerYT', answerSchema );
