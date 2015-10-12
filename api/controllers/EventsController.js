/**
 * EventsController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	list: function(req, res) {
		console.log('/events/list');

		var params = req.params.all();
		var http = require('http');
		var options = {
	        host : 'api.eventful.com',
	        port : 80,
	        path : '/json/events/search?app_key=' + params.app_key + '&location=' + params.location,
	        method : 'GET'
	    };

	    var eventful_data = '';

	    var eventful_req = http.request(options, function(eventful_res) {
	    	console.log('inside http response function');
	    	console.log(eventful_res);
	    	
	    	eventful_req.on('error', function(e) {
	    		console.log(e.message);
	    	});

	    	eventful_req.on('data', function(chunk) {
	    		eventful_data += chunk;
	    	});

	    	eventful_req.on('end', function() {
	    		res.send(eventful_data);
	    	});
	    });
	}
};

