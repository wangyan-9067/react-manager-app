import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import GridListBase from './GridListBase';
import TableTile from './TableTile';

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

function TableList(props) {
	const { classes } = props;

  return (
    <div className={classes.root}>
      <GridListBase>
				<TableTile />
      </GridListBase>
    </div>
  );
}

TableList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableList);