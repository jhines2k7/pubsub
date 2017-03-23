export default class EventStore {
	constructor() {
		this.events = [];
	}

	filter(subscriptions) {
		//this._eventStore.filter(isEventForComponent(this._subscriptions));
		return this.events.filter(isEventForComponent(subscriptions));
	}

	add(event) {
		this.events.push(event);
	}
}

function isEventForComponent(subscriptions) {
	return (event) => {
		//return event.topic === topic && event.componentName === componentName;
		return subscriptions.hasOwnProperty(event.topic);
	}			
}