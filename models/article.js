var mongoose = require('mongoose')

var articleSchema = mongoose.Schema({
	title: String,
	slug: String,
	overview: String,
	content: String,
	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: Date,
	comments: []
})

var Article = mongoose.model('Article', articleSchema)

module.exports = Article
