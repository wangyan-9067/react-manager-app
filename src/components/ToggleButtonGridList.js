import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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
    minHeight: '60px',
    width: '160px',
    height: '100%',
    margin: '10px',
    backgroundColor: '#F1F1F1',
    float: 'left',
    borderRadius: '8px',
    textTransform: 'capitalize',
    '&:first-child': {
      borderRadius: '8px'
    },
    '&:not(:first-child)': {
      borderRadius: '8px'
    }
  },
  toggleButtonLabel: {
    justifyContent: 'left'
  }
});

const ToggleButtonGridList = ({ classes, list, isEdit, selectedValue, onChangeHandler, onClickHandler }) => {
  const [selected, setSelected] = useState();
  const { root, toggleButtonRoot, toggleButtonLabel, toggleListGroupRoot } = classes;
  const value = selectedValue || selected;
  const data = list;

  return (
    <div className={root}>
      <ToggleButtonGroup 
        classes={{ root: toggleListGroupRoot }}
        value={value}
        onChange={(event, value) => {
          if (onChangeHandler instanceof Function) {
            onChangeHandler(value);
          } else {
            setSelected(value);
          }

          if (onClickHandler instanceof Function) {
            onClickHandler();
          }
        }}
        exclusive={isEdit}
      >
        {data.map((item, index) => (
          <ToggleButton 
            key={index}
            classes={{ root: toggleButtonRoot, label: toggleButtonLabel }}
            value={item.value}
          >
            <AnchorTile item={item} />
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}

ToggleButtonGridList.propTypes = {
	classes: PropTypes.object.isRequired,
	bgColor: PropTypes.string,
	customCols: PropTypes.number,
	list: PropTypes.array,
	tileClass: PropTypes.string
};

const StyledToggleButtonGridList = withStyles(styles)(ToggleButtonGridList);

export default StyledToggleButtonGridList;