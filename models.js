var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/oven');
var Schema = mongoose.Schema;


var User = new Schema({
    username  :  String, 
    password : String,
    email : { type: String, set: toLower },
    role: { type: String, enum: ['user','professor','admin'], default: 'user'}
});



var Device = new Schema({
    name  :  String, 
    room : String,
    building : String,
    id: String,
    inUse: Boolean,
    lastused  :  Date
});