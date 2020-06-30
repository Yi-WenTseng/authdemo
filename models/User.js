'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

//var userSchema = mongoose.Schema( {any:{}})

var userSchema = Schema( {
  googleid: String,
  googletoken: String,
  googlename:String,
  googleemail:String,
  username:String,
  age:Number,
  imageURL: String,
  meeting:[{type:Schema.Types.ObjectId, ref:"Meeting"}],
  question:[{type:Schema.Types.ObjectId,ref:"Question"}]
} );

module.exports = mongoose.model( 'UserYT', userSchema );
