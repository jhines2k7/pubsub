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

// takes in the reduced component state and returns a vnode
function view(state, component) {
	let dynamic;
	let urlList;

	let nested = new NestedComponent(document.createElement('div'), component._eventStore);

	if(state.asyncData) {
		urlList = state.asyncData.chapterUrls.map(function(url){
			return h('li', url);
		});

		dynamic = h('ul', urlList);
	}

	if(state.asyncError) {
		dynamic = h('h3', `${state.asyncError.message}`);
	}
	
	return h('div', [
		h('div', typeof state.syncData === 'undefined' ? '' : state.syncData),
		h('div', `Async data ${typeof state.asyncData === 'undefined' ? '' : state.asyncData.heading}`),
		h('h1', `${typeof state.asyncData === 'undefined' ? '' : state.asyncData.heading}`),
		state.nestedData ? nested.render() : null,
		dynamic,
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
		    	let events = this._eventStore.filter(isEventForComponent(this._subscriptions));

				let reducedState = this.replay(events);

		    	this.render(reducedState);
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

	render(reducedState) {		
        const newVnode = view(reducedState, this);
		this._container = updateDOM(this._container, newVnode);

		return this._container;
	}

	function replay(events) {
		return events.reduce(function(state, event) {
			if (event.eventType === 'async.success') {
				state.asyncData = event.data;
				state.nestedData = true;
			} else if(event.eventType === 'async.error'){
				state.asyncError = event.data;
				state.nestedData = false;
			} else if(event.eventType === 'click') {
				state.syncData = event.data;
				state.nestedData = true;
			}

			return state;
		}, {}); 	
	}
}