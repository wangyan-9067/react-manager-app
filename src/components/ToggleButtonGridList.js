import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import AnchorTile from './AnchorTile';

const styles = theme => ({
  root: {
    width: '100%',
    height: '480px',
    overflow: 'auto',
    margin: '10px 0'
  },
  toggleButtonRoot: {
    height: '100%',
    margin: '10px',
    backgroundColor: '#F1F1F1',
    float: 'left'
  },
  toggleButtonSelected: {
    backgroundColor: '#F1F1F1'
  }
});

const ToggleButtonGridList = props => {
  const [selected, setSelected] = useState();
  const { classes, list } = props;
  const { root, toggleButtonRoot, toggleButtonSelected, toggleListGroupRoot } = classes;
	const data = list;

  return (
    <div className={root}>
      <ToggleButtonGroup classes={{ root: toggleListGroupRoot }} value={selected} onChange={(event, value) => {
        setSelected(value);
      }}>
        {data.map((item, index) => (
          <ToggleButton classes={{ root: toggleButtonRoot, selected: toggleButtonSelected }} value={item.value}>
            <AnchorTile item={item} />
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}

ToggleButtonGridList.propTypes = {
	classes: PropTypes.object.isRequired,
	children: PropTypes.object.isRequired,
	width: PropTypes.number,
	bgColor: PropTypes.string,
	customCols: PropTypes.number,
	list: PropTypes.array,
	tileClass: PropTypes.string
};

const StyledToggleButtonGridList = withStyles(styles)(ToggleButtonGridList);

export default withWidth()(StyledToggleButtonGridList);