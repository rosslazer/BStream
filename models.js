var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/oven');
var Schema = mongoose.Schema;

function toLower (v) {
  return v.toLowerCase();
}

//TODO: Hash password
var UserSchema = new Schema({
    username  :  String, 
    password : String,
    email : { type: String, set: toLower },
    role: { type: String, enum: ['user','professor','admin'], default: 'user'}
});




var RoomSchema = new Schema({

    name  :  String, 
    room : String,
		floor: String,
    building : String,
    id: String,
    lastused  :  Date,
		viewerConnected : Boolean,
		inUse : Boolean,
		latitude : Number,
		longitude: Number
		});





exports.User = mongoose.model('User', UserSchema);
exports.Room = mongoose.model('Room', RoomSchema);






/*
exports.createUser = function(un, pwd, em, rl) {
    var newuser = new User({username: un, password: pwd, email: em, role: rl});
    newuser.save(function (err, obj) {
        if (err) return console.error(err);
    });
}



exports.getAll = function() {
    User.find(function (err, user) {
  if (err) return console.error(err);
  console.log(user)
});
}

exports.authUser = function(un, pwd, done) {
    var query  = User.findOne({ username: un, password: pwd });


    return query.exec(function (err, user) {
      if (err) return handleError(err);
      if(user) {
        done(true);
      }
      else {
        done(false);
      }
    })




}*/
