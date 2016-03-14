angular.module('HomeTown').controller('MainController', [ '$scope', '$http', '$filter', '$uibModal',
	function($scope, $http, $filter, $uibModal) {
	//TODO dummy map object and marker (coordinates for 230 E Girard Ave Philadelphia, PA 19125)
	//region scope object definitions

	//TODO this is a big no-no but I can't access $http in the addPoi function so I'm attaching to $scope for now
	$scope.http = $http;

	$scope.map = { 
		center: { 
			latitude: 39.972530, 
			longitude: -75.135993 
		}, 
		zoom: 15,
		options: {
			disableDefaultUI: true,
			zoomControl: true,
			styles: [{
		        featureType: "poi",
		        elementType: "labels",
		        stylers: [
		              { visibility: "off" }
		        ]
			}]
		},
		control: {}
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
	$scope.events = [];
	$scope.markers = [];
	//endregion scope object definitions

	//region route definitions
	$scope.historicPhiladelphia = function(map) {
		//TODO really need to clean up markers to make route appear more seamless
		// note direction service cannot process TRANSIT requests with multiple waypoints, need to break up into multiple requests
		$scope.directionMarkers = {};
        var directionsService = new google.maps.DirectionsService(),
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
		$scope.directionsDisplay1 = new google.maps.DirectionsRenderer({
			map: map,
			suppressMarkers: true
		});
		$scope.directionsDisplay2 = new google.maps.DirectionsRenderer({
			map: map,
			suppressMarkers: true
		});

		directionsService.route(request1, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
	      		$scope.directionsDisplay1.setDirections(result);
	    	}
		});
		directionsService.route(request2, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
	      		$scope.directionsDisplay2.setDirections(result);
	    	}

	    	//add markers
      		var route = result.routes[0],
      		icon = 'images/icons/icn-eye.svg';
      		$scope.directionMarkers.marker0 = new google.maps.Marker({
  				position: route.legs[0].start_location,
  				map: map,
  				icon: icon
  			});

      		for(var i=0; i<route.legs.length; i++) {
      			$scope.directionMarkers['marker' + i+1] = new google.maps.Marker({
      				position: route.legs[i].end_location,
      				map: map,
      				icon: icon
      			});
      		}
		});
    };
	//endregion route definitions

	//region map circle toggle
	$scope.walkRadiusVisibile5min = false;
	$scope.walkRadiusVisibile10min = false;
	$scope.walkRadiusVisibile15min = false;

	$scope.parentWalkRadiusClick = function() {
		//first make all other detail panels invisible
		$scope.mapMarkerDetailsVisibility = 'invisible';
		$scope.routeToggleDetailsVisibility = 'invisible';
		$scope.settingsPanelVisibility = 'invisible';

		if($scope.walkRadiusDetailsVisibility == 'visible') {
			$scope.walkRadiusDetailsVisibility = 'invisible';
		} else {
			$scope.walkRadiusDetailsVisibility = 'visible';
		}
	};
	$scope.walkRadius5minSelect = function() {
		if($scope.walkRadiusVisibile5min) {
			$scope.walkRadiusVisibile5min = false;
			$scope.selected5min = 'unselected';
		} else {
			$scope.walkRadiusVisibile5min = true;
			$scope.selected5min = 'selected';
		}
	};
	$scope.walkRadius10minSelect = function() {
		if($scope.walkRadiusVisibile10min) {
			$scope.walkRadiusVisibile10min = false;
			$scope.selected10min = 'unselected';
		} else {
			$scope.walkRadiusVisibile10min = true;
			$scope.selected10min = 'selected';
		}
	};
	$scope.walkRadius15minSelect = function() {
		if($scope.walkRadiusVisibile15min) {
			$scope.walkRadiusVisibile15min = false;
			$scope.selected15min = 'unselected';
		} else {
			$scope.walkRadiusVisibile15min = true;
			$scope.selected15min = 'selected';
		}
	};
	//endregion map circle toggle

	//region map marker toggle
	$scope.parentMapMarkerClicked = function() {
		//first make all other detail panels invisible
		$scope.walkRadiusDetailsVisibility = 'invisible';
		$scope.routeToggleDetailsVisibility = 'invisible';
		$scope.settingsPanelVisibility = 'invisible';

		if($scope.mapMarkerDetailsVisibility == 'visible') {
			$scope.mapMarkerDetailsVisibility = 'invisible';
		} else {
			$scope.mapMarkerDetailsVisibility = 'visible';
		}
	};
	$scope.shoppingMarkerSelect = function() {
		var i = 0,
			markers = $scope.markers;
		for(i; i<markers.length; i++) {
			if(markers[i].type == 'SHOPPING') {
				if(markers[i].options.visible) {
					$scope.markers[i].options.visible = false;
					$scope.selectedShopping = 'unselected';
				} else {
					$scope.markers[i].options.visible = true;
					$scope.selectedShopping = 'selected';
				}
			}
		}
	};
	$scope.sightsMarkerSelect = function() {
		var i = 0,
			markers = $scope.markers;
		for(i; i<markers.length; i++) {
			if(markers[i].type == 'SIGHTS') {
				if(markers[i].options.visible) {
					$scope.markers[i].options.visible = false;
					$scope.selectedSights = 'unselected';
				} else {
					$scope.markers[i].options.visible = true;
					$scope.selectedSights = 'selected';
				}
			}
		}
	};
	//endregion map marker toggle

	//region route toggle
	$scope.parentRouteToggleClick = function() {
		//first make all other detail panels invisible
		$scope.walkRadiusDetailsVisibility = 'invisible';
		$scope.mapMarkerDetailsVisibility = 'invisible';
		$scope.settingsPanelVisibility = 'invisible';

		if($scope.routeToggleDetailsVisibility == 'visible') {
			$scope.routeToggleDetailsVisibility = 'invisible';
		} else {
			$scope.routeToggleDetailsVisibility = 'visible';
		}
	};
	$scope.historicRouteSelect = function() {
		//TODO need a more robust way to toggle routes
		var map = $scope.map.control.getGMap();
		
		if ($scope.selectedHistoricRoute == 'selected') {
			if(!$scope.directionsDisplay1 || !$scope.directionsDisplay1) return;

			$scope.directionsDisplay1.setMap(null);
			$scope.directionsDisplay2.setMap(null);
			for(var marker in $scope.directionMarkers) {
				$scope.directionMarkers[marker].setMap(null);
			}

			$scope.selectedHistoricRoute = 'unselected';
		} else {
			$scope.historicPhiladelphia(map);
			$scope.selectedHistoricRoute = 'selected';
		}
	};
	//endregion route toggle

	//region settings
	$scope.settingsClick = function() {
		//first make all other detail panels invisible
		$scope.walkRadiusDetailsVisibility = 'invisible';
		$scope.mapMarkerDetailsVisibility = 'invisible';
		$scope.routeToggleDetailsVisibility = 'invisible';

		if($scope.settingsPanelVisibility == 'visible') {
			$scope.settingsPanelVisibility = 'invisible';
		} else {
			$scope.settingsPanelVisibility = 'visible';
		}
	};
	$scope.poiManagerSelect = function() {
		$scope.settingsPanelVisibility = 'invisible';
		$scope.newpoi = {};
		
		$scope.modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'templates/add-poi-modal.html',
			scope: $scope
		});
		$scope.modalInstance.rendered.then(function() {
			// Initialize google maps places input
			var map = $scope.map.control.getGMap();
			var input = document.getElementById('places-input');
			$scope.autoComplete = new google.maps.places.Autocomplete(input, {types: ['geocode']});

			// Bias the search box results towards current map viewport
			$scope.autoComplete.bindTo('bounds', map);

			$scope.autoComplete.addListener('place_changed', function() {
				var place = $scope.autoComplete.getPlace();

				$scope.newpoi.lat = place.geometry.location.lat();
				$scope.newpoi.lng = place.geometry.location.lng();
			});
		});
	};
	$scope.cancelAddPoi = function () {
		$scope.modalInstance.dismiss('cancel');
	};

	$scope.addPoi = function() {
		var icon = '';
		switch($scope.newpoi.type) {
			case 'HOME':
				icon = 'images/icons/icn-home.svg'
			break;
			case 'SHOPPING':
				icon = 'images/icons/icn-briefcase.svg'
			break;
			case 'SIGHTS':
				icon = 'images/icons/icn-eye.svg'
			break;
		}

		var data = {
			coords: {
				latitude: $scope.newpoi.lat,
				longitude: $scope.newpoi.lng
			},
			options: {
				icon: icon
			},
			name: $scope.newpoi.name,
			description: $scope.newpoi.description,
			type: $scope.newpoi.type
		}
		
		//TODO couldn't get access to $http for some reason so this is a temporary workaround
		$scope.http.post('/poi/create', data)
			.success(function(response) {
				// add marker to markers array
				$scope.markers.push(response);
			})
			.error(function(response) {
				debugger;
			});

		$scope.modalInstance.close('closed');
	};
	//endregion settings

	$scope.markerClicked = function(marker, event, scope) {
		// close all previous infowindows and open an infowindow with the appropriate marker content
		if($scope.infoWindow) {
			$scope.infoWindow.close();
		}

		var i=0,
			markers = $scope.markers,
			len = $scope.markers.length;
		for(i; i<len; i++) {
			if(markers[i].id == marker.key) {
				var map = $scope.map.control.getGMap(),
					name = markers[i].name ? markers[i].name : 'Empty',
					desc = markers[i].description ? markers[i].description : '';
					
					$scope.infoWindow = new google.maps.InfoWindow({
						content: '<strong>' + name  + '</strong><p>' + desc + '</p>'
					});

				$scope.infoWindow.open(map, marker);
			}
		}
	};

	//get markers
	$http.get('/poi/list')
		.success(function(response) {
			var i = 0;
			for (i; i<response.length; i++) {
				response[i].options.visible = true;
			}

     		$scope.markers = response;

     		// sync up the marker toggle
     		$scope.selectedShopping = 'selected';
     		$scope.selectedSights = 'selected';
     	})
     	.error(function(response) {
     		debugger;
     	});

	//dummy Events API call
     $http.get('/events/google?days=1') //TODO testing number of days - will probably stick with 1 for final app
     	.success(function(response) {
     		$scope.events = response;

     		if($scope.events.length == 0) {
     			$scope.noEventsVisible = 'visible';
     		}
     	})
     	.error(function(response) {
     		debugger;
     	});
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
}]);