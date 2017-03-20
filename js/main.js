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
		this._eventBus.subscribe('profile/update', this._updateUserProfile);
		this._container = container;		
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

	updateUserProfile(id) {
		let events = this._eventBus.getEventStore().filter(this._isOrderEvent(id))

		let reducedState = this._replay(events);

		// userId, userName, firstName, lastName, email
		//let container = document.getElementById('app');

		var vnode = h(this._container, [
		  h('span', {style: {fontWeight: 'bold'}}, reducedState.userName),
		  reducedState.firstName,
		  h('a', {props: {href: '/foo'}}, reducedState.lastName)
		]);

		patch(container, vnode);
	}
}

class ButtonComponent {
	updateUserProfile(event) {
		this._eventBus.publish('profile/update', event.userId);
		this._eventBus.addEventToStore(event);
	}
}

let eventBus = new EventBus();

let container = document.getElementById('casey');
let caseyComponent = new UserProfileComponent(eventBus, container)

container = document.getElementById('james');
let jamesComponent = new UserProfileComponent(eventBus, container)

container = document.getElementById('tab');
let tabComponent = new UserProfileComponent(eventBus, container)

let button = new ButtonComponent();

let profileEvent = {
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

console.log('Update profile event sent to james component');
button.updateUserProfile(profileEvent);

profileEvent = {
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

console.log('Update profile event sent to casey component');
button.updateUserProfile(profileEvent);

profileEvent = {
  type: 'UPDATE_PROFILE',
  componentName: 'userProfile',
  eventId: 3,
  userId: 1,
  payload: {  	
    userName: 'james',
    firstName: 'Jim',
    lastName: 'Hines',
    email: 'jimhines10@gmail.com'  
  }
}

console.log('Update profile event sent to james component');
button.updateUserProfile(profileEvent);
