class EventBus {
  constructor() {
    this._topics = {};
    this._eventStore = [];
    this._eventId = 0;
  }
  
  subscribe (topic, listener) {
    // create the topic if not yet created
    if(!this._topics[topic]) this._topics[topic] = [];

    // add the listener
    this._topics[topic].push(listener);
  }

  publish (topic, data) {
    // return if the topic doesn't exist, or there are no listeners
    if(!this._topics[topic] || this._topics[topic].length < 1) return;

    // send the event to all listeners
    this._topics[topic].forEach(function(listener) {
      listener(data || {});
    });
  }

  addEventToStore(event) {
    this._eventId++;
    this._eventStore.push(event);
  }

  getEventStore() {
    return this._eventStore;
  }
}

module.exports = EventBus;