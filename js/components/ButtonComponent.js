export default class ButtonComponent {
	constructor(eventStore){
		this.eventStore = eventStore;
	}

	publish(event) {
		this.eventStore.add(event);
	}
}