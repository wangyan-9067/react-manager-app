import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import GridListBase from './GridListBase';
import SingleGridListBase from './SingleLineGridListBase';
import TelebetTile from './TelebetTile';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    padding: '5px',
    backgroundColor: '#E8E8E8',
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
			<SingleGridListBase />
		</div>
	);
}

TelebetList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TelebetList);