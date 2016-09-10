var express = require('express')
var Message = require('../models/message')
var Article = require('../models/article')

module.exports = (app) => {

	var app_router = express.Router()

	app_router.get('/', (req, res) => {
		Message.find().sort({ 'created_at' : 'desc'}).limit(20).exec((err, data) => {

			// ça aà externaliser
			var badgeColor = function(created_at) {
				var created_at = new Date(created_at)
				var hour_space = new Date().getHours() - created_at.getHours()
				var bg = ''
				if (hour_space >= 0 && hour_space < 2)
					bg = 'bg-red'
				else if (hour_space >= 0 && hour_space <= 3)
					bg = 'bg-orange'
				else if (hour_space >=0 && hour_space <= 4)
					bg = 'bg-yellow'
				else {
					bg = 'bg-blue'
				}
				return bg
			}

			res.render('./app/pages/index.html', {
				data: data,
				badgeColor: badgeColor
			})
		})
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
