import React, { Fragment }  from 'react';
import Moment from 'react-moment';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Clock from './Clock';

const styles = {
  badgeLabel: {
    fontSize: '1rem'
  }
};

const DateTimeBadge = classes => {
	const { badgeLabel } = classes;
	const currentDateTime = new Date();

	return (
		<Fragment>
			<Typography variant="contained" color="inherit" className={badgeLabel} noWrap>
				<Moment format="YYYY-MM-DD">
						{currentDateTime}
				</Moment>
				<br />
				<Clock />
			</Typography>
		</Fragment>
	);
};

export default withStyles(styles)(DateTimeBadge);