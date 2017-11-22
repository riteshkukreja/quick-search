const ResultService   = require("../services/ResultService");
const NotificationService   = require("../services/NotificationService");

var textarea = $("#search");
var resultArea = $("#results");

ResultService.bootstrap(resultArea, textarea);

$("body").on("keypress", (e) => {
	if(e.keyCode == 13) {
		let myNotification = new Notification('Browser Service', {
		  body: 'You have been redirected to your favourite browser for '
		});

		myNotification.onclick = () => {
		  console.log('Notification clicked');

		};
	}
	//NotificationService.notify("Browser Service", "You have been redirected to your favourite browser for ");
});
