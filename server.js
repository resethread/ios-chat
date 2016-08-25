var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var nunjucks = require('nunjucks')
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://127.0.0.1/chat')


app.use(bodyParser.urlencoded({ extended: true }))

// helpers
function getTimeFormat() {
	var date = new Date()
	var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
	var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
	
	return hours + ':' + minutes
}

var Message = require('./models/message')

io.sockets.on('connection', function(socket) {
	
	Message.find().sort({ 'created_at' : 'desc'}).limit(20).exec(function(err, result) {
		if (err) throw err;
		socket.emit('data', result)
	})
	
	socket.on('client-send-message', function(message) {

		var m = new Message()
		m.user = message.user
		m.station = message.station
		m.message = message.message
		m.created_at = new Date()
		m.updated_at = new Date()
		m.time = message.time
		m.save()
		
		message.id = m._id

		io.sockets.emit('server-good-receive', message )
	})

	socket.on('client_load_comments', function(id) {
		Message.findById(id, function(err, message) {
			if (err) {
				throw err
			}
			var comments = message.comments
			socket.emit('server_sends_comments', comments)
		})
	})

	socket.on('client-send-comment', function(comment) {
		Message.findById(comment.message_id, function(err, message) {
			message.comments.unshift(comment)
			message.save(function(err) {
				if (err) throw  err;
				socket.emit('server_push_2_client', comment)
			})
		})
	})
})

// config
nunjucks.configure('views', {
	autoescape: true,
  	express   : app
})
app.use(express.static('public'))

// routes
require('./routes/app')(app)
require('./routes/admin')(app)
// 404
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that! - 404')
})


server.listen(8080)