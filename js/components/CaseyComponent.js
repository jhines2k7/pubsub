let snabbdom = require('snabbdom');

let patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
]);

let h = require('snabbdom/h').default; // helper function for creating vnodes

import postal from 'postal/lib/postal.lodash'
import NestedComponent from './NestedComponent'

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
		dynamic = h('h3', 
			{style: {fontWeight: 'bold', color: 'red', fontSize: 'large'}}, 
			`${state.asyncError.message} -- simulated error`
		);
	}
	
	return h('div', [
		h('div', {style: {fontWeight: 'bold'}}, 'This is the casey component'),
		h('div', {style: {fontWeight: 'bold', color: 'blue', fontSize: 'xx-large'}}, typeof state.syncData === 'undefined' ? '' : state.syncData),
		h('h1', `Async data: ${typeof state.asyncData === 'undefined' ? '' : state.asyncData.heading}`),
		state.nestedData ? nested.render() : null,
		dynamic,
		h('hr')
	]);
}

function updateDOM(container, newVnode) {
	return patch(container, newVnode);
}

export default class CaseyComponent {
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
		    	let events = this._eventStore.filter(this._subscriptions);

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
		this._eventStore.add(event);
	}

	getSubscriptions() {
		return this._subscriptions;
	}

	getEventStore() {
		return this._eventStore;
	}

	render(reducedState) {		
        const newVnode = view(reducedState, this);
		this._container = updateDOM(this._container, newVnode);

		return this._container;
	}

	replay(events) {
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