/**
 * WeatherController
 *
 * @description :: Server-side logic for managing weathers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	current: function(req, res) {
		console.log('weather/current');

		var params = req.params.all();
		var ForecastIo = require('forecastio');
		var forecastIo = new ForecastIo('f0f643b626c0788853800bcc4570696a');

		forecastIo.forecast(params.lat, params.long, function(err, data) {
		  if (err) throw err;
		  return res.json(data);
		});
	}
	
};

