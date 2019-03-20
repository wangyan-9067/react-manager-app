import React from 'react';
import Moment from 'react-moment';

class Clock extends React.Component {
	state = {
			time: new Date()
	};

	componentDidMount() {
		this.timer = setInterval(() => this.tick(), 1000);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	tick() {
		this.setState({
				time: new Date()
		});
	}

	render() {
		return (
				<Moment format="HH:mm:ss">
						{this.state.time}
				</Moment>
		);
	}
}

export default Clock;