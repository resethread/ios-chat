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
messageSchema.index({ createdAt: 1}, { expireAfterSeconds : 60*60*24*3});
var Message = mongoose.model("Message", messageSchema)



io.sockets.on('connection', function(socket) {

	Message.find().sort({ 'createdAt' : 'desc'}).limit(20).exec(function(err, result) {
		if (err) throw err;
		socket.emit('data', result)
	})
	

	socket.on('client-send-message', function(message) {
		var m = new Message({
			user: message.user,
			station: message.station,
			message: message.message,
			createdAt: new Date(),
			time: message.time,
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

app.get('/infos', function(req, res) {
	res.render('infos.html', {})
})

app.get('/a-propos', function(req, res) {
	res.render('a-propos.html')
})

app.all('*', function(req, res) {
	res.redirect('/')
})

server.listen(8080)