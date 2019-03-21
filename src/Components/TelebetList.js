import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import GridListBase from './GridListBase';
import TableUser from './TableUser';
import TelebetTile from './TelebetTile';
import WaitingUser from './WaitingUser';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    padding: '5px',
		backgroundColor: '#FFFFFF',
		borderRadius: '10px'
	}
});

const TelebetList = props => {
	const { classes } = props;

	return (
		<div className={classes.root}>
			<GridListBase>
				<TelebetTile />
			</GridListBase>
			<br /><br />
			<TableUser />
			<br /><br />
			<WaitingUser />
		</div>
	);
}

export default withStyles(styles)(TelebetList);