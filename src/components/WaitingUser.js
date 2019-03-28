import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import GridListBase from './GridListBase';
import WaitingUserTile from './WaitingUserTile';

const styles = theme => ({
	title: {
		color: '#666666',
		fontSize: '1.125rem',
		fontWeight: 'bold',
		marginLeft: '10px'
	}
});

const WaitingUser = props => {
	let { classes, waitingList } = props;

	return (
		<div style={{ width: '100%' }}>
			<Typography color="inherit" align="left" className={classes.title}>
				等候中玩家
			</Typography>
			<GridListBase list={waitingList} bgColor="#F5F5F5" customCols={6}>
				<WaitingUserTile />
			</GridListBase>
		</div>
	);
};

export default withStyles(styles)(WaitingUser);