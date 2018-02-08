var express = require("express");
var socket = require("socket.io");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// APP SET UP
var app = express();
var server = app.listen(9229,function(){
   console.log('this is from port 9229');
});

//static files
app.use(express.static('public'));

//socket setup
var io = socket(server);
io.on('connection',function(socket){
   console.log('made socket connection',socket.id);
   socket.on('ref',function(data){
       MongoClient.connect(url, function(err, db) {
           if (err)
               throw err;
           var dbo = db.db("chat");
           dbo.collection("message").find().toArray(function(err, result) {
               if (err)
                  throw err;
               io.sockets.emit('ref',result);
               db.close();
           });
       });
   });

   socket.on('chat',function(data){
       MongoClient.connect(url, function(err, db) {
           if (err)
              throw err;
           var dbo = db.db("chat");
           var myobj = { user: data.handle,msg:data.message};
           dbo.collection("message").insertOne(myobj, function(err, res) {
               if (err)
                  throw err;
               console.log("1 document inserted");
               db.close();
           });
       });
      io.sockets.emit('chat',data);
   });

   socket.on('typing',function(data){
      socket.broadcast.emit('typing',data);
   });
}) ;