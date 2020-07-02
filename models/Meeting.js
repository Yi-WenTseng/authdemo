'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var meetingSchema = Schema( {
  author:ObjectId,
  meeting:String,
  name:String,
  date:String,
  link:String,
  detail:String
});

module.exports = mongoose.model( 'MeetingYT', meetingSchema );
