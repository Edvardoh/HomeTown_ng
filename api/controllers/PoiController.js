/**
 * MapController
 *
 * @description :: Server-side logic for managing Points of Interest
 */

module.exports = {

	create: function(req, res, next) {
		var params = req.params.all();

		Poi.create(params, function PoiCreated(err, Poi) {
			if(err) {
				console.log(err);
				res.send(err);
				return;
			}

			res.send(Poi);
		});
	},

	list: function(req, res, next) {
		// get an array of all records in the Poi collection
		Poi.find(function foundPois(err, Pois) {
			if(err) return next(err);
			
			res.send(Pois);
		});
	}
};

