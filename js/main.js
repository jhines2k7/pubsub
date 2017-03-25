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

/*
{
  "heading": "A story about something",
  "chapterUrls": [
    "chapter-1.json",
    "chapter-2.json",
    "chapter-3.json",
    "chapter-4.json",
    "chapter-5.json"
  ]
}
*/
let eventStore = new EventStore();

let container = document.getElementById('casey');
let caseyComponent = new CaseyComponent(container, eventStore);
caseyComponent.subscribe('sync', 'component.update.casey');
caseyComponent.subscribeAsync('component.update.casey.async.start', 
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
	  		let parsed = JSON.parse(response);
	  		let event = {
				channel: 'async',
			    topic: 'component.update.casey.async.success',	    
			    eventType: 'async.success',
			    data: {
			    	name: 'casey weber mccarty',
			    	heading: parsed.heading,
			    	chapters: parsed.chapterUrls,
			    	showAsyncError: false,
			    	asyncErrorMessage: '',	    	
			    	showNestedComponent: true
			    }
			}

			this._subscriptions['component.update.casey.async.success'] = {};
			
			this.publish(event);
			let events = this._eventStore.filter(this._subscriptions);
			let reducedState = this.replay(events);			
			this.render(reducedState);
  						
		}.bind(this), 
		function(error) {
			console.error("Failed!", error);
	  		let event = {
				channel: 'async',
			    topic: 'component.update.casey.async.error',	    
			    eventType: 'async.error',
			    data: {
			    	name: 'casey weber mccarty',
			    	heading: '',
			    	chapters: [],
			    	showAsyncError: true,
			    	asyncErrorMessage: error.message,
			    	showNestedComponent: false
			    }
			}

			this._subscriptions['component.update.casey.async.error'] = {};
			
			this.publish(event);
			let events = this._eventStore.filter(this._subscriptions);
			let reducedState = this.replay(events);
			this.render(reducedState);
		}.bind(this));
    });

container = document.getElementById('james');
let jamesComponent = new JamesComponent(container, eventStore);
jamesComponent.subscribe('sync', 'component.update.james');
jamesComponent.subscribe('sync', 'component.update.casey');

/*container = document.getElementById('tab');
let tabComponent = new TabComponent(container, eventStore);
tabComponent.subscribe('sync', 'profile.update.tab');
tabComponent.subscribe('sync', 'profile.update.james');*/

let button = new ButtonComponent(eventStore);

//fire an async event
let asyncEvent = {
    channel: "async",
    topic: "component.update.casey.async.start",      
    data: {
      url: '../story.json'
    }
}
button.publish(asyncEvent);

// some event occurs... a click event;
let event = {
    channel: "sync",
    topic: "component.update.casey",      
    eventType: 'click',
    data: {
    	name: 'casey',
    	heading: 'A story about something',
    	chapters: [
		    "chapter-1.json",
		    "chapter-2.json",
		    "chapter-3.json",
		    "chapter-4.json",
		    "chapter-5.json"
	  	],
    	showAsyncError: false,
    	asyncErrorMessage: '',
    	showNestedComponent: true
    }
}
button.publish(event);
let events = caseyComponent.getEventStore().filter(caseyComponent.getSubscriptions());
let reducedState = caseyComponent.replay(events);
caseyComponent.render(reducedState);

event = {
    channel: "sync",
    topic: "component.update.james",	    
    eventType: 'click',
    data: 'james'
}
button.publish(event);
jamesComponent.render();

/*event = {
    channel: "sync",
    topic: "profile.update.tab",	    
    eventType: 'click',
    data: 'tab'
}
button.publish(event);
tabComponent.render();*/

setTimeout( () => {		
	// some event occurs sometime later... a click event for example;
	let event = {
	    channel: "sync",
	    topic: "component.update.casey",	    
	    eventType: 'click',
	    data: {
	    	name: 'casey weber',
	    	heading: 'A story about something',
	    	chapters: [
			    "chapter-1.json",
			    "chapter-2.json",
			    "chapter-3.json",
			    "chapter-4.json",
			    "chapter-5.json"
		  	],
	    	showAsyncError: false,
	    	asyncErrorMessage: '',
	    	showNestedComponent: true
	    }
	}
	button.publish(event);
	let events = caseyComponent.getEventStore().filter(caseyComponent.getSubscriptions());
	let reducedState = caseyComponent.replay(events);
	caseyComponent.render(reducedState);

	event = {
	    channel: "sync",
	    topic: "component.update.james",	    
	    eventType: 'click',
	    data: 'james hines'
	}
	button.publish(event);
	jamesComponent.render();

	/*event = {
	    channel: "sync",
	    topic: "profile.update.tab",	    
	    eventType: 'click',
	    data: 'tabitha deanne'
	}
	button.publish(event);
	tabComponent.render();*/
}, 3000);

setTimeout( () => {
	let event = {
	    channel: "sync",
	    topic: "component.update.casey",	    
	    eventType: 'click',
	    data: {
	    	name: 'casey weber mccarty',
	    	heading: 'A story about something',
	    	chapters: [
			    "chapter-1.json",
			    "chapter-2.json",
			    "chapter-3.json",
			    "chapter-4.json",
			    "chapter-5.json"
		  	],
	    	showAsyncError: false,
	    	asyncErrorMessage: '',
	    	showNestedComponent: true
	    }
	}
	button.publish(event);
	let events = caseyComponent.getEventStore().filter(caseyComponent.getSubscriptions())
	let reducedState = caseyComponent.replay(events);
	caseyComponent.render(reducedState);;

	event = {
	    channel: "sync",
	    topic: "component.update.james",	    
	    eventType: 'click',
	    data: 'james orlando hines'
	}
	button.publish(event);
	jamesComponent.render();

	/*event = {
	    channel: "sync",
	    topic: "profile.update.tab",	    
	    eventType: 'click',
	    data: 'tabitha deanne morgan'
	}
	button.publish(event);
	tabComponent.render();*/
}, 6000);

setTimeout( () => {
	//fire a failed async event
	let asyncEvent = {
	    channel: "async",
	    topic: "component.update.casey.async.start",      
	    data: {
	      url: '../stoy.json'
	    }
	}
	button.publish(asyncEvent);
}, 9000);

setTimeout( () => {
    console.log("Firing a final async event");
    let asyncEvent = {
        channel: "async",
        topic: "component.update.casey.async.start",      
        data: {
            url: '../story.json'
        }
    }
    button.publish(asyncEvent);
}, 12000);