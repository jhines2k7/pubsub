let snabbdom = require('snabbdom');

let patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
]);

let h = require('snabbdom/h').default; // helper function for creating vnodes

import postal from 'postal'

function isEventForComponent(subscriptions) {
	return (event) => {
		//return event.topic === topic && event.componentName === componentName;
		return subscriptions.hasOwnProperty(event.topic);
	}			
}

function replay(events) {
	//let reversed = events.reverse();

	return events.reduce(function(state, event) {
		/*state.userName = event.payload.userName;
		state.firstName = event.payload.firstName;
		state.lastName = event.payload.lastName;
		state.email = event.payload.email;*/
		if(event.topic === 'profile.update.james') {
			state.jamesData = event.data;
		}

		if(event.topic === 'profile.update.tab') {
			state.tabData = event.data;
		}	
		
		return state;
	}, {}); 	
}

// takes in the reduced component state and returns a vnode
function view(state) {
	return h('div', [		
		h('div', `Reduced data for tab component: ${state.tabData}`),
		h('div', `Reduced data from updated james component: ${state.jamesData}`)	
	]);
}

function updateDOM(container, newVnode) {
	return patch(container, newVnode);
}

export default class TabComponent {
	constructor(container, eventStore) {
		this._eventStore = eventStore;		
		this._container = container;
		this._subscriptions = {};
	}

	subscribe(channel, topic) {
		let subscription = postal.subscribe({
		    channel: channel,
		    topic: topic,
		    callback: function(data, envelope) {
		    	this.render();
		    }.bind(this)
		});

		this._subscriptions[topic] = subscription

		return subscription;
	}

	getSubscriptions() {
		return this._subscriptions;
	}

	render() {
		let events = this._eventStore.filter(isEventForComponent(this._subscriptions));

		let reducedState = replay(events);

        const newVnode = view(reducedState);
		this._container = updateDOM(this._container, newVnode);
	}
}