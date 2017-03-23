import UserComponent from './components/UserComponent'
import TabComponent from './components/TabComponent'
import CaseyComponent from './components/CaseyComponent'
import JamesComponent from './components/JamesComponent'
import ButtonComponent from './components/ButtonComponent'
import get from './async.js'
import EventStore from './EventStore'

/*get('../story.json').then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.error("Failed!", error);
});*/

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
let eventStore = new EventStore();

let container = document.getElementById('james');
let jamesComponent = new JamesComponent(container, eventStore);
jamesComponent.subscribe('userProfile', 'profile.update.james');
jamesComponent.subscribeAsync('profile.update.james.async.start', 
	function(data, envelope) {
    	/*console.log('Async event fired from JamesComponent before initial "click" event');				
    	setTimeout( () => {
			let event = {
				channel: 'async',
			    topic: 'profile.update.james.async.success',	    
			    eventType: 'async.success',
			    data: 'data returned from async-event'
			}
			
			this.publish(event);
			this.render();
		}, 8000);*/
		get(data.url).then(function(response) {
	  		console.log("Success!", response);
	  		let event = {
				channel: 'async',
			    topic: 'profile.update.james.async.success',	    
			    eventType: 'async.success',
			    data: JSON.parse(response)
			}

			this._subscriptions['profile.update.james.async.success'] = {};
			
			this.publish(event);
			let events = this._eventStore.filter(this._subscriptions);
			let reducedState = this.replay(events);			
			this.render(reducedState);
  						
		}.bind(this), 
		function(error) {
			console.error("Failed!", error);
	  		let event = {
				channel: 'async',
			    topic: 'profile.update.james.async.error',	    
			    eventType: 'async.error',
			    data: error
			}

			this._subscriptions['profile.update.james.async.error'] = {};
			
			this.publish(event);
			let events = this._eventStore.filter(this._subscriptions);
			let reducedState = this.replay(events);
			this.render(reducedState);
		}.bind(this));
    });

container = document.getElementById('casey');
let caseyComponent = new CaseyComponent(container, eventStore);
caseyComponent.subscribe('userProfile', 'profile.update.casey');
caseyComponent.subscribe('userProfile', 'profile.update.tab');

container = document.getElementById('tab');
let tabComponent = new TabComponent(container, eventStore);
tabComponent.subscribe('userProfile', 'profile.update.tab');
tabComponent.subscribe('userProfile', 'profile.update.james');

let button = new ButtonComponent(eventStore);

//fire an async event
let asyncEvent = {
    channel: "async",
    topic: "profile.update.james.async.start",      
    data: {
      url: '../story.json'
    }
}
button.publish(asyncEvent);
let events = jamesComponent.getEventStore().filter(jamesComponent.getSubscriptions());
let reducedState = jamesComponent.replay(events);
jamesComponent.render(reducedState);
// some event occurs... a click event;
let event = {
    channel: "userProfile",
    topic: "profile.update.james",      
    eventType: 'click',
    data: 'james'
}
button.publish(event);
events = jamesComponent.getEventStore().filter(jamesComponent.getSubscriptions());
reducedState = jamesComponent.replay(events);
jamesComponent.render(reducedState);

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
	let events = jamesComponent.getEventStore().filter(jamesComponent.getSubscriptions());
	let reducedState = jamesComponent.replay(events);
	jamesComponent.render(reducedState);

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
	let events = jamesComponent.getEventStore().filter(jamesComponent.getSubscriptions())
	let reducedState = jamesComponent.replay(events);
	jamesComponent.render(reducedState);;

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

setTimeout( () => {
	//fire a failed async event
	let asyncEvent = {
	    channel: "async",
	    topic: "profile.update.james.async.start",      
	    data: {
	      url: '../stoy.json'
	    }
	}
	button.publish(asyncEvent);
	let events = jamesComponent.getEventStore().filter(jamesComponent.getSubscriptions());
	let reducedState = jamesComponent.replay(events);
	jamesComponent.render(reducedState);
}, 10000);