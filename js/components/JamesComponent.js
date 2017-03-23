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
		if(event.topic === 'component.update.casey') {
			state.caseyData = event.data;
		}

		if(event.topic === 'component.update.james') {
			state.jamesData = event.data;
		}	
		
		return state;
	}, {}); 	
}

// takes in the reduced component state and returns a vnode
function view(state) {

	return h('div', [		
		h('div', {style: {fontWeight: 'bold'}}, 'This is the james component'),
		h('div', [
			'Reduced data for james component: ',

			h('span',  {style: {fontWeight: 'bold', color: 'green'}},
				`${typeof state.jamesData === 'undefined' ? '' : state.jamesData}`
			)
		]),
		h('div', [
			'James component can subscribe to updates from casey component: ', 
			
			h('span', {style: {fontWeight: 'bold', color: 'red'}}, 
				`${typeof state.caseyData === 'undefined' ? '' : state.caseyData}`
			)
		]),
		h('hr')	
	]);
}

function updateDOM(container, newVnode) {
	return patch(container, newVnode);
}

export default class JamesComponent {
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
		let events = this._eventStore.filter(this._subscriptions);

		let reducedState = replay(events);

        const newVnode = view(reducedState);
		this._container = updateDOM(this._container, newVnode);
	}
}