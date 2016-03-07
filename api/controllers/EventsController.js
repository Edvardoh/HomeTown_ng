/**
 * EventsController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	google: function(req, res) {
		console.log('/events/googleEvents');

		var params = req.params.all();
		var days = parseInt(params.days);

		var fs = require('fs');
		var readline = require('readline');
		var google = require('googleapis');
		var googleAuth = require('google-auth-library');

		// If modifying these scopes, delete your previously saved credentials
		// at ~/.credentials/calendar-nodejs-quickstart.json
		var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
		var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
		    process.env.USERPROFILE) + '/.credentials/';
		var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

		// Load client secrets from a local file.
		fs.readFile('client_secret.json', 'utf8', function processClientSecrets(err, content) {
		  if (err) {
		    console.log('Error loading client secret file: ' + err);
		    return;
		  }

		  // Authorize a client with the loaded credentials, then call the
		  // Google Calendar API.
		  authorize(JSON.parse(content), listEvents);
		});

		/**
		 * Create an OAuth2 client with the given credentials, and then execute the
		 * given callback function.
		 *
		 * @param {Object} credentials The authorization client credentials.
		 * @param {function} callback The callback to call with the authorized client.
		 */
		function authorize(credentials, callback) {
		  var clientSecret = credentials.web.client_secret;
		  var clientId = credentials.web.client_id;
		  var redirectUrl = credentials.web.redirect_uris[0];
		  var auth = new googleAuth();
		  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

		  // Check if we have previously stored a token.
		  fs.readFile(TOKEN_PATH, function(err, token) {
		    if (err) {
		      console.log(err);
		    } else {
		      oauth2Client.credentials = JSON.parse(token);
		      callback(oauth2Client);
		    }
		  });
		}

		/**
		 * Lists the next 10 events on the user's primary calendar.
		 *
		 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
		 */
		function listEvents(auth) {
		  var calendar = google.calendar('v3');
		  var today = new Date();
		  var maxDate = new Date();
		  
		  maxDate.setDate(today.getDate() + days);

		  calendar.events.list({
		    auth: auth,
		    calendarId: 'pqd50uuaupt9jmp3mc2gh82jdg@group.calendar.google.com',
		    timeMin: today.toISOString(),
		    timeMax: maxDate.toISOString(),
		    singleEvents: true,
		    orderBy: 'startTime'
		  }, function(err, response) {
			    if (err) {
			      console.log('The API returned an error: ' + err);
			      return;
			    }
			    // send events as an array
			    res.send(response.items);
			});
		}
	},

	//Eventful
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

