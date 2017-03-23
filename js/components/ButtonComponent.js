import postal from 'postal/lib/postal.lodash'

export default class ButtonComponent {
	constructor(eventStore){
		this._eventStore = eventStore;
	}

	publish(event) {
		postal.publish(event);
		this._eventStore.add(event);
	}
}