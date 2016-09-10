


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

socket.on('server_good_receive', function(message) {
	vm.unshiftMessage(message)
})

socket.on('server_sends_comments', function(comments) {
	vm._data.comments = comments
})

socket.on('server_push_2_client', function(comment) {
	vm._data.comments.unshift(comment)
})

function sendComment() {
	console.log('not vuejs')
	vm.sendComment()
}

var vm = new Vue({
	el: '#appli_chat',

	ready: function(arg) {
		this.showTab()
    },

	data: {
		id: '',
		messages: [],
		user: '',
		station: '',
		message: '',
		comments: [],
		tabbar_visible: true
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
			socket.emit('client_send_message', new_message)
			document.getElementById('input_station').value = ''
			document.getElementById('input_message').value = ''
		},

		unshiftMessage: function(message) {
			var template = '<li>' +
								'<a href="/message/' + message.id + '" class="item-link">' +
									'<div class="item-content">' +
										'<div class="item-inner">' +
											'<div class="item-title-row">' +
												'<div class="item-title">' +
													'<b>' + message.station + '</b>' +
												'</div>' +
												'<div class="item-after">' +
													'<span class="badge ' + this.badgeColor(message.created_at) + '">' +  message.time + '</span>' +
												'</div>' +
											'</div>' +
											'<div class="item-subtitle">' +
												'<small>' + message.user + '</small>' +
											'</div>' +
											'<div class="item-text">' + message.message + '</div>' +
										'</div>' +
									'</div>' +
								'</a>' +
							'</li>'

			document.getElementById('list_messages').insertAdjacentHTML('afterbegin', template)
		},

		getTimeFormated: function() {
			var date = new Date()
			var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
			var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

			return hours + ':' + minutes
		},
		/*
		moreInfos: function(message) {
			document.getElementById('this_id').dataset.id = message._id
			document.getElementById('this_station').innerHTML = message.station
			document.getElementById('this_message').innerHTML = message.message

			this.id = message._id || message.id

			// load comments
			socket.emit('client_load_comments', message._id || message.id)
		},
		*/

		sendComment: function() {
			console.log('vuejs')
			var comment = {
				message_id: this.id,
				user: localStorage.getItem('nick') || 'Annonyme',
				text: document.getElementById('commentText').value,
				created_at: this.getTimeFormated()
			}
	
			console.log(comment)
			document.getElementById('commentText').value = ''

			if (comment.text) {
				socket.emit('client-send-comment', comment)
			}
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

		toto: function() {
			alert('toto')
		}
	},
})

/*
setTimeout(function() {
	console.clear()
	console.log('keep calm and **** the system...')
}, 100)
*/
