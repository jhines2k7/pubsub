let snabbdom = require('snabbdom');

let patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
]);

let h = require('snabbdom/h').default; // helper function for creating vnodes

export default class UserProfileComponent {
	constructor(eventBus, container) {
		this._eventBus = eventBus;
		this._eventBus.subscribe('profile/update', this.updateUserProfile.bind(this));
		this._container = container;		
	}

	updateUserProfile(id) {
		let events = this._eventBus.getEventStore().filter(this.isOrderEvent(id))

		let reducedState = this.replay(events);

		// userId, userName, firstName, lastName, email
		//let container = document.getElementById('app');

		var vnode = h(this._container, [
		  h('span', {style: {fontWeight: 'bold'}}, reducedState.userName),
		  reducedState.firstName,
		  h('a', {props: {href: '/foo'}}, reducedState.lastName)
		]);

		patch(this._container, vnode);
	}

	isOrderEvent(id) {
		return (event) => {
			return event.userId == id && event.componentName === 'userProfile';
		}			
	}

	replay(events) {
		return {  	
		    userName: 'semaj',
		    firstName: 'James',
		    lastName: 'Hines',
		    email: 'jameshines10@gmail.com'  
	  	};
	}
}