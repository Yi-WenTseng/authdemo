'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = Schema( {
  googleid: String,
  googletoken: String,
  googlename:String,
  googleemail:String,
  username:String,
  age:Number,
  imageURL: String,
  meetings:[{type:Schema.Types.ObjectId, ref:"Meeting"}]
} );

module.exports = mongoose.model( 'UserYT', userSchema );
