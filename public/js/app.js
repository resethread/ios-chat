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
var socket = io.connect('http://localhost:8080')
socket.on('data', function(data) {
	vm._data.messages = data
})
socket.on('server-good-receive', function(message) {
	vm._data.messages.unshift(message)
})


var vm = new Vue({
	el: '#appli_chat',

	ready: function(arg) {
		
    },

	data: {
		messages: [],
		user: '',
		station: '',
		message: '',
	},

	methods: {

		newMessage: function() {

			var station = this.station
			var message = this.message

			var new_message = {
				user: localStorage.getItem('nick'),
				station: station,
				message: message,
				createdAt: Date(),
				time: this.getTimeFormated()
			}
			socket.emit('client-send-message', new_message)
			document.getElementById('input_station').value = ''
			document.getElementById('input_message').value = ''
		},

		getTimeFormated() {
			var date = new Date()
			var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
			var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

			return hours + ':' + minutes
		},

		moreInfos: function(message) {
			document.getElementById('this_station').innerHTML = message.station
			document.getElementById('this_message').innerHTML = message.message
		},

		logout: function() {
			localStorage.clear()
			myApp.alert('Plus de traces içi...', null);
		}
	}
})

