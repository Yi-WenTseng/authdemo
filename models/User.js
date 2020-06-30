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
  meetings:[{type:Schema.Types.ObjectId, ref:"Meeting"}],
  questions:[{type:Schema.Types.ObjectId,ref:"Question"}]
} );

module.exports = mongoose.model( 'UserYT', userSchema );
