if (Meteor.isClient) {
	Meteor.startup( function() {
		Reveal.initialize({
		});			
	});


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}