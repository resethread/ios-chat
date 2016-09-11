var express = require('express')
var Message = require('../models/message')
var Article = require('../models/article')

module.exports = (app) => {

	var app_router = express.Router()

	app_router.get('/', (req, res) => {
		res.render('./app/pages/index.html')
	})

	app_router.get('/message/:id', (req, res) => {
		Message.findById(req.params.id, (err, message) => {
			if (err) {
				console.log(err)
			}
			else {
				res.render('./app/pages/message.html', {
					message: message
				})
			}
		})
	})

	app_router.get('/infos', (req, res) => {
		Article.find().exec((err, articles) => {
			res.render('./app/pages/infos.html', {
				articles: articles
			})
		})
	})

	app_router.get('/a-propos', (req, res) => {
		res.render('./app/pages/a-propos.html')
	})

	app.use('/', app_router)

}
