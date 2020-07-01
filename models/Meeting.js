'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var meetingSchema = Schema( {
  host:ObjectId,
  meeting:String,
  pin:Number,
  name:String,
  date:String,
  link:String,
} );

module.exports = mongoose.model( 'MeetingYT', meetingSchema );
