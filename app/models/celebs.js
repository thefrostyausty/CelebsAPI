const mongoose = require('mongoose')

const celebsSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		talent: {
			type: String,
			required: true,
		},
        age: {
            type: Number,
            required: true,
        },
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Celebs', celebsSchema)