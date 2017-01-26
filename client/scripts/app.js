// YOUR CODE HERE:
var app = {

  server : 'https://api.parse.com/1/classes/messages',
  username : 'anonymous',
  roomname: 'lobby',
  messages : [],

  init : function () {
    // determine the username
    app.username = window.location.search.substr(10);

    //Cache jquery selections
    app.$message = $('#message');
    app.$message = $('#message');
    app.$roomSelect = $('#roomSelect');
    app.$send = $('#send');
  },

  send: function(message){
    $.ajax({
      url: app.server,
      method: 'POST',
      data: JSON.stringify(message),
      success: function(){
        console.log("Message posted successfully")
      },
      error: function(){
        ("Error posting message")
      }
    })
  },

  fetch: function(){
    $.ajax({
      url: app.server,
      method: 'GET',
      success: function(data){
        console.log("Data has been gotten")
      },
      error: function(){

      }
    })
  }

};