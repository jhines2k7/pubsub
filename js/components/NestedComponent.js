let snabbdom = require('snabbdom');

let patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
]);

let h = require('snabbdom/h').default; // helper function for creating vnodes

import postal from 'postal/lib/postal.lodash'

function view() {		
	return h('h1', 'Nested Component');
}

function updateDOM(container, newVnode) {
	return patch(container, newVnode);
}

export default class NestedComponent {
	constructor(container) {
		this._container = container;
		this._subscriptions = {};
	}
	
	publish(event) {
		postal.publish(event);
		this._eventStore.push(event);
	}

	getSubscriptions() {
		return this._subscriptions;
	}

	render() {		
        const newVnode = view();
		this._container = updateDOM(this._container, newVnode);

		return this._container;
	}
}