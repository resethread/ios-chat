var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var nunjucks = require('nunjucks')
var mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/chat')


var messageSchema = mongoose.Schema({
	user: String,
	station: String,
	message: String,
	created_at: Date,
	updated_at: Date,
	time: String
})
messageSchema.index({ created_at: 1}, { expireAfterSeconds : 60*60*24*3});
var Message = mongoose.model("Message", messageSchema)


io.sockets.on('connection', function(socket) {

	
	
	Message.find().sort({ 'created_at' : 'desc'}).limit(20).exec(function(err, result) {
		if (err) throw err;
		socket.emit('data', result)
	})
	

	socket.on('client-send-message', function(message) {
		var m = new Message({
			user: message.user,
			station: message.station,
			message: message.message,
			created_at: new Date(),
			updated_at: new Date(),
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
	Message.find().sort({ 'created_at' : 'desc'}).limit(20).exec(function(err, result) {
		var data = result
		res.render('index.html', {data: data})
	})
	//res.render('index.html', {})
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