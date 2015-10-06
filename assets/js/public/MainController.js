angular.module('HomeTown').controller('MainController', function($scope, $http, $filter) {
	// allows us to dynamically set the map height (100% css height doesn't work)
	$scope.window.height = window.innerHeight;

	//TODO dummy map object and marker (coordinates for 230 E Girard Ave Philadelphia, PA 19125)
	$scope.map = { 
		center: { 
			latitude: 39.9523882, 
			longitude: -75.1640233 
		}, 
		zoom: 14 
	};
	$scope.marker = {
		idKey: '0000', //TODO this needs to be unique
		coords: {
			latitude: 39.9691568, 
			longitude: -75.1327133
		}
	};

	//region deals dummy maps
	$scope.dealNE = {};
	$scope.dealNW = {};
	$scope.dealSE = {};
	$scope.dealSW = {};

	$scope.dealNE.map = { 
		center: { 
			latitude: 39.9694272, 
			longitude: -75.1320518 
		}, 
		zoom: 15 
	};
	$scope.dealNE.marker = {
		idKey: '0000', //TODO this needs to be unique
		coords: {
			latitude: 39.9694272, 
			longitude: -75.1320518
		}
	};
	$scope.dealNW.map = { 
		center: { 
			latitude: 39.9692226,
			longitude: -75.1363571 
		}, 
		zoom: 15 
	};
	$scope.dealNW.marker = {
		idKey: '0000', //TODO this needs to be unique
		coords: {
			latitude: 39.9692226, 
			longitude: -75.1363571
		}
	};
	$scope.dealSE.map = { 
		center: { 
			latitude: 39.9690635, 
			longitude: -75.1343178 
		}, 
		zoom: 15 
	};
	$scope.dealSE.marker = {
		idKey: '0000', //TODO this needs to be unique
		coords: {
			latitude: 39.9690635, 
			longitude: -75.1343178
		}
	};
	$scope.dealSW.map = { 
		center: { 
			latitude: 39.9668116, 
			longitude: -75.1391375 
		}, 
		zoom: 15 
	};
	$scope.dealSW.marker = {
		idKey: '0000', //TODO this needs to be unique
		coords: {
			latitude: 39.9668116, 
			longitude: -75.1391375
		}
	};
	//endregion deals dummy maps

	//TODO Dummy weather API call.. will move into service layer (using lat long for 230 E Girard Ave, Philadelphia, PA 19125 according to Google maps)
	$http.get('/weather/current?lat=39.9691568&long=-75.1327133') //https://api.forecast.io/forecast/f0f643b626c0788853800bcc4570696a/39.9691568,-75.1327133
     .success(function(response){
     	var forecast = response.hourly.data;
     	
     	for(var i=0; i<forecast.length; i++) {
     		forecast[i].time = new Date(forecast[i].time * 1000);
     	}

     	$scope.forecast = forecast;
     });

     //dummy Eventful API call
     /*$http.get('/events/list?app_key=Lqg82zJw6bv2bDG7&location=Philadelphia')
     	.success(function(response) {
     		debugger;
     	});*/

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