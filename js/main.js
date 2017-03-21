import UserProfileComponent from './components/UserProfileComponent'
import ButtonComponent from './components/ButtonComponent'

import postal from 'postal'

var subscription = postal.subscribe({
    channel: "orders",
    topic: "item.add",
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
    channel: "orders",
    topic: "item.add",
    data: {
        sku: "AZDTF4346",
        qty: 21
    }
});