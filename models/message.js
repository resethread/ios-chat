var mongoose = require('mongoose')

var messageSchema = mongoose.Schema({
	user: String,
	station: String,
	message: String,
	created_at: Date,
	updated_at: Date,
	time: String,
	comments: []
})
messageSchema.index({ created_at: 1}, { expireAfterSeconds : 60*60*24});
var Message = mongoose.model("Message", messageSchema)

module.exports = Message