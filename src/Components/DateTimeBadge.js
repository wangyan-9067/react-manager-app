import React, { Fragment }  from 'react';
import Moment from 'react-moment';
import Typography from '@material-ui/core/Typography';

import Clock from './Clock';

const DateTimeBadge = classes => {
	const currentDateTime = new Date();

	return (
		<Fragment>
			<Typography variant="body1" color="inherit" noWrap>
				<Moment format="YYYY-MM-DD">
						{currentDateTime}
				</Moment>
				<br />
				<Clock />
			</Typography>
		</Fragment>
	);
};

export default DateTimeBadge;