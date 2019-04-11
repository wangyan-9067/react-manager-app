import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import DateTimeBadge from './DateTimeBadge';
import AnchorList from './AnchorList';
import TelebetList from './TelebetList';
import TableList from './TableList';
import AnchorStatusList from './AnchorStatusList';
import ManagerList from './ManagerList';

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
    fontSize: '1.25rem',
    fontWeight: theme.typography.fontWeightRegular,
    minWidth: 72,
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
  grow1: {
    flexGrow: 0.2,
  },
  menuButton: {
    margin: '0 5px',
    padding: '3px 20px',
		fontSize: '1rem'
  },
  tabContainer: {
    margin: '10px'
  },
  secondary: {
    color: '#3970B0'
  },
  bold: {
    fontWeight: 'bold'
  },
  managerName: {
    fontSize: '1rem'
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
      getAnchorsDutyList,
      logout,
      managerLoginname,
      getManagerList,
      addManager,
      deleteManager,
      managerLevel
    } = this.props;
    const { value } = this.state;
    const {
      root,
      appBar,
      grow,
      grow1,
      tabsRoot,
      tabsIndicator,
      tabRoot,
      tabSelected,
      menuButton,
      secondary,
      bold,
      managerName
    } = classes;

    return (
      <div className={root}>
        <AppBar position="static" color="inherit" className={appBar}>
          <Toolbar>
            <DateTimeBadge />
            <div className={grow} />
            <Tabs value={value} onChange={this.handleChange} classes={{ root: tabsRoot, indicator: tabsIndicator }}>
              <Tab label="主播排班" classes={{ root: tabRoot, selected: tabSelected }} />
              <Tab label="經理操作" classes={{ root: tabRoot, selected: tabSelected }} />
              <Tab label="桌台狀態" classes={{ root: tabRoot, selected: tabSelected }} />
            </Tabs>
            <div className={grow1} />
            <Button variant="contained" size="medium" color="inherit" className={menuButton}>遊戲記錄</Button>
            <div className={grow1} />
            <List>
              <ListItem alignItems="flex-start">
                <ListItemText
                  classes={{ secondary }}
                  secondary={
                    <Fragment>
                      <Typography color="inherit">經理:</Typography>
                      <Typography color="inherit" className={managerName}>{managerLoginname}</Typography>
                    </Fragment>
                  }
                />
              </ListItem>
            </List>
            <div className={grow} />
            {managerLevel === 1 && (
              <Button variant="contained" size="medium" color="inherit" className={classNames(menuButton, bold)} onClick={this.handleChange.bind(null, null, 3)}>管理經理</Button>
            )}
            <Button variant="contained" size="medium" color="inherit" className={classNames(menuButton, bold)} onClick={logout}>登出</Button>
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
            {value === 2 && (
              <TabContainer classes={classes}>
                <TableList kickoutClientFromDataServer={kickoutClientFromDataServer} />
              </TabContainer>
            )}
            {value === 3 && (
              <TabContainer classes={classes}>
                <ManagerList
                  getManagerList={getManagerList}
                  addManager={addManager}
                  deleteManager={deleteManager}
                />
            </TabContainer>
            )}
          </Grid>
          <Grid item xs={3}>
            <TabContainer classes={classes}>
              <AnchorStatusList />
            </TabContainer>
          </Grid>
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
  blacklistClient: PropTypes.func,
  logout: PropTypes.func,
  managerLevel: PropTypes.number.isRequired
};

export default withStyles(styles)(MenuBar);