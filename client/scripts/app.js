// YOUR CODE HERE:
//https://api.parse.com/1/classes/chatterbox
if (!/(&|\?)username=/.test(window.location.search)) {
  var newSearch = window.location.search;
  if (newSearch !== '' & newSearch !== '?') {
    newSearch += '&';
  }
  newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
}

var app = {
  init: function(){
    $("#roomadd").submit(function(e){
      e.preventDefault();
      app.handleRoomSubmit();
    }); 
    $(".users").change(function(e){
      e.preventDefault();
      app.navToFriend();
    });
    $("#send").submit(function(e){
      e.preventDefault();
      app.handleSubmit();
    });  
    $("#roomSelect").change(function(e){
      e.preventDefault();
      app.navToRoom()
    });
    app.fetch();
  },
  server: 'http://127.0.0.1:3000/classes/messages',
  send: function(message){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'text/plain',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },
  fetch: function(){
    $.ajax({
      url: app.server,
      type: 'GET',
      // data: 'text/plain',
      contentType: 'text/plain',
      success: function (data) {
        app.args = JSON.parse(data).results;
        //console.log(app.args)
      },
      error: function (data) {
        console.error('chatterbox: Failed to retrieve');
      }
    });
  },
  userList: {},
  objIdList: {},
  roomList: {},
  addMessage: function(message){
    if(app.objIdList[message.objectId] === undefined &&
                      message.username !== undefined &&
                          message.text !== undefined &&
                      message.roomname !== undefined){
      var name = app.rejector(message.username);
      var post = app.rejector(message.text);
      var room = app.rejector(message.roomname)
      var $chatbox = $('<div class="chatbox '+room+ ' ' + name + '"></div>');
      $chatbox.append('<div class="'+name+'">'+name+' :</div>');
      $chatbox.append('<div class="message">'+post+'</div>');
      $chatbox.append('<div class="'+room+'">'+room+'</div>');
      $('#chats').prepend($chatbox);
      // if(app.userList[name] === undefined && name !== undefined ){  
      //   $('.users').append('<option value='+name+'>'+name+'</option>')
      //   app.userList[name] = name;
      // }
      app.addRoom(room);
      app.addFriend(name);
      app.objIdList[message.objectId] = message.objectId;
    }    // $(".username").on( "click", function(){app.addFriend()} );
  },

  addRoom: function(roomName){
    if(roomName && app.roomList[roomName] === undefined){
      $("#roomSelect").append('<option value='+roomName+'>'+ roomName +'</option>');
      app.roomList[roomName] = roomName;
    }
  },

  addFriend: function(name){
    if(app.userList[name] === undefined && name !== undefined ){  
        $('.users').append('<option value='+name+'>'+name+'</option>')
        app.userList[name] = name;
      }
  },
  handleSubmit: function(e){
    var message = {};
    message.objectId = Math.floor(Math.random() * 10000000); 
    message.username = window.location.search.split('=')[1];
    message.text = $("#message").val();
    message.roomname = $("#roomSelect").val();
    app.send(message)
    $("#message").val('Message');
  },
  clearMessages: function(){
    var myNode = document.getElementById("chats");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
  },
  rejector: function(string){
    return string.replace(/[<>&%*+^$;{}()|[\]\\]/g, "");
  },

  navToRoom: function(){
    var room = $('#roomSelect').val();
    $(".chatbox").show();
    if(room !== 'All'){
      $(".chatbox").not("."+room).hide();
    }
  },
  
  navToFriend: function(){
    var friend = $('.users').val();
    $(".chatbox").show();
    if(friend !== 'choose'){
      $(".chatbox").not("."+friend).hide();
    }
  },

  handleRoomSubmit: function() {
    //get input
    var newRoom = $("#newroom").val();
    //call add room with input
    app.addRoom(newRoom);
    $("#newroom").val('Add a Room');
  }

}
// var userList = {},

app.init();
setInterval(function(){
    app.fetch();
    for(var i = 0; i<app.args.length; i++){
      app.addMessage(app.args[i]);
    }
  }, 500)



