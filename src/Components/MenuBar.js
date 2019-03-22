import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

import DateTimeBadge from './DateTimeBadge';
import TelebetList from './TelebetList';
import TableList from './TableList';

const styles = theme => ({
  appBar: {
    backgroundColor: '#E8E8E8',
    color: '#3970B0'
  },
  root: {
    width: '100%',
  },
  tabsRoot: {
    borderBottom: '1px solid #E8E8E8',
  },
  tabsIndicator: {
    backgroundColor: '#3970B0',
  },
  tabRoot: {
    textTransform: 'initial',
    fontSize: '1.125rem',
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,
    '&:hover': {
      color: '#40a9ff',
    },
    '&:focus': {
      color: '#3970B0'
    },
  },
  tabSelected: {
    color: '#3970B0',
    fontWeight: 'bold'
  },
  grow: {
    flexGrow: 0.3,
  }
});

const TabContainer = props => {
  return (
    <div>{props.children}</div>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class MenuBar extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="inherit" className={classes.appBar}>
          <Toolbar>
            <DateTimeBadge />
            <div className={classes.grow} />
            <Tabs value={value} onChange={this.handleChange} classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}>
              <Tab label="主播排班" classes={{ root: classes.tabRoot, selected: classes.tabSelected }} />
              <Tab label="經理操作" classes={{ root: classes.tabRoot, selected: classes.tabSelected }} />
              <Tab label="桌台狀態" classes={{ root: classes.tabRoot, selected: classes.tabSelected }} />
            </Tabs>
          </Toolbar>
        </AppBar>

        <Grid container>
          <Grid item xs={9}>
            {value === 0 && <TabContainer>Item One</TabContainer>}
            {value === 1 && <TabContainer><TelebetList /></TabContainer>}
            {value === 2 && <TabContainer><TableList /></TabContainer>} 
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      </div>
    );
  }
}

MenuBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuBar);