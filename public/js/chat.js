var socket = io(); //for initiate a request

  function scrollToBottom() {
    //selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop=messages.prop('scrollTop');
    var scrollHeight=messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight>= scrollHeight) {
      messages.scrollTop(scrollHeight);
    }
  }
  socket.on('connect', function () {
    console.log('connected to server');
    // socket.emit('createEmail',{
    //   to:'jen@example.com',
    //   text:'hey this is nikhil'
    // });

  //   socket.emit('createMessage',{
  //     from:'Himani',
  //     text:'I am fine'
  //   })
   });

  socket.on('disconnect',()=>{
    console.log('disconnected from server');
  });

  // socket.on('newEmail', function (email) {
  //   console.log('New Email',email);
  // });

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template,{
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();

  // //console.log('New Message',message);
  // var li = jQuery('<li></li>');
  // li.text(''+message.from+':'+formattedTime+':'+message.text);
  //
  // jQuery('#messages').append(li);
});

socket.on('newLocationMessage',function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template,{
    createdAt: formattedTime,
    from: message.from,
    url: message.url
  });

  jQuery('#messages').append(html);
  scrollToBottom();
  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">My Current Location</a>');
  // li.text(message.from+':'+formattedTime+':'+a.attr('href',message.url));
  // li.append(a);
  // jQuery('#messages').append(li);
});

// socket.emit('createMessage',{
//   from:'Frank',
//   text:'Hi'
// }, function (data) {
//   console.log('Got it',data);
// });

jQuery('#message-form').on('submit',function (e) {
  e.preventDefault();
  var messageTextBox = jQuery('[name=message]');
  socket.emit('createMessage',{
    from: 'User',
    text:messageTextBox.val()
  },function () {
    messageTextBox.val('');
  });
});

var locationButton= jQuery('#send-location');
locationButton.on('click',function() {
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser');
  }

  locationButton.attr('disabled','disabled').text('Sending location...');
  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage',{
      latitude:position.coords.latitude,
      longitude:position.coords.longitude
    });
  //console.log(position);
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('unable to fetch location');
  });
});
