var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var nunjucks = require('nunjucks')
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/chat')


var messageSchema = mongoose.Schema({
	user: String,
	station: String,
	message: String,
	createdAt: Date,
	time: String
})

var Message = mongoose.model("Message", messageSchema)



io.sockets.on('connection', function(socket) {


	/*Message.find(function(err, result) {
		if (err) throw err;
		socket.emit('data', result)
	})*/
	Message.find().sort({ 'createdAt' : 'desc'}).limit(20).exec(function(err, result) {
		if (err) throw err;
		socket.emit('data', result)
	})
	

	socket.on('client-send-message', function(message) {
		var m = new Message({
			user: message.user,
			station: message.station,
			message: message.message,
			date: Date(),
			time: message.time
		}).save()

		io.sockets.emit('server-good-receive', message )
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
	res.render('index.html', {})
})

/*app.get('/messages', function(req, res) {
	Message.find(function(err, result) {
		if (err) throw err;
		res.json(result)
	})
})*/


server.listen(8080)