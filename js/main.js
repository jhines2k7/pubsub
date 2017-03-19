import EventBus from './eventbus';

class Mailer {
	constructor(eventBus) {
    this._eventBus = eventBus;
    this._eventBus.subscribe('order/new', this.sendPurchaseEmail);  
  }

  sendPurchaseEmail(userEmail) {
    console.log("Sent email to " + userEmail);
  }  
}

class Order {
  constructor(params, eventBus) {
    this._eventBus = eventBus;
    this._params = params;
  }  

  saveOrder() {
    this._eventBus.publish('order/new', this._params.userEmail);
  }
};

let eventBus = new EventBus();

let mailer = new Mailer(eventBus);
let order = new Order({userEmail: 'casey@gmail.com'}, eventBus);
order.saveOrder();