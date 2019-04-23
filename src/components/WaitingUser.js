import React from 'react';
import PropTypes from 'prop-types';
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
	},
	listRoot: {
		width: '115%',
    backgroundColor: '#F5F5F5',
    marginLeft: '-10px',
		marginRight: '-10px',
    top: '0',
    left: '0',
    height: '100%',
    minHeight: '140px'
	}
});

const WaitingUser = ({ classes, waitingList, assignTokenToDelegator, kickDelegator }) => {
	const { title, listRoot } = classes;

	return (
		<div style={{ width: '100%' }}>
			<Typography color="inherit" align="left" className={title}>
				輪候中代理
			</Typography>
			<div className={listRoot}>
				<GridListBase list={waitingList} bgColor="#F5F5F5" customCols={6}>
					<WaitingUserTile assignTokenToDelegator={assignTokenToDelegator} kickDelegator={kickDelegator} />
				</GridListBase>
			</div>
		</div>
	);
};

WaitingUser.propTypes = {
	classes: PropTypes.object.isRequired,
	waitingList: PropTypes.array,
	assignTokenToDelegator: PropTypes.func,
	kickDelegator: PropTypes.func
};

export default withStyles(styles)(WaitingUser);