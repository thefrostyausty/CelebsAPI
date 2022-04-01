// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Celebs = require('../models/celebs')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
// const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
// const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /examples
router.get('/celebs', (req, res, next) => {
	Celebs.find()
		.then((celebs) => {
			// `celebs` will be an array of Mongoose documents
			// we want to convert each one to a javascript object, so we use `.map` to
			// apply `.toObject` to each one
			// .map returns a new array
			// there is no body in POSTMAN for an INDEX route
			return celebs.map((celebs) => celebs.toObject())
            // return celebs
		})
		// respond with status 200 and JSON of the examples
		.then((celebs) => res.status(200).json({ celebs: celebs }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// CREATE post /celebs
// start a post route to put test data inside becuase we are returning an empty array
router.post('/celebs', (req, res, next) => {
	Celebs.create(req.body.celebs)
	.then((celebs) =>{

			console.log('this is the celebs', celebs)
			console.log('this is the req.body', req.body)
			// we're sending celebs in order to be created and sent as an object
			res.status(201).json({ celebs: celebs.toObject() })
		})
		// if there are any errors we need to use the error handler
		.catch(next)
})

// show individual celeb route and use via postman

// GET celebs/62462a20a24cc80fa983cfec
router.get('/celebs/:id', (req, res, next) =>{
	// we get the id from req.params.id -> :id
	Celebs.findById(req.params.id)
		// if celebs aren't found we will send that custom error
		.then(handle404)
		// if successful respond with an object as json
		.then(celebs => res.status(200).json({ celebs: celebs.toObject() }))
		// if not we will send the error handler
		.catch(next)

})

// delete /celebs/62462a20a24cc80fa983cfec
router.delete('/celebs/:id', (req, res, next) =>{
	Celebs.findById(req.params.id)
	// use the handle404 midddleware
		.then(handle404)
	// find the celebs id and delete
		.then( celebs => { celebs.findByIdAndDelete})
	// send back a 204 no content status
		.then(() => res.sendStatus(204))
		.catch(next)
})














module.exports = router