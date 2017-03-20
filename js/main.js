let EventBus = require('./eventbus');

let snabbdom = require('snabbdom');
let patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
]);
let h = require('snabbdom/h').default; // helper function for creating vnodes

/*
A component should publish and subscribe to events
Pass the event bus object to the component constructor
*/
class UserProfileComponent {
	constructor(eventBus, container) {
		this._eventBus = eventBus;

		this._eventBus.subscribe('profile/update', this.updateUserProfile);
		
		this._container = container;		
	}

	this._isOrderEvent(id) {
		return (event) => {
			return event.userId == id && event.componentName === 'userProfile';
		}			
	}

	this._replay(events) {
		return {};
	}

	updateUserProfile(id, userState) {
		let events = this._eventBus.getEventStore().filter(this._isOrderEvent(id))

		let reducedState = this._replay(events);

		// userId, userName, firstName, lastName, email
		let container = document.getElementById('app');

		var vnode = h(this._container, [
		  h('span', {style: {fontWeight: 'bold'}}, reducedState.userName),
		  ' and this is just normal text',
		  h('a', {props: {href: '/foo'}}, 'I\'ll take you places!')
		]);

		patch(container, vnode);
	}
}

{
  type: 'UPDATE_PROFILE',
  componentName: 'userProfile',
  eventId: 1,
  userId: 1,
  payload: {  	
    userName: 'semaj',
    firstName: 'James',
    lastName: 'Hines',
    email: 'jameshines10@gmail.com'  
  }
}

{
  type: 'UPDATE_PROFILE',
  componentName: 'userProfile',
  eventId: 2,
  userId: 2,
  payload: {  	
    userName: 'casey',
    firstName: 'Casey',
    lastName: 'McCarty',
    email: 'casey@gmail.com'  
  }
}

{
  type: 'UPDATE_PROFILE',
  componentName: 'userProfile',
  eventId: 3,
  userId: 1,
  payload: {  	
    userName: 'semaj',
    firstName: 'Jim',
    lastName: 'Hines',
    email: 'jimhines10@gmail.com'  
  }
}

class UserProfileViewModel {
	constructor(userId, userName, firstName, lastName, email) {
		this._userId = userId;
		this._userName = userName;
		this._firstName = firstName;
		this._lastName = lastName;
		this._email = email;
	}
}
