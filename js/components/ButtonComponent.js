export default class ButtonComponent {
	publish(channel, topic, data) {
		postal.publish({
		    channel: channel,
		    topic: topic,
		    data: data
		})
	}
}