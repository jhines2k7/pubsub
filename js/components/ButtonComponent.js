export default class ButtonComponent {
	constructor(eventBus) {
		this._eventBus = eventBus;
	}

	updateUserProfile(event) {
		this._eventBus.publish('profile/update', event.userId);
		this._eventBus.addEventToStore(event);
	}
}