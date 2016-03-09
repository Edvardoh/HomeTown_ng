angular.module('HomeTown').controller('MainController', [ '$scope', '$http', '$filter', '$uibModal',
	function($scope, $http, $filter, $uibModal) {
	//TODO dummy map object and marker (coordinates for 230 E Girard Ave Philadelphia, PA 19125)
	//region scope object definitions
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
			icon: 'images/icons/icn-briefcase.svg',
			visible: false
		}
	};
	$scope.poi2 = {
		idKey: '0002', //TODO this needs to be unique
		coords: {
			latitude: 39.966512, 
			longitude: -75.129990
		},
		options: {
			icon: 'images/icons/icn-eye.svg',
			visible: false
		}
	};
	$scope.poi3 = {
		idKey: '0003', //TODO this needs to be unique
		coords: {
			latitude: 39.9720102, 
			longitude: -75.1159984
		},
		options: {
			icon: 'images/icons/icn-eye.svg',
			visible: false
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
		if($scope.poi1.options.visible) {
			$scope.poi1.options.visible = false;
			$scope.selectedShopping = 'unselected';
		} else {
			$scope.poi1.options.visible = true;
			$scope.selectedShopping = 'selected';
		}
	};
	$scope.sightsMarkerSelect = function() {
		if($scope.poi2.options.visible) {
			$scope.poi2.options.visible = false;
			$scope.poi3.options.visible = false;
			$scope.selectedSights = 'unselected';
		} else {
			$scope.poi2.options.visible = true;
			$scope.poi3.options.visible = true;
			$scope.selectedSights = 'selected';
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
		debugger;
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
		debugger;
		$scope.modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'templates/add-poi-modal.html',
			scope: $scope,

		});

		$scope.modalInstance.result.then(function (selectedItem) {
	    	debugger;
	    });
	};
	$scope.cancelAddPoi = function () {
		$scope.modalInstance.dismiss('cancel');
	};

	$scope.addPoi = function() {
		
		debugger;

		$scope.modalInstance.close('closed');
	};
	//endregion settings

	$scope.markerClicked = function(marker, event, scope) {
		var map = $scope.map.control.getGMap(),
			infoWindow = new google.maps.InfoWindow({
				//TODO content needs to be dynamic
			content: '<strong>1421 Howard St, Philadelphia, PA 19122</strong><p>You are here. Welcome to NoFish!</p>'
		});

		infoWindow.open(map, marker);
	};

	//get markers
	$http.get('/poi/list')
		.success(function(response) {
     		$scope.markers = response;
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