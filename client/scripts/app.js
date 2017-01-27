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
       app.$send.on('submit', app.handleSubmit);
       app.$roomSelect.on('change', app.handleRoomChange);

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
    //Clear message input box
    app.$message.val('')
          //if successful, trigger a fetch to update with new messages
         console.log("Message was posted to the server");
         //get new messages now
         app.fetch()
     },
     error: function() {
         console.log("Error posting message");
     }
    });
   },

   fetch: function() {
    //data property can be ordered in desc order
   $.ajax({
       url: app.server,
       type: 'GET',
       data:  { order: '-createdAt'},
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
            app.renderRoomList(app.messages);
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
     $username.text(message.username + ": ").appendTo($chat);

     var $message = $('<br><span>' + message.text + '</span>');
     $message.text(message.text).appendTo($chat);
     //Add the message to the UI
     app.$chats.append($chat);
   },

   handleSubmit: function(event){
    console.log("inside handle submit");
    //Set up proper message template and then stringify in data
    var message = {
      username: app.username,
      text: app.$message.val(),
      roomname: app.roomname || 'lobby'
     }

    app.send(message)
    //Prevents browser's default behavior
    event.preventDefault();
   },

   renderRoomList: function(messagesArray){
    //iterate thoruhg messages and add an option element ofr each one to  our drop down menu
    app.$roomSelect.html('<option value="__newRoom">New Room...</option></select>')

    if(messagesArray) {
      var rooms = {};
      messagesArray.forEach(function(message){
        //render room option in each message to menu
        var roomname = message.roomname;
        //if there is a roomname and if it doesn't exist already
        if(roomname && !rooms[roomname]) {
          app.renderRoom(roomname);

          rooms[roomname] = true;
        }
      })
    }
    app.$roomSelect.val(app.roomname);
   },

   renderRoom: function(roomname) {
    //create option and add it to room select
    //prevent cross site scripting by escaping with DOM methods
    var $option = $('<option />').val(roomname).text(roomname);

    //Add to select
    app.$roomSelect.append($option)

    //Select elements emit a change event whenever the room is changed

   },

   handleRoomChange: function(event) {
    var selectIndex = app.$roomSelect.prop('selectedIndex');

    if(selectIndex  === 0) {
      //create a new room
      var roomname = prompt('Enter room name');
      if(roomname) {
        app.roomname = roomname;
        app.renderRoom(roomname);
        app.$roomSelect.val(roomname)
      }
    } else {
      //change to existing room
      app.roomname = app.$roomSelect.val()
    }
    app.renderMessage(app.messages);
   }

  };

