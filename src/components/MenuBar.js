import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

import DateTimeBadge from './DateTimeBadge';
import AnchorList from './AnchorList';
import TelebetList from './TelebetList';

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
  },
  tabContainer: {
    margin: '10px'
  }
});

const TabContainer = props => {
  const { classes } = props;

  return (
    <div className={classes.tabContainer}>{props.children}</div>
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
    const { 
      classes, 
      joinChannel,
      leaveChannel,
      assignTable,
      assignTableToChannel,
      toggleMuteChannel,
      kickoutClientFromDataServer,
      kickoutClient,
      blacklistClient,
      getAnchorList,
      addAnchor,
      deleteAnchor,
      setAnchorsDuty,
      getAnchorsDutyList
    } = this.props;
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
            </Tabs>
          </Toolbar>
        </AppBar>

        <Grid container>
          <Grid item xs={9}>
            {value === 0 && (
              <TabContainer classes={classes}>
                <AnchorList
                  getAnchorList={getAnchorList}
                  addAnchor={addAnchor}
                  deleteAnchor={deleteAnchor}
                  setAnchorsDuty={setAnchorsDuty}
                  getAnchorsDutyList={getAnchorsDutyList}
                />
              </TabContainer>
            )}
            {value === 1 && (
              <TabContainer classes={classes}>
                <TelebetList 
                  joinChannel={joinChannel}
                  leaveChannel={leaveChannel}
                  assignTable={assignTable}
                  assignTableToChannel={assignTableToChannel}
                  toggleMuteChannel={toggleMuteChannel}
                  kickoutClientFromDataServer={kickoutClientFromDataServer}
                  kickoutClient={kickoutClient}
                  blacklistClient={blacklistClient}
                />
              </TabContainer>
            )}
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      </div>
    );
  }
}

MenuBar.propTypes = {
  classes: PropTypes.object.isRequired,
  joinChannel: PropTypes.func,
  leaveChannel: PropTypes.func,
  assignTableToChannel: PropTypes.func,
  toggleMuteChannel: PropTypes.func,
  kickoutClient: PropTypes.func,
  blacklistClient: PropTypes.func
};

export default withStyles(styles)(MenuBar);