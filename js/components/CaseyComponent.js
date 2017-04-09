let snabbdom = require('snabbdom');

let patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
]);

let h = require('snabbdom/h').default; // helper function for creating vnodes

import postal from 'postal/lib/postal.lodash'

// takes in the reduced component state and returns a vnode
function view(state, component) {
	let urlList = state.chapters.map(function(url){
			return h('li', url);
		});
	
	return h('div', [
		h('div', {style: {fontWeight: 'bold'}}, 'This is the casey component'),
		h('div', {style: {fontWeight: 'bold', color: 'blue', fontSize: 'xx-large'}, props: {id: 'name'}}, state.name),
		h('h1', {props: {id: 'heading'}}, `${state.heading}`),
		h('ul', urlList),
		h('div', { props: {id: 'nested'}}),
		h('h3',
			{style: {fontWeight: 'bold', color: 'red', fontSize: 'large'}}, 
			state.showAsyncError ? `${state.asyncErrorMessage} -- simulated error` : ''
		),
		h('hr')
	]);
}

function updateDOM(container, newVnode) {
	return patch(container, newVnode);
}

export default class CaseyComponent {
	constructor(container, eventStore) {
		this.eventStore = eventStore;
		this.container = container;
		this.subscriptions = {};
	}

	subscribe(channel, topic) {
		let subscription = postal.subscribe({
		    channel: channel,
		    topic: topic,
		    callback: function(data, envelope) {
		    	let events = this.eventStore.filter(this.subscriptions);

				let reducedState = this.reduce(events);

		    	this.render(reducedState);
		    }.bind(this)
		});

		this.subscriptions[topic] = subscription;
		
		return subscription;
	}

	subscribeAsync(topic, callback) {
		let asyncSubscription = postal.subscribe({
			channel: 'async',
			topic: topic,
			callback: callback.bind(this)    		    
		});

		this.subscriptions[topic] = asyncSubscription;
	}

	publish(event) {
		this.eventStore.add(event);
	}

	getSubscriptions() {
		return this.subscriptions;
	}

	getEventStore() {
		return this.eventStore;
	}

	render(state) {		
        const newVnode = view(state, this);
		this.container = updateDOM(this.container, newVnode);

		return this.container;
	}

	reduce(events) {
		return events.reduce(function(state, event) {
			state.name = event.data.name;
			state.heading = event.data.heading;
			
			state.chapters = event.data.chapters;		
			
			state.showAsyncError = event.data.showAsyncError;
			state.asyncErrorMessage = event.data.asyncErrorMessage;
			state.showNestedComponent = event.data.showNestedComponent;

			return state;
		}, {
		    name: '',
            heading: '',
            chapters: [],
            showAsyncError: false,
            asyncErrorMessage: '',
            showNestedComponent: true
        });
	}
}
