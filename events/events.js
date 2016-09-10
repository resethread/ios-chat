var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var Message = require('../models/message')

module.exports = (app) => {

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
}
