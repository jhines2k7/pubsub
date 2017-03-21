import UserProfileComponent from './components/UserProfileComponent'
import ButtonComponent from './components/ButtonComponent'

import postal from 'postal'

import snabbdom from 'snabbdom';
import h from 'snabbdom/h';

const patch = snabbdom.init([                   // Init patch function with choosen modules
  require('snabbdom/modules/class'),          // makes it easy to toggle classes
  require('snabbdom/modules/props'),          // for setting properties on DOM elements
  require('snabbdom/modules/style'),          // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners'), // attaches event listeners
]);

/*var subscription = postal.subscribe({
    channel: "userProfile",
    topic: "profile.update",
    callback: function(data, envelope) {
        // `data` is the data published by the publisher. 
        // `envelope` is a wrapper around the data & contains 
        // metadata about the message like the channel, topic, 
        // timestamp and any other data which might have been 
        // added by the sender.
        console.log(data);
    }
});

postal.publish({
    channel: "userProfile",
    topic: "profile.update",
    data: {
        sku: "AZDTF4346",
        qty: 21
    }
});*/
let EventStore = [];

let container = document.getElementById('james');
let jamesComponent = new UserProfileComponent(container, EventStore);
jamesComponent.render('james');

container = document.getElementById('casey');
let caseyComponent = new UserProfileComponent(container, EventStore);
caseyComponent.render('casey');

setTimeout( () => {
	//jamesComponent.render('james orlando');
	//caseyComponent.render('casey weber');
	let buttton = new ButtonComponent();
	// some event occurs... a click event;
	buttton.publish('userProfile', 'profile.update', 'james orlando');
}, 3000);

setTimeout( () => {
	//jamesComponent.render('james orlando hines');
	//caseyComponent.render('casey weber mccarty');  
}, 6000);