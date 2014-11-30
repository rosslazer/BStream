 var md = require('./models');
 var t = md.authUser('admin','timber', function(done) {console.log("THe var is " + done);});

 t == true;