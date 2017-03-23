let snabbdom = require('snabbdom');

let patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
]);

let h = require('snabbdom/h').default; // helper function for creating vnodes

import postal from 'postal'
import NestedComponent from './NestedComponent'

function isEventForComponent(subscriptions) {
	return (event) => {
		//return event.topic === topic && event.componentName === componentName;
		return subscriptions.hasOwnProperty(event.topic);
	}			
}

function replay(events) {
	//let reversed = events.reverse();

	return events.reduce(function(state, event) {
		if (event.eventType === 'async.success') {
			state.asyncData = event.data;
		} else if(event.eventType === 'async.error'){
			state.asyncError = event.data;
		} else if(event.eventType === 'click') {
			state.syncData = event.data;
		}

		return state;
	}, {}); 	
}

// takes in the reduced component state and returns a vnode
function view(state, component) {
	let dynamic = [];

	let nested = new NestedComponent(document.createElement('div'), component._eventStore);

	if(state.asyncData) {
		dynamic = state.asyncData.chapterUrls.map(function(url){
			return h('li', url);
		});
	}

	if(state.asyncError) {
		dynamic = h('li', `${state.asyncError.message}`);
	}
	
	return h('div', [
		h('div', typeof state.syncData === 'undefined' ? '' : state.syncData),
		h('div', `Async data ${typeof state.asyncData === 'undefined' ? '' : state.asyncData.heading}`),
		h('h1', `${typeof state.asyncData === 'undefined' ? '' : state.asyncData.heading}`),
		nested.render(),
		h('ul', dynamic),
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

		this._subscriptions[topic] = subscription;		
		
		return subscription;
	}

	subscribeAsync(topic, callback) {
		let asyncSubscription = postal.subscribe({
			channel: 'async',
			topic: topic,
			callback: callback.bind(this)    		    
		});

		this._subscriptions[topic] = asyncSubscription;		
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

        const newVnode = view(reducedState, this);
		this._container = updateDOM(this._container, newVnode);

		return this._container;
	}
}