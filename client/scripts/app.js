  // YOUR CODE HERE:
var app = {

   server: 'https://api.parse.com/1/classes/messages',
   username: 'anonymous',
   roomname: 'lobby',
   messages: [],
   lastMessageId: 0,

   init: function() {
       // determine the username
       app.username = window.location.search.substr(10);

       //Cache jquery selections
       app.$message = $('#message');
       app.$chats = $('#chats');
       app.$roomSelect = $('#roomSelect');
       app.$send = $('#send');

       //Add listeners
       app.$send.on('submit', app.handleSubmit)

       //Fetch all messages when app starts up
       app.fetch();

       //Pull new messages
       // setInterval(function(){
       //  app.fetch()
       // }, 3000)
   },

   send: function(message) {
       $.ajax({
           url: app.server,
           type: 'POST',
           data: JSON.stringify(message),
           success: function() {
               console.log("this");
           },
           error: function() {
               console.log("Error posting message");
           }
       });
   },

   fetch: function() {
       $.ajax({
           url: app.server,
           type: 'GET',
           success: function(data) {
               console.log("Data has been gotten", data);
               //Don't do anything if we have nothing to work with
               if (!data.results || !data.results.length) {
                   return;
               }
               //Store messages for caching later
               app.messages = data.results;
               //Only bother updating the DOM if we have a new message
               var mostRecentMessage = app.messages[app.messages.length - 1];

               if (mostRecentMessage.objectId !== app.lastMessageId) {
                   app.renderMessages(app.messages)
               }
           },
           error: function(error) {
               console.log("Error fetching data")
           }
       });
   },

   renderMessages: function(arrayOfMessages) {
       //Clear old messages
       app.clearMessages()

       // for (var i = 0; i < app.arrayOfMessages.length; i++) {
       //     //Render each individual message
       //     app.renderMessage(messages[i]);
       //Refactor to use forEach
       arrayOfMessages.forEach(app.renderMessage);
   },

   clearMessages: function() {
       app.$chats.html('');
   },

   renderMessage: function(message) {
    //Create a div to hold the message
     var $chat = $('<div class="chat"/>');
     //Add in the message data
     var $username = $('<span class="username">' + message.username + '</span>');
     $username.appendTo($chat);

     var $message = $('<br><span>' + message.text + '</span>');
     $message.appendTo($chat);
     //Add the message to the UI
     app.$chats.append($chat);
   },

   handleSubmit: function(){
    console.log("inside handle submit")
    event.preventDefault();
   },

   renderRoom: function(){

   }

  };

