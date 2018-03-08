var socket=io();


function scrollToBottom(){
  //selectors
var messages=jQuery('#messages');
var newMessage=messages.children('li:last-child');
//heights
var clientHeight=messages.prop('clientHeight');
var scrollTop=messages.prop('scrollTop');
var scrollHeight=messages.prop('scrollHeight');
var newMessageHeight=newMessage.innerHeight();
var lastMessageHeight=newMessage.prev().innerHeight();

if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight){
messages.scrollTop(scrollHeight);
}
}



 socket.on('connect',function(){
  console.log('connected to server');
  var params=jQuery.deparam(window.location.search);
 socket.emit('join',params,function(err){
   if(err){
     alert(err);
     window.location.href='/'
   }else {
     console.log('No error');
   }
 })
});

socket.on('disconnect',function(){
  console.log('Disconnected from server');
});

// socket.on('newEmail',function(email){
//   console.log('New email',email);
// });

socket.on('updateUserList',function(users){
  var ol=jQuery('<ol></ol>');

  users.forEach(function(user){
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});


socket.on('newMessage',function (message) {
 var formatedTime=moment(message.createdAt).format('h:mm a');
var template=jQuery('#message-template').html();
var html=Mustache.render(template,{
  text:message.text,
  from:message.from,
  createdAt:formatedTime
});
jQuery('#messages').append(html);

scrollToBottom();

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

scrollToBottom();
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
