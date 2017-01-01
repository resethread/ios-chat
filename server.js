var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var nunjucks = require('nunjucks')
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://127.0.0.1/chat')

// config
nunjucks.configure('views', {
	autoescape: true,
  	express   : app,
  	watch : true
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

// helpers
function getTimeFormat() {
	var date = new Date()
	var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
	var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

	return hours + ':' + minutes
}

//require('./events/events')(app)

var Message = require('./models/message')

io.sockets.on('connection', function(socket) {

	socket.on('request_messages', () => {
		Message.find().sort({ 'created_at' : 'desc'}).limit(20).exec((err, messages) => {
			socket.emit('send_messages', messages)
		})
	})

	socket.on('client_post_message', (message) => {
		Message.create(message, (err, message) => {
			var message = message
			io.sockets.emit('server_response_client', message)
		})
	})

	socket.on('request_comments', (id) => {
		Message.findById(id, (err, message) => {
			var comments = message.comments
			socket.emit('server_response_comments', comments)
		})
	})

	socket.on('client_post_comment', (comment) => {
		Message.findById(comment.message_id, (err, message) => {
			message.comments.unshift(comment)
			message.save((err) => {
				io.sockets.emit('server_response_comment', comment)
			})
		})
	})
})


// routes
require('./routes/app')(app)
require('./routes/admin')(app)
// 404
/*
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that! - 404')
})
*/

server.listen(8080)
