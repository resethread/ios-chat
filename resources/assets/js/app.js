var myApp = new Framework7({
	animateNavBackIcon:true,
});
var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: true,
    // Enable Dom Cache so we can use all inline pages
    domCache: true,
});

$$('.go-signal').on('click', function() {
	//myApp.popup('.popup-about')
	if (localStorage.getItem('nick')) {
		myApp.popup('.popup-about')
	}
	else {
		myApp.prompt('Quel est votre pseudo ?', 'Votre pseudo', function(value) {
			localStorage.setItem('nick', value)
			myApp.popup('.popup-about')
		})
	}
});

$$('.close-popup').on('click', function() {
	myApp.closeModal('.popup-about')
});

// socket io
var socket = io()

var vm = new Vue({
	el: 'appli_chat',

	data: {
		index: {
			messages: [
				{
					foo: 'bar'
				},
				{
					foo: 'bar'
				},
				{
					foo: 'bar'
				},
				{
					foo: 'bar'
				},
				{
					foo: 'bar'
				},
				{
					foo: 'bar'
				},
			]
		}
	}
})
/*
var vm = new Vue({
	el: '#appli_chat',

	created: function() {
		socket.emit('request_messages')

		// bind this est important ça veut dire que this fait référence à l'objet vue et pas à l'objet socket
		socket.on('send_messages', function(messages) {
			this.index.messages = messages
		}.bind(this))

		socket.on('server_response_client', function(message) {
			this.index.messages.unshift(message)
		}.bind(this))

		socket.on('server_response_comments', function(comments) {
			this.id_message.comments = comments
		}.bind(this))

		socket.on('server_response_comment', function(comment) {
			this.id_message.comments.unshift(comment)
		}.bind(this))

	},

	data: {
		index: {
			messages: []
		},
		id_message: {
			id: '',
			station: '',
			message: '',
			comments: []
		},
		id: '',
		station: '',
		message: '',
		newComment: '',
		tabbar_visible: true

	},

	methods: {
		newMessage: function() {
			console.log('new_message')
			var station = this.station
			var message = this.message

			var new_message = {
				user: localStorage.getItem('nick'),
				station: station,
				message: message,
				created_at: Date(),

				time: this.getTimeFormated()
			}

			socket.emit('client_post_message', new_message)
			document.getElementById('input_station').value = ''
			document.getElementById('input_message').value = ''
		},

		infosId: function(message) {

			document.getElementById('this_station').innerHTML = message.station
			document.getElementById('this_message').innerHTML = message.message

			sessionStorage.setItem("id", message._id)

			socket.emit('request_comments', message._id)
			
		},

		sendComment: function() {

			var comment = {
				message_id: sessionStorage.getItem("id"),
				user: localStorage.getItem('nick') || 'Annonyme',
				text: this.newComment,
				created_at: this.getTimeFormated()
			}

			if (comment.text) {
				socket.emit('client_post_comment', comment)
			}

			this.newComment = ''
		},

		// à externaliser ou à traiter coté serveur
		getTimeFormated: function() {
			var date = new Date()
			var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
			var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

			return hours + ':' + minutes
		},

		badgeColor: function(created_at) {
			var created_at = new Date(created_at)
			var hour_space = new Date().getHours() - created_at.getHours()
			var bg = ''
			if (hour_space >= 0 && hour_space < 2)
				bg = 'bg-red'
			else if (hour_space >= 0 && hour_space <= 3)
				bg = 'bg-orange'
			else if (hour_space >=0 && hour_space <= 4)
				bg = 'bg-yellow'
			else {
				bg = 'bg-blue'
			}
			return bg
		},

		logout: function() {
			localStorage.clear()
			myApp.alert('Plus de traces içi...', null);
		},

		focusArea: function() {
			this.hideTab()
			var el = document.getElementById('scroll')
			el.scrollIntoView(true)
		},

		showTab: function() {
			this.tabbar_visible = true
		},

		hideTab: function() {
			this.tabbar_visible = false
		},
	}
})
*/