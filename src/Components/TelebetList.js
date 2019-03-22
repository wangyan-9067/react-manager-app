import React from 'react';
import { connect } from 'react-redux';
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
	const { classes, channelList, assignAnchor } = props;

	return (
		<div className={classes.root}>
			<GridListBase list={channelList}>
				<TelebetTile sendAssignAnchorCMD={assignAnchor} />
			</GridListBase>
			<br /><br />
			<TableUser />
			<br /><br />
			<WaitingUser />
		</div>
	);
}

const StyledTelebetList = withStyles(styles)(TelebetList);

const mapStateToProps = state => {
	const { voiceAppId, channelList } = state.voice;
	
  return ({
		voiceAppId: voiceAppId,
    channelList: channelList
  });
};

export default connect(mapStateToProps, null)(StyledTelebetList);