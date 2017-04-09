//import TabComponent from './components/TabComponent'
import CaseyComponent from './components/CaseyComponent'
import JamesComponent from './components/JamesComponent'
import ButtonComponent from './components/ButtonComponent'
import get from './async.js'
import EventStore from './EventStore'
import NestedComponent from './components/NestedComponent'

let eventStore = new EventStore();

let container = document.getElementById('casey');
let caseyComponent = new CaseyComponent(container, eventStore);
caseyComponent.render(caseyComponent.reduce([]));

container = document.getElementById('nested');
let nested = new NestedComponent(container);
nested.render();

container = document.getElementById('james');
let jamesComponent = new JamesComponent(container, eventStore);

caseyComponent.subscribe('sync', 'component.update.casey');
caseyComponent.subscribeAsync('component.update.casey.async.start', 
	function(data, envelope) {
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

                this.subscriptions['component.update.casey.async.success'] = {};

                this.publish(event);
                let events = this.eventStore.filter(this.subscriptions);
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

                this.subscriptions['component.update.casey.async.error'] = {};

                this.publish(event);
                let events = this.eventStore.filter(this.subscriptions);
                let reducedState = this.reduce(events);
                this.render(reducedState);
            }.bind(this));
    });

jamesComponent.subscribe('sync', 'component.update.james');
jamesComponent.subscribe('sync', 'component.update.casey');

let button = new ButtonComponent(eventStore);

let asyncStartEvent = {
    channel: "async",
    topic: "component.update.casey.async.start",      
    data: {
      url: '../story.json'
    }
};
button.publish(asyncStartEvent);

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

event = {
    channel: "sync",
    topic: "component.update.james",	    
    eventType: 'click',
    data: 'james'
};
button.publish(event);

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
    };
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
	};
	button.publish(event);
}, 18000);