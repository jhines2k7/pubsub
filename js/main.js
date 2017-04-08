//import TabComponent from './components/TabComponent'
import CaseyComponent from './components/CaseyComponent'
import JamesComponent from './components/JamesComponent'
import ButtonComponent from './components/ButtonComponent'
import get from './async.js'
import EventStore from './EventStore'
import NestedComponent from './components/NestedComponent'

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

container = document.getElementById('james');
let jamesComponent = new JamesComponent(container, eventStore);

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
		get(data.url).then(
		    function(response) {
                console.log("Success!", response);
                let parsed = JSON.parse(response);

                let stateData = {
                    name: document.getElementById('name').innerText,
                    heading: parsed.heading,
                    chapters: parsed.chapterUrls,
                    showAsyncError: false,
                    asyncErrorMessage: '',
                    showNestedComponent: true
                };

                let event = {
                    channel: 'async',
                    topic: 'component.update.casey.async.success',
                    eventType: 'async.success',
                    data: stateData
                };

                this._subscriptions['component.update.casey.async.success'] = {};

                this.publish(event);
                let events = this._eventStore.filter(this._subscriptions);
                let reducedState = this.reduce(events);
                this.render(reducedState);
            }.bind(this),
            function(error) {
                console.error("Failed!", error);

                let stateData = {
                    name: document.getElementById('name').innerText,
                    heading: '',
                    chapters: [],
                    showAsyncError: true,
                    asyncErrorMessage: error.message,
                    showNestedComponent: false
                };

                let event = {
                    channel: 'async',
                    topic: 'component.update.casey.async.error',
                    eventType: 'async.error',
                    data: stateData
                };

                this._subscriptions['component.update.casey.async.error'] = {};

                this.publish(event);
                let events = this._eventStore.filter(this._subscriptions);
                let reducedState = this.reduce(events);
                this.render(reducedState);
            }.bind(this));
    });

jamesComponent.subscribe('sync', 'component.update.james');
jamesComponent.subscribe('sync', 'component.update.casey');

/*container = document.getElementById('tab');
let tabComponent = new TabComponent(container, eventStore);
tabComponent.subscribe('sync', 'profile.update.tab');
tabComponent.subscribe('sync', 'profile.update.james');*/

let button = new ButtonComponent(eventStore);

//fire an async event
let asyncStartEvent = {
    channel: "async",
    topic: "component.update.casey.async.start",      
    data: {
      url: '../story.json'
    }
};
button.publish(asyncStartEvent);

// some event occurs... a click event;
// values for heading and chapter are hardcoded...
// must find a way to get those values and update
// them before publishing the event to the stream
// caseyComponent.state.heading
let listElements = document.querySelectorAll('li');
let list = [];

listElements.forEach( (element) => { list.push(element.innerText) });

let event = {
    channel: "sync",
    topic: "component.update.casey",      
    eventType: 'click',
    data: {
		name: 'casey',
		heading: document.getElementById('heading') ? document.getElementById('heading').innerText : '',
		chapters: list,
		showAsyncError: false,
		asyncErrorMessage: '',
		showNestedComponent: true
	}
};
button.publish(event);
let events = caseyComponent.getEventStore().filter(caseyComponent.getSubscriptions());
let reducedState = caseyComponent.reduce(events);
caseyComponent.render(reducedState);

container = document.getElementById('nested');
let nested = new NestedComponent(container);
nested.render();

event = {
    channel: "sync",
    topic: "component.update.james",	    
    eventType: 'click',
    data: 'james'
};
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
	let listElements = document.querySelectorAll('li');
	let list = [];

	listElements.forEach( (element) => { list.push(element.innerText) });

	// some event occurs sometime later... a click event for example;
	let event = {
	    channel: "sync",
	    topic: "component.update.casey",	    
	    eventType: 'click',
	    data: {
			name: 'casey weber',
			heading: document.getElementById('heading') ? document.getElementById('heading').innerText : '',
			chapters: list,
			showAsyncError: false,
			asyncErrorMessage: '',
			showNestedComponent: true
		}
	};
	button.publish(event);
	let events = caseyComponent.getEventStore().filter(caseyComponent.getSubscriptions());
	let reducedState = caseyComponent.reduce(events);
	caseyComponent.render(reducedState);

	event = {
	    channel: "sync",
	    topic: "component.update.james",	    
	    eventType: 'click',
	    data: 'james hines'
	};
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
	let listElements = document.querySelectorAll('li');
	let list = [];

	listElements.forEach( (element) => { list.push(element.innerText) });		

	let event = {
	    channel: "sync",
	    topic: "component.update.casey",	    
	    eventType: 'click',
	    data: {
			name: 'casey weber mccarty',
			heading: document.getElementById('heading') ? document.getElementById('heading').innerText : '',
			chapters: list,
			showAsyncError: false,
			asyncErrorMessage: '',
			showNestedComponent: true
		}
	};
	button.publish(event);
	let events = caseyComponent.getEventStore().filter(caseyComponent.getSubscriptions());
	let reducedState = caseyComponent.reduce(events);
	caseyComponent.render(reducedState);

	event = {
	    channel: "sync",
	    topic: "component.update.james",	    
	    eventType: 'click',
	    data: 'james orlando hines'
	};
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

// remove an item in the list of chapters
setTimeout( () => {
	let listElements = document.querySelectorAll('li');
	let list = [];

	listElements.forEach( (element) => { list.push(element.innerText) });
	
	// remove the second ele
	let event = {
	    channel: "sync",
	    topic: "component.update.casey",	    
	    eventType: 'click',
	    data: {
			name: document.getElementById('name').innerText,
			heading: document.getElementById('heading') ? document.getElementById('heading').innerText : '',
			chapters: list.filter( (item) => { return item !== 'chapter-3.json' } ),
			showAsyncError: false,
			asyncErrorMessage: '',
			showNestedComponent: true
		}
	};
	button.publish(event);
	let events = caseyComponent.getEventStore().filter(caseyComponent.getSubscriptions());
	let reducedState = caseyComponent.reduce(events);
	caseyComponent.render(reducedState);
}, 15000);

// adds two items in the list of chapters
setTimeout( () => {
	let listElements = document.querySelectorAll('li');
	let list = [];

	listElements.forEach( (element) => { list.push(element.innerText) });

	list.push('chapter-7.json');
	list.push('chapter-8.json');
	
	let event = {
	    channel: "sync",
	    topic: "component.update.casey",	    
	    eventType: 'click',
	    data: {
			name: document.getElementById('name').innerText,
			heading: document.getElementById('heading') ? document.getElementById('heading').innerText : '',
			chapters: list,
			showAsyncError: false,
			asyncErrorMessage: '',
			showNestedComponent: true
		}
	}
	button.publish(event);
	let events = caseyComponent.getEventStore().filter(caseyComponent.getSubscriptions())
	let reducedState = caseyComponent.reduce(events);
	caseyComponent.render(reducedState);
}, 18000);