angular.module('HomeTown').controller('MainController', function($scope, $http, $filter) {

	//TODO Dummy weather API call.. will move into service layer (using lat long for 230 E Girard Ave, Philadelphia, PA 19125 according to Google maps)
	$http.get('/weather/current?lat=39.9691568&long=-75.1327133') //https://api.forecast.io/forecast/f0f643b626c0788853800bcc4570696a/39.9691568,-75.1327133
     .success(function(response){
     	var forecast = response.hourly.data;
     	
     	for(var i=0; i<forecast.length; i++) {
     		forecast[i].time = new Date(forecast[i].time * 1000);
     	}

     	$scope.forecast = forecast;
     });

	//TODO temporary dummy data
	$scope.showsList = [{
		artist: 'SOJA',
		city: 'Philadelphia',
		venue: 'Festival Pier',
		day: 'Today',
		time: '8 PM',
		ticketURL: 'http://ticketmaster.com'
	},{
		artist: 'Green Velvet',
		city: 'Philadelphia',
		venue: 'Dolphin Tavern',
		day: 'Today',
		time: '10 PM',
		ticketURL: 'http://ticketmaster.com'
	},{
		artist: 'Bon Jovi',
		city: 'Philadelphia',
		venue: 'Wells Fargo Center',
		day: 'Tomorrow',
		time: '6 PM',
		ticketURL: 'http://ticketmaster.com'
	},{
		artist: 'Asterisk',
		city: 'Philadelphia',
		venue: 'Medusa Lounge',
		day: 'Tuesday',
		time: '10 PM',
		ticketURL: 'http://ticketmaster.com'
	},{
		artist: 'The Weekend',
		city: 'Philadelphia',
		venue: 'Undergrouund Arts',
		day: 'Wednesday',
		time: '8 PM',
		ticketURL: 'http://ticketmaster.com'
	},{
		artist: 'DJ Harry Potter',
		city: 'Philadelphia',
		venue: 'Coda',
		day: 'Wednesday',
		time: '10 PM',
		ticketURL: 'http://ticketmaster.com'
	}];

});