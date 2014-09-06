$(document).ready(function () {

var myObj = { counter: 0 };

	$("#messageList").scrollTop($("#messageList")[0].scrollHeight);
	var currentURL;
  var usersname = "a";
	chrome.tabs.getSelected(null, function(tab) {

	currentURL = tab.url;
	currentURL = currentURL.split("/");
	if(currentURL[2] != "ctools.umich.edu")
	{
		$("body").html("GO TO CTOOLS");
	}
	currentURL = currentURL.pop();
	currentURL = currentURL.split("-");
	currentURL = currentURL.pop();

	var tabTitle = tab.title;
	tabTitle = tabTitle.split(":");
	tabTitle = tabTitle[1];
	helpme();

	//currentURL = currentURL.split("/").pop();
    document.getElementById('currentLink').innerHTML = tabTitle;
});

$("#nameButton").click(function(){


  usersname = $("#nameval").val();
  $("#nameval").val('');



});



// Initialize the PubNub API connection.
function helpme(){
var pubnub = PUBNUB.init({
publish_key: 'pub-c-8d1214a7-d292-4698-a0bc-458e5b7bf996',
subscribe_key: 'sub-c-f02d84f8-357b-11e4-afa1-02ee2ddab7fe'

});
 
   function PubNub() {
    this.publishKey = 'pub-c-8d1214a7-d292-4698-a0bc-458e5b7bf996';
    this.subscribeKey = 'sub-c-f02d84f8-357b-11e4-afa1-02ee2ddab7fe';
    this.subscriptions = localStorage["pn-subscriptions"] || [];

    if(typeof this.subscriptions == "string") {
      this.subscriptions = this.subscriptions.split(",");
    }
    this.subscriptions = $.unique(this.subscriptions);
  }

  PubNub.prototype.connect = function(username) {
    this.username = username;
    this.connection = PUBNUB.init({
      publish_key: this.publishKey,
      subscribe_key: this.subscribeKey,
      uuid: this.username
    });
  };

  PubNub.prototype.addSubscription = function(channel) {
    this.subscriptions.push(channel);
    this.subscriptions = $.unique(this.subscriptions);
  };

  PubNub.prototype.removeSubscription = function(channel) {
    if (this.subscriptions.indexOf(channel) !== -1) {
      this.subscriptions.splice(this.subscriptions.indexOf(channel), 1);
    }
    this.saveSubscriptions();
  };

  PubNub.prototype.saveSubscriptions = function() {
    localStorage["pn-subscriptions"] = this.subscriptions;
  };

  PubNub.prototype.subscribe = function(options) {
    this.connection.subscribe.apply(this.connection, arguments);
    this.addSubscription(options.channel);
    this.saveSubscriptions();
  };

  PubNub.prototype.unsubscribe = function(options) {
    this.connection.unsubscribe.apply(this.connection, arguments);
  };

  PubNub.prototype.publish = function() {
    this.connection.publish.apply(this.connection, arguments);
  };

  PubNub.prototype.history = function() {
    this.connection.history.apply(this.connection, arguments);
  };





// Grab references for all of our elements.
var messageContent = $('#messageContent'),
sendMessageButton = $('#sendMessageButton'),
messageList = $('#messageList');

// Handles all the messages coming in from pubnub.subscribe.
function handleMessage(message) {
var messageEl = $("<li class='message'>"
+ "<span class='username'>" + message.username + ": </span>"
+ message.text + "</li>");


messageEl.css("backgroundColor", getRandomColor(myObj));
messageList.append(messageEl);
messageList.listview('refresh');


$("#messageList").scrollTop(($("#messageList")[0].scrollHeight));


 
// Scroll to bottom of page
 $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 'slow');
};
 
// Compose and send a message when the user clicks our send message button.

var chatChannel = currentURL, 
chatRoomName = $('#chatRoomName'),
charListEl = $('#chatList'),
subscriptions = [],
pages = {
chatList: $("#chatListPage"),
chat: $("#chatPage")
};


sendMessageButton.click(function (event) {

var message = messageContent.val();
 
if (message != '') {
pubnub.publish({
channel: chatChannel,
message: {
username: usersname,
text: message
}
});
 
messageContent.val("");


}
});
 
// Also send a message when the user hits the enter button in the text area.
messageContent.bind('keydown', function (event) {
if((event.keyCode || event.charCode) !== 13) return true;
sendMessageButton.click();
return false;
});
 
// Subscribe to messages coming in from the channel.
pubnub.subscribe({
channel: chatChannel,
message: handleMessage
});
 

pubnub.history({
channel: chatChannel,
limit: 100
}, function (messages) {
messages = messages[0];
messages = messages || [];
 
for(var i = 0; i < messages.length; i++) {
handleMessage(messages[i], false);
}
 
});

};
function getRandomColor(obj) {


    var colors = new Array('#F7C2AB', '#F7F4AD', '#96D6CE', '#8A8DDB', '#A06FBF');
    //var holder = Math.floor(Math.random() * 4);
    var temp = colors[obj.counter];
    obj.counter = obj.counter + 1;
    if(obj.counter == 5)
    {
      obj.counter = 0;
    }
    /*while($(".message.last").css("backgroundColor") == temp)
    {
      holder = Math.floor(Math.random() * 4);
      temp = colors[holder];
    }*/

    return temp;

   /* var letters = 'ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 6)];
    }
    return color;*/
}

});