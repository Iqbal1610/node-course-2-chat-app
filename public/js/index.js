var socket=io();
 socket.on('connect',function(){
  console.log('connected to server');
  // socket.emit('createEmail',{
  //   to:'jen@example.com',
  //   text:'Hey.This is Auto.'
  // });
// socket.emit('createMessage',{
//   from:'Andrew',
//   rext:'Yup.that works for me'
// });

});

socket.on('disconnect',function(){
  console.log('Disconnected from server');
});

// socket.on('newEmail',function(email){
//   console.log('New email',email);
// });

socket.on('newMessage',function (message) {
 var formatedTime=moment(message.createdAt).format('h:mm a');
var template=jQuery('#message-template').html();
var html=Mustache.render(template,{
  text:message.text,
  from:message.from,
  createdAt:formatedTime
});
jQuery('#messages').append(html);



  //console.log('newMessage',message);
 //var formatedTime=moment(message.createdAt).format('h:mm a');
//   var li=jQuery('<li></li>');
//   li.text(`${message.from} ${formatedTime}: ${message.text}`);
//   jQuery('#messages').append(li);
});

socket.on('newLocationMessage',function(message){

var formatedTime=moment(message.createdAt).format('h:mm a');
var template=jQuery('#location-message-template').html();
var html=Mustache.render(template,{
  url:message.url,
  from:message.from,
  createdAt:formatedTime
});
jQuery('#messages').append(html);


  // var li= jQuery('<li></li>');
  // var a=jQuery('<a target="_blank">My current location</a>');
  //
  // li.text(`${message.from} ${formatedTime}: `);
  // a.attr('href',message.url);
  // li.append(a);
  // jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit',function(e){
  e.preventDefault();

var messageTextbox=jQuery('[name=message]');
  socket.emit('createMessage',{
    from:'User',
    text:messageTextbox.val()
  },function(){
   messageTextbox.val('')
  });
});

var locationButton=jQuery('#send-location');

locationButton.on('click',function(){
   if(!navigator.geolocation){
     return alert('Geolocation is not supported by your browser.');
   }
locationButton.attr('disabled','disabled').text('sending location...');

navigator.geolocation.getCurrentPosition(function(position){
  locationButton.removeAttr('disabled').text('sending location...');
socket.emit('createLocationMessage',{
  latitude:position.coords.latitude,
  longitude:position.coords.longitude
});

},function(){
  locationButton.removeAttr('disabled').text('sending location...');
  alert('Unable to fetch location');
});

});
