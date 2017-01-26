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
        app.$message = $('#message');
        app.$roomSelect = $('#roomSelect');
        app.$send = $('#send');
    },

    send: function(message) {
        $.ajax({
            url: app.server,
            method: 'POST',
            data: JSON.stringify(message),
            success: function() {
                console.log("this");
            },
            error: function() {
                console.log("Error posting message");
            }
        })
    },

    fetch: function() {
        $.ajax({
            url: app.server,
            method: 'GET',
            success: function(data) {
                console.log("Data has been gotten", data);
                //Don't do anything if we have nothing to work with
                if (!data.results || !data.results.length) {
                    return;
                }
                //Store messages for caching later
                app.messages = data.results;
                //Only bother updating the DOM if we have a new message
                var mostRecentMessage = app.message[app.message.length - 1];

                if (mostRecentMessage.objectId !== app.lastMessageId) {
                    //clear dom
                    app.$chats.html('');

                    for (var i = 0; i < app.messages.length; i++) {
                        //Render each individual message
                        //Create a div to hold the message
                        var $chat = $('<div class="chat"/>');
                        //Add in the message data
                        var $username = $('<span class="username">' + app.messages[i].text + '</span>');
                        $username.appendTo($chat);

                        var $message = $('<br><span>' + app.messages[i].text + '</span>');
                        $message.appendTo($chat);
                        //Add the message to the UI
                        app.$chats.append($chat);

                    }
                }
            },
            error: function(error) {
                console.log("Error fetching data")
            }
        });
    }

};
