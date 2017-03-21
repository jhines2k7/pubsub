let snabbdom = require('snabbdom');

let patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
]);

let h = require('snabbdom/h').default; // helper function for creating vnodes

function updateUserProfile(id) {
	let events = this._eventBus.getEventStore().filter(isOrderEvent(id));

	let reducedState = replay(events);

	// userId, userName, firstName, lastName, email
	//let container = document.getElementById('app');

	/*var vnode = h(this._container, [
	  h('span', {style: {fontWeight: 'bold'}}, reducedState.userName),
	  reducedState.firstName,
	  h('a', {props: {href: '/foo'}}, reducedState.lastName)
	]);*/

	//let vnode = h('div', {style: {fontWeight: 'bold'}}, reducedState.userName);	
}

function isOrderEvent(id) {
	return (event) => {
		return event.userId === id && event.componentName === 'userProfile';
	}			
}

function replay(events) {
	return events.reduce(function(obj, event) {		
		obj.userName = event.payload.userName;
		obj.firstName = event.payload.firstName;
		obj.lastName = event.payload.lastName;
		obj.email = event.payload.email;
		return obj;
	}, {});
 	/*{  	
	    userName: 'semaj',
	    firstName: 'James',
	    lastName: 'Hines',
	    email: 'jameshines10@gmail.com'  
  	};*/
}

// takes in a state object and returns a vnode
function view(state) {
	return h('div', state);
}

function updateDOM(container, newVnode) {
	return patch(container, newVnode);
}

export default class UserProfileComponent {
	constructor(container) {
		//this._eventBus = eventBus;		
		this._container = container;		
	}

	subscribe(topic, callback) {
		//this._eventBus.subscribe(topic, updateUserProfile.bind(this));
	}

	render(state) {
		const newVnode = view(state);
		this._container = updateDOM(this._container, newVnode);
	}
}