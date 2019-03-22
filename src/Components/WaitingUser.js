import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import GridListBase from './GridListBase';
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
		<div style={{ width: '100%' }}>
			<Typography color="inherit" align="left" className={classes.title}>
				等候中玩家
			</Typography>
			<GridListBase customCols={6}>
				<TableUserTile />
			</GridListBase>
		</div>
	);
};

export default withStyles(styles)(TableUser);