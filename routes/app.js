var express = require('express')
var Message = require('../models/message')
var Article = require('../models/article')

module.exports = (app) => {

	var app_router = express.Router()

	app_router.get('/', (req, res) => {
		Message.find().sort({ 'created_at' : 'desc'}).limit(20).exec((err, data) => {
			res.render('index.html', {
				data: data
			})
		})
	})

	app_router.get('/infos', (req, res) => {
		Article.find().exec((err, articles) => {
			console.log(articles)
			res.render('infos.html', {
				articles: articles
			})
		})

	})

	app_router.get('/a-propos', (req, res) => {
		res.render('a-propos.html')
	})

	app.use('/', app_router)

}
