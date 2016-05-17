var myApp = new Framework7({
	animateNavBackIcon:true
});
var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: true,
    // Enable Dom Cache so we can use all inline pages
    domCache: true
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

socket.on('data', function(data) {
	vm._data.messages = data
})
socket.on('server-good-receive', function(message) {
	vm._data.messages.unshift(message)
})

socket.on('server_sends_comments', function(comments) {
	vm._data.comments = comments
})

socket.on('server_push_2_client', function(comment) {
	vm._data.comments.unshift(comment)
})

var vm = new Vue({
	el: '#appli_chat',

	ready: function(arg) {
		console.log('ready')
    },

	data: {
		id: '',
		messages: [],
		user: '',
		station: '',
		message: '',
		comments: []
	},

	methods: {

		newMessage: function() {

			var station = this.station
			var message = this.message

			var new_message = {
				user: localStorage.getItem('nick'),
				station: station,
				message: message,
				created_at: Date(),

				time: this.getTimeFormated()
			}
			socket.emit('client-send-message', new_message)
			document.getElementById('input_station').value = ''
			document.getElementById('input_message').value = ''
		},

		getTimeFormated: function() {
			var date = new Date()
			var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
			var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

			return hours + ':' + minutes
		},

		moreInfos: function(message) {
			document.getElementById('this_id').dataset.id = message._id
			document.getElementById('this_station').innerHTML = message.station
			document.getElementById('this_message').innerHTML = message.message
			
			this.id = message._id || message.id

			console.log(message)
			// load comments
			socket.emit('client_load_comments', message._id || message.id)
		},

		sendComment() {
			var comment = {}
			comment.message_id = this.id
			comment.user = localStorage.getItem('nick') || 'Annonyme'
			comment.text = document.getElementById('commentText').value
			document.getElementById('commentText').value = ''

			console.log(comment)

			socket.emit('client-send-comment', comment)
		},

		logout: function() {
			localStorage.clear()
			myApp.alert('Plus de traces içi...', null);
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

		reload: function(event) {
			location.reload()
		}
	},
})

