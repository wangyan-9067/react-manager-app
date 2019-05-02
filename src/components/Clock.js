import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';

const Clock = () => {
	const [time, setTime] = useState(new Date());
	const tick = () => {
		setTime(new Date());
	}
	let timer;

	useEffect(() => {
		timer = setInterval(() => tick(), 1000);

		return () => {
      clearInterval(timer);
    }
	})

	return (
		<Moment format="HH:mm:ss">
			{time}
		</Moment>
	);
}

export default Clock;