$(document).ready(function () {

	chrome.tabs.getSelected(null, function(tab) {

	var currentURL = tab.url;
	currentURL = currentURL.split("/");
	if(currentURL[2] != "ctools.umich.edu")
	{
		$("body").html("GO TO CTOOLS");
	}
	currentURL = currentURL.pop();
	//currentURL = currentURL.split("/").pop();
    document.getElementById('currentLink').innerHTML = currentURL;
});



// Initialize the PubNub API connection.
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
+ message.text
+ "</li>");
messageList.append(messageEl);
messageList.listview('refresh');

 
// Scroll to bottom of page
// $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 'slow');
};
 
// Compose and send a message when the user clicks our send message button.
sendMessageButton.click(function (event) {
var message = messageContent.val();
 
if (message != '') {
pubnub.publish({
channel: 'chat',
message: {
username: 'test',
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
channel: "chat",
message: handleMessage
});


var chatChannel = "chat",
chatRoomName = $('#chatRoomName'),
charListEl = $('#chatList'),
subscriptions = [],
pages = {
chatList: $("#chatListPage"),
chat: $("#chatPage")
};
 

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

});