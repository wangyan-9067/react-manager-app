import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import GridListBase from './GridListBase';

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

const AnchorList = props => {
  const { root } = props;

	return (
		<div className={root}>
			<GridListBase>
				<TelebetTile joinChannel={joinChannel} leaveChannel={leaveChannel} assignTableToChannel={assignTableToChannel} />
			</GridListBase>
		</div>
	);
}

const StyledAnchorList = withStyles(styles)(AnchorList);

const mapStateToProps = state => {
	const { 
		voiceAppId,
		channelList,
		currentChannelId,
		isAnswerCall,
		isAnchorCall,
		waitingList
	} = state.voice;
	
  return ({
		voiceAppId,
		channelList,
		currentChannelId,
		isAnswerCall,
		isAnchorCall,
		waitingList
  });
};

export default connect(mapStateToProps, null)(StyledAnchorList);