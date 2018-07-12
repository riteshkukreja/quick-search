const notifier = require('electron-notifications');

var app = {};

app.isNotificationSupported = function() {
	return (typeof Notification != "undefined" && Notification != null);
}

app.notify = function(title, body, icon) {
	const notification = notifier.notify(title, {
		  message: body,
		  icon: icon,
		  //duration: 5000,
		  flat: true,
		  vertical: false
	});

	notification.on('clicked', () => {
	  //notification.close()
	});
}

module.exports = app;