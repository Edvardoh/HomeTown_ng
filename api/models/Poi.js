/**
* Poi.js
*
* @description :: Model for points of interest - used to display map markers, etc.
*/

module.exports = {

	schema: true,

	attributes: {

		id: {
			type: 'integer',
			autoIncrement: true,
			unique: true
		},

		coords: {
			type: 'json',
			required: true
		},

		options: {
			type: 'json',
			required: true
		},

		name: {
			type: 'string'
		},

		description: {
			type: 'string'
		}
	}
};

