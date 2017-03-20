let snabbdom = require('snabbdom');

let patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
]);

let h = require('snabbdom/h').default; // helper function for creating vnodes

let syntheticEvents = [
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
	},
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
	},
	{
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
	},
	{
	  type: 'UPDATE_PROFILE',
	  componentName: 'userProfile',
	  eventId: 4,
	  userId: 1,
	  payload: {  	
	    userName: 'jimmy',
	    firstName: 'JimJam',
	    lastName: 'Hines',
	    email: 'jimmmyhines10@gmail.com'  
	  }
	}
]

function updateUserProfile(id) {
	console.log('Subscribe function called', id);
	//let events = this._eventBus.getEventStore().filter(isOrderEvent(id));
	let events = syntheticEvents.filter(isOrderEvent(id));
	console.log('Events filtered by id:', id, events);
	let reducedState = replay(events);

	// userId, userName, firstName, lastName, email
	//let container = document.getElementById('app');

	/*var vnode = h(this._container, [
	  h('span', {style: {fontWeight: 'bold'}}, reducedState.userName),
	  reducedState.firstName,
	  h('a', {props: {href: '/foo'}}, reducedState.lastName)
	]);*/

	//let vnode = h('div', {style: {fontWeight: 'bold'}}, reducedState.userName);
	let vnode = h('div', {style: {fontWeight: 'bold'}}, reducedState.userName);

	patch(this._container, vnode);
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

export default class UserProfileComponent {
	constructor(eventBus, container) {
		this._eventBus = eventBus;		
		this._container = container;
		this._eventBus.subscribe('profile/update', updateUserProfile.bind(this));
	}
}