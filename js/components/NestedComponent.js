let snabbdom = require('snabbdom');

let patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
]);

let h = require('snabbdom/h').default; // helper function for creating vnodes

function view() {		
	return h('h1', 'Nested Component');
}

export default class NestedComponent {
	constructor(container) {
		this.container = container;
	}

	render() {		
        const newVnode = view();

		return patch(this.container, newVnode);
	}
}