import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import GridListBase from './GridListBase';
import WaitingUserTile from './WaitingUserTile';
import { getLangConfig } from '../helpers/appUtils';

const styles = theme => ({
	root: {
		width: '100%'		
	},
	title: {
		color: '#666666',
		fontSize: '1.125rem',
		fontWeight: 'bold',
		marginLeft: '10px'
	},
	listRoot: {
		width: '100%',
    backgroundColor: '#F5F5F5',
    top: '0',
    left: '0',
    height: '100%',
    minHeight: '140px'
	},
	gridListRoot: {
		flexWrap: 'nowrap',
		transform: 'translateZ(0)',
    display: 'flex',
    padding: 0,
    overflowY: 'auto',
		listStyle: 'none',
		width: '100%'
	}
});

const WaitingUser = ({ classes, waitingList, assignTokenToDelegator, kickDelegator }) => {
	const { root, title, listRoot, gridListRoot } = classes;
	const langConfig = getLangConfig();

	return (
		<div className={root}>
			<Typography color="inherit" align="left" className={title} gutterBottom>
				{langConfig.WAITING_DELEGATOR}
			</Typography>
			<div className={listRoot}>
				<GridListBase list={waitingList} customCols={6} gridListRootClass={gridListRoot}>
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