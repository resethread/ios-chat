var express = require('express')
var Article = require('../models/article')

module.exports = (app) => {

	var admin = express.Router()

	admin.get('/', (req, res) => {
		res.render('./admin/pages/index.html')
	})

	/* |||||||||||||||||||||||||

	Article

	||||||||||||||||||||||||||||*/
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
		Article.findById(req.params.id, (err, article) => {
			res.render('./admin/pages/articles/edit.html', {
				article: article
			})
		})

	})

	admin.post('/articles/edit/:id', (req, res) => {
		Article.update({ _id: req.params.id }, {
			title: req.body.title,
			overview: req.body.overview,
			content: req.body.content,
		}, { multi: true }, () => {
			res.redirect('/admin/articles')
		})
	})

	admin.post('/articles/delete/:id', (req, res) => {
		Article.findByIdAndRemove(req.params.id, (err) => {
			res.redirect('/admin/articles')
		})
	})

	/* |||||||||||||||||||||||||

	Users

	||||||||||||||||||||||||||||*/

	admin.get('/users')

	app.use('/admin', admin)


}
