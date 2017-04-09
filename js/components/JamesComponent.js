let snabbdom = require('snabbdom');

let patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
]);

let h = require('snabbdom/h').default; // helper function for creating vnodes

import postal from 'postal/lib/postal.lodash'

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
		h('div',
            [
			    'James component can subscribe to updates from casey component: ',
			    h('span', {style: {fontWeight: 'bold', color: 'red'}}, state.caseyData.name)
		    ]),
		h('hr')	
	]);
}

function updateDOM(container, newVnode) {
	return patch(container, newVnode);
}

export default class JamesComponent {
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

	getSubscriptions() {
		return this.subscriptions;
	}

	render(state) {
        const newVnode = view(state);
		this.container = updateDOM(this.container, newVnode);

		return this.container;
	}

    reduce(events) {
        return events.reduce(function(state, event) {
			if(event.topic === 'component.update.casey') {
                state.caseyData.name = event.data.name;
                state.caseyData.heading = event.data.heading;
            }

            if(event.topic === 'component.update.james') {
                state.jamesData = event.data;
            }

            return state;
        }, {
        	jamesData: '',
			caseyData: {
        	    name: '',
                heading: ''
            }
		});
    }
}