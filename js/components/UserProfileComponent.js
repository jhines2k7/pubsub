let snabbdom = require('snabbdom');

let patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
]);

let h = require('snabbdom/h').default; // helper function for creating vnodes

function update(id) {
	let events = this._eventBus.getEventStore().filter(isOrderEvent(id));

	return reducedState = replay(events);	
}

function isOrderEvent(id) {
	return (event) => {
		return event.userId === id && event.componentName === 'userProfile';
	}			
}

function replay(events) {
	return events.reduce(function(obj, event) {		
		obj.userName = event.payload.userName;
		obj.firstName = event.payload.firstName;
		obj.lastName = event.payload.lastName;
		obj.email = event.payload.email;
		return obj;
	}, {}); 	
}

// takes in a state object and returns a vnode
function view(state) {
	return h('div', state);
}

function updateDOM(container, newVnode) {
	return patch(container, newVnode);
}

export default class UserProfileComponent {
	constructor(container, eventStore) {
		this._eventStore = eventStore;		
		this._container = container;		
	}

	subscribe(topic, channel, callback) {
		postal.subscribe({
		    channel: "users",
		    topic: topic,
		    callback: function(data, envelope) {
		        // `data` is the data published by the publisher. 
		        // `envelope` is a wrapper around the data & contains 
		        // metadata about the message like the channel, topic, 
		        // timestamp and any other data which might have been 
		        // added by the sender.
		        console.log(data);
		    }
		});
	}

	render(state) {
		const newVnode = view(state);
		this._container = updateDOM(this._container, newVnode);
	}
}