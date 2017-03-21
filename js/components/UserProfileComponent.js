let snabbdom = require('snabbdom');

let patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
]);

let h = require('snabbdom/h').default; // helper function for creating vnodes

import postal from 'postal'

function isEventForComponent(componentName) {
	return (event) => {
		//return event.topic === topic && event.componentName === componentName;
		return event.componentName === componentName;
	}			
}

function replay(events) {
	return events.reduce(function(state, event) {		
		/*obj.userName = event.payload.userName;
		obj.firstName = event.payload.firstName;
		obj.lastName = event.payload.lastName;
		obj.email = event.payload.email;*/
		state = event.data
		return state;
	}, ''); 	
}

// takes in a state object and returns a vnode
function view(state) {
	return h('div', state);
}

function updateDOM(container, newVnode) {
	return patch(container, newVnode);
}

let synthEvents = [
	{
	    channel: "userProfile",
	    topic: "profile.update.james",	    
	    eventType: 'click',
	    componentName: 'james',
	    data: 'james'
	},
	{
	    channel: "userProfile",
	    topic: "profile.update.james",	    
	    eventType: 'click',
	    componentName: 'james orlando',
	    data: 'james'
	},
	{
	    channel: "userProfile",
	    topic: "profile.update.james",	    
	    eventType: 'click',
	    componentName: 'james',
	    data: 'james orlando hines'
	},
	{
	    channel: "userProfile",
	    topic: "profile.update.casey",	    
	    eventType: 'click',
	    componentName: 'casey',
	    data: 'casey mccarty'
	},
	{
	    channel: "userProfile",
	    topic: "profile.update.james",	    
	    eventType: 'click',
	    componentName: 'james',
	    data: 'hines james orlando'
	},
	{
	    channel: "userProfile",
	    topic: "profile.update.casey",	    
	    eventType: 'click',
	    componentName: 'casey',
	    data: 'casey casey'
	}
]

export default class UserProfileComponent {
	constructor(container, eventStore, name) {
		this._eventStore = eventStore;		
		this._container = container;
		this._componentName = name;
	}

	subscribe(channel, topic) {
		postal.subscribe({
		    channel: channel,
		    topic: topic,
		    callback: function(data, envelope) {
		    	// `data` is the data published by the publisher. 
		        // `envelope` is a wrapper around the data & contains 
		        // metadata about the message like the channel, topic, 
		        // timestamp and any other data which might have been 
		        // added by the sender.
		        console.log(data);

		    	this.render();
		    }.bind(this)
		});
	}

	render() {
		let events = this._eventStore.filter(isEventForComponent(this._componentName));
		//let events = synthEvents.filter(isEventForComponent(this._componentName));

		let reducedState = replay(events);

        const newVnode = view(reducedState);
		this._container = updateDOM(this._container, newVnode);
	}
}