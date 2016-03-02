angular.module('HomeTown').controller('MainController', function($scope, $http, $filter, uiGmapIsReady) {
	//TODO dummy map object and marker (coordinates for 230 E Girard Ave Philadelphia, PA 19125)
	
	uiGmapIsReady.promise(1).then(function(instances) {
		// note direction service cannot process TRANSIT requests with multiple waypoints, need to break up into multiple requests
        instances.forEach(function(inst) {
            var map = inst.map,
				directionsService = new google.maps.DirectionsService(),
				request1 = {
					origin: '1421 N Howard St, Philadelphia, PA',
					destination: '126 Elfreths Alley, Philadelphia, PA 19106',
					travelMode: google.maps.TravelMode.TRANSIT
				},
				request2 = {
					origin: '126 Elfreths Alley, Philadelphia, PA 19106',
					destination: '520 Chestnut St, Philadelphia, PA 19106',
					waypoints: [{
						location: '6th St & Market St, Philadelphia, PA 19106', //liberty bell
						stopover: true
					}],
					optimizeWaypoints: true,
					travelMode: google.maps.TravelMode.WALKING
				};
			directionsDisplay1 = new google.maps.DirectionsRenderer({
				map: map,
				suppressMarkers: true
			});
			directionsDisplay2 = new google.maps.DirectionsRenderer({
				map: map,
				suppressMarkers: true
			});

			directionsService.route(request1, function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {
		      		directionsDisplay1.setDirections(result);
		    	}
			});
			directionsService.route(request2, function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {
		      		directionsDisplay2.setDirections(result);
		    	}

		    	//add markers
	      		var route = result.routes[0],
	      		marker = new google.maps.Marker({
      				position: route.legs[0].start_location,
      				map: map,
      				icon: icon
      			}),
      			icon = 'images/icons/icn-eye.svg';


	      		for(var i=0; i<route.legs.length; i++) {
	      			marker = new google.maps.Marker({
	      				position: route.legs[i].end_location,
	      				map: map,
	      				icon: icon
	      			});
	      		}
			});
        });
    });

	$scope.map = { 
		center: { 
			latitude: 39.972530, 
			longitude: -75.135993 
		}, 
		zoom: 15,
		options: {
			disableDefaultUI: true,
			zoomControl: true
		}
	};
	$scope.home = {
		idKey: '0000', //TODO this needs to be unique
		coords: {
			latitude: 39.972530, 
			longitude: -75.135993
		},
		options: {
			icon: 'images/icons/icn-home.svg'
		}
	};
	$scope.poi1 = {
		idKey: '0001', //TODO this needs to be unique
		coords: {
			latitude: 39.971129, 
			longitude: -75.134159
		},
		options: {
			icon: 'images/icons/icn-briefcase.svg'
		}
	};
	$scope.poi2 = {
		idKey: '0002', //TODO this needs to be unique
		coords: {
			latitude: 39.966512, 
			longitude: -75.129990
		},
		options: {
			icon: 'images/icons/icn-eye.svg'
		}
	};
	$scope.c1 = {
		center: {
			latitude: 39.972530, 
			longitude: -75.135993
		},
		radius: 335, // average 5 minute walk in meters
		stroke: {
            color: '#2196F3',
            weight: 1,
            opacity: 0.8
        },
        fill: {
            color: '#2196F3',
            opacity: 0.1
        }
	};
	$scope.c2 = {
		center: {
			latitude: 39.972530, 
			longitude: -75.135993
		},
		radius: 670, // average 10 minute walk in meters
		stroke: {
            color: '#4CAF50',
            weight: 1,
            opacity: 0.8
        },
        fill: {
            color: '#4CAF50',
            opacity: 0.1
        }
	};
	$scope.c3 = {
		center: {
			latitude: 39.972530, 
			longitude: -75.135993
		},
		radius: 995, // average 15 minute walk in meters
		stroke: {
            color: '#FF9800',
            weight: 1,
            opacity: 0.8
        },
        fill: {
            color: '#FF9800',
            opacity: 0.1
        }
	};


/*
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
     $http.get('/events/list?app_key=Lqg82zJw6bv2bDG7&location=Philadelphia')
     	.success(function(response) {
     		debugger;
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
*/
});