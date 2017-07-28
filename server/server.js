const path = require('path'); //built in
const http = require('http'); // built in
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');
const {generateLocationMessage} =require('./utils/message');
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'../public');
// console.log(__dirname+'/../public');
// console.log(publicPath);

var app=express();
var server= http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));
io.on('connection',(socket)=>{
  console.log('New user connected');

  // socket.emit('newEmail', {
  //   from: 'nik@example.com',
  //   text:'Hey what is going on',
  //   createdAt:123
  // });
  //
  // socket.on('createEmail', (newEmail)=>{
  //   console.log('createEmail',newEmail);
  // })

// socket.emit('newMessage',{
//   from:'Nikhil',
//   text:'Hey how r u?',
//   createdAt: 123

socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));

socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));

socket.on('createMessage', (message,callback)=>{
  console.log('creatMessage',message);
  io.emit('newMessage',generateMessage(message.from,message.text));
  callback('This is from the server');
  // socket.broadcast.emit('newMessage',{
  // from: message.from,
  // text:message.text,
  // createdAt:new Date().getTime()
  // })
});

socket.on('createLocationMessage', (coords)=>{
  io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
});

  socket.on('disconnect',()=>{
    console.log('User was disconnected');
  })
});


server.listen(port,()=>{
  console.log('server is up on port port'+port);
})
