import UserComponent from './components/UserComponent'
import TabComponent from './components/TabComponent'
import CaseyComponent from './components/CaseyComponent'
import JamesComponent from './components/JamesComponent'
import ButtonComponent from './components/ButtonComponent'

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
    eventType: 'click',
    data: {
        sku: "AZDTF4346",
        qty: 21
    }
});*/
let EventStore = [];

let container = document.getElementById('james');
let jamesComponent = new JamesComponent(container, EventStore);
jamesComponent.subscribe('userProfile', 'profile.update.james');
//jamesComponent.render();

container = document.getElementById('casey');
let caseyComponent = new CaseyComponent(container, EventStore);
caseyComponent.subscribe('userProfile', 'profile.update.casey');
caseyComponent.subscribe('userProfile', 'profile.update.tab');

container = document.getElementById('tab');
let tabComponent = new TabComponent(container, EventStore);
tabComponent.subscribe('userProfile', 'profile.update.tab');
tabComponent.subscribe('userProfile', 'profile.update.james');

let button = new ButtonComponent(EventStore);

//fire an async event
let asyncEvent = {
    channel: "userProfile",
    topic: "profile.update.james",      
    eventType: 'async.start',
    data: {
      url: 'getTwitterFollowers.php',
      type: 'GET',
      data: 'twitterUsername=jquery4u'
    }
}
console.log('Async event fired from James Component before initial "click" event');
button.publish(asyncEvent);

// some event occurs... a click event;
let event = {
    channel: "userProfile",
    topic: "profile.update.james",      
    eventType: 'click',
    data: 'james'
}
button.publish(event);
jamesComponent.render();

event = {
    channel: "userProfile",
    topic: "profile.update.casey",	    
    eventType: 'click',
    data: 'casey'
}
button.publish(event);
caseyComponent.render();

event = {
    channel: "userProfile",
    topic: "profile.update.tab",	    
    eventType: 'click',
    data: 'tab'
}
button.publish(event);
tabComponent.render();

setTimeout( () => {		
	// some event occurs... a click event for example;
	let event = {
	    channel: "userProfile",
	    topic: "profile.update.james",	    
	    eventType: 'click',
	    data: 'james orlando'
	}
	button.publish(event);
	jamesComponent.render();

	event = {
	    channel: "userProfile",
	    topic: "profile.update.casey",	    
	    eventType: 'click',
	    data: 'casey weber'
	}
	button.publish(event);
	caseyComponent.render();

	event = {
	    channel: "userProfile",
	    topic: "profile.update.tab",	    
	    eventType: 'click',
	    data: 'tabitha deanne'
	}
	button.publish(event);
	tabComponent.render();
}, 3000);

setTimeout( () => {
	let event = {
	    channel: "userProfile",
	    topic: "profile.update.james",	    
	    eventType: 'click',
	    data: 'james orlando hines'
	}
	button.publish(event);
	jamesComponent.render();

	event = {
	    channel: "userProfile",
	    topic: "profile.update.casey",	    
	    eventType: 'click',
	    data: 'casey weber mccarty'
	}
	button.publish(event);
	caseyComponent.render();

	event = {
	    channel: "userProfile",
	    topic: "profile.update.tab",	    
	    eventType: 'click',
	    data: 'tabitha deanne morgan'
	}
	button.publish(event);
	tabComponent.render();
}, 6000);