var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var nunjucks = require('nunjucks')
var mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/chat')

// helpers
function getTimeFormat() {
	var date = new Date()
	var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
	var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
	
	return hours + ':' + minutes
}

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
app.get('/', function(req, res) {
	Message.find().sort({ 'created_at' : 'desc'}).limit(20).exec(function(err, result) {
		var data = result
		res.render('index2.html', {data: data})
	})
})

app.get('/infos', function(req, res) {
	var infos = require('./data/infos')
	res.render('infos.html', { infos: infos })
})

app.get('/a-propos', function(req, res) {
	res.render('a-propos.html')
})

app.all('*', function(req, res) {
	res.redirect('/')
})

server.listen(8080)