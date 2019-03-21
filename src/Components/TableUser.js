import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import SingleGridListBase from './SingleLineGridListBase';
import TableUserTile from './TableUserTile';

const styles = theme => ({
	title: {
		color: '#818181',
		fontSize: '1.125rem',
		fontWeight: 'bold',
		marginLeft: '10px'
	}
});

const TableUser = props => {
	const { classes } = props;

	return (
		<div>
			<Typography color="inherit" align="left" className={classes.title}>
				包桌中玩家
			</Typography>

			<SingleGridListBase>
				<TableUserTile />
			</SingleGridListBase>
		</div>
	);
};

export default withStyles(styles)(TableUser);