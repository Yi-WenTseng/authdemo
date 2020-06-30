'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var meetingSchema = Schema( {
  name:String,
  date:String,
  link:String
} );

module.exports = mongoose.model( 'MeetingYT', meetingSchema );
