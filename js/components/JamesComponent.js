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
		return subscriptions.hasOwnProperty(event.topic) && event.eventType !== 'async.success';
	}			
}

function replay(events, component) {
	//let reversed = events.reverse();

	return events.reduce(function(state, event) {
		if (event.eventType === 'async.success') {
			state.asyncData = event.data;
		} else {
			state.syncData = event.data;	
		}		
		
		return state;
	}, {}); 	
}

// takes in the reduced component state and returns a vnode
function view(state) {
	return h('div', [
		h('div', state.syncData),
		h('div', `Async data ${typeof state.asyncData === 'undefined' ? '' : state.asyncData}`),
		h('hr')
	]);
}

function updateDOM(container, newVnode) {
	return patch(container, newVnode);
}

export default class UserComponent {
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

	subscribeAsync() {
		postal.subscribe({
		    channel: 'async',
		    topic: 'profile.update.james',
		    callback: function(data, envelope) {
				console.log('Async event success from JamesComponent!');
		    	setTimeout( () => {
					let event = {
						channel: "async",
					    topic: "profile.update.james",	    
					    eventType: 'async.success',
					    data: 'data returned from async-event'
					}

					this.publish(event);
					this.render();
				}, 8000);
		    }.bind(this)
		});		
	}

	publish(event) {
		postal.publish(event);
		this._eventStore.push(event);
	}

	getSubscriptions() {
		return this._subscriptions;
	}

	render() {
		let events = this._eventStore.filter(isEventForComponent(this._subscriptions));

		let reducedState = replay(events, this);

        const newVnode = view(reducedState);
		this._container = updateDOM(this._container, newVnode);
	}
}