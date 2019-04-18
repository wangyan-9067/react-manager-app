import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  listClass: {
    backgroundColor: theme.palette.background.paper,
  }
});

const generate = (element, list) => {
  return list.map(item =>
    React.cloneElement(element, {
      item
    }),
  );
};

const TextList = ({ classes, list, dataItem: DataItem }) => {
  const { root, listClass } = classes;
  return (
    <div className={root}>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <div className={listClass}>
            <List dense={true}>
              {generate(<DataItem />, list)}
            </List>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

TextList.propTypes = {
  classes: PropTypes.object.isRequired,
  list: PropTypes.array.isRequired,
  dataItem: PropTypes.object.isRequired
};

export default withStyles(styles)(TextList);