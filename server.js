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
  	express   : app
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

	socket.on('client_send_message', function(message) {
		var m = new Message({
			user: message.user,
			station: message.station,
			message: message.message,
			created_at: new Date(),
			updated_at: new Date(),
			time: message.time
		})
		m.save((err) => {
			message.id = m._id
			io.sockets.emit('server_good_receive', message )
		})
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
