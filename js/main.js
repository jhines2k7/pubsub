import EventBus from './eventbus'
import UserProfileComponent from './components/UserProfileComponent'
import ButtonComponent from './components/ButtonComponent'

/*
A component should publish and subscribe to events
Pass the event bus object to the component constructor
*/

let eventBus = new EventBus();

let container = document.getElementById('casey');
let caseyComponent = new UserProfileComponent(eventBus, container)

container = document.getElementById('james');
let jamesComponent = new UserProfileComponent(eventBus, container);

let button = new ButtonComponent(eventBus);

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

caseyComponent.render('Casey');
jamesComponent.render('James');

setTimeout(function(){ 
	caseyComponent.render('Casey McCarty');
}, 3000);