'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var meetingSchema = Schema( {
  name:String,
  participant:[{type:Schema.Types.Objected, ref:"User"}],
  date:String
} );

module.exports = mongoose.model( 'MeetingYT', meetingSchema );
