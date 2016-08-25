var express = require('express')
var Article = require('../models/article')

module.exports = (app) => {

	var admin = express.Router()

	admin.get('/', (req, res) => {
		res.render('./admin/pages/index.html')
	})

	admin.get('/articles', (req, res) => {
		Article.find().sort({ 'created_at' : 'desc'}).exec((err, articles) => {
			res.render('./admin/pages/articles/index.html', {
				articles: articles
			})
		})
	})

	admin.get('/articles/create', (req, res) => {
		res.render('./admin/pages/articles/create.html')
	})

	admin.post('/articles/create', (req, res) => {

		Article.create({
			title: req.body.title,
			overview: req.body.overview,
			content: req.body.content,
		}, (err) => {
			if (err) {
				throw err
			}
			res.redirect('/admin/articles')
		})
	})

	admin.get('/articles/edit/:id', (req, res) => {
		res.render('./admin/pages/articles/edit.html')
	})

	admin.post('/articles/edit/:id', (req, res) => {

	})
	
	app.use('/admin', admin)
}
