import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';

import AnchorList from '../containers/AnchorList';
import TelebetList from '../containers/TelebetList';
import TableList from '../containers/TableList';
import AnchorStatusList from '../containers/AnchorStatusList';
import ManagerList from '../containers/ManagerList';
import BetHistory from '../containers/BetHistory';
import DelegatorList from '../containers/DelegatorList';

import DateTimeBadge from './DateTimeBadge';
import SearchForm from './SearchForm';
import CallNotification from './CallNotification';

import { getLangConfig } from '../helpers/appUtils';
import { CONFIG } from '../config';

const styles = theme => ({
  version: {
    position: 'absolute',
    right: theme.spacing.unit
  },
  appBar: {
    backgroundColor: '#E8E8E8',
    color: '#3970B0'
  },
  root: {
    width: '100%',
  },
  tabsRoot: {
    width: '420px',
    borderBottom: '1px solid #E8E8E8',
  },
  tabsIndicator: {
    backgroundColor: '#3970B0',
  },
  tabRoot: {
    textTransform: 'initial',
    fontSize: '1.25rem',
    fontWeight: theme.typography.fontWeightRegular,
    minWidth: 12,
    // marginRight: theme.spacing.unit * 4,
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
  },
  dialogPaper: {
    // maxWidth: '100%',
    height: '100%',
    minWidth: '1000px'
  },
  show: {
    display: 'block'
  },
  hide: {
    display: 'none'
  },
  gutters: {
    paddingLeft: '4px',
    paddingRight: '4px'
  },
  labelContainer: {
    padding: '6px 22px'
  }
});

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

const TabContainer = ({ classes, children }) => {
  return (
    <div className={classes.tabContainer}>{children}</div>
  );
};

TabContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

class MenuBar extends React.Component {
  state = {
    value: 0,
    open: false
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.props.toggleLoading(false);
    this.setState({
      open: false
    });
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
      managerLevel,
      getManagerList,
      addManager,
      deleteManager,
      getBetHistory,
      toggleLoading,
      assignTokenToDelegator,
      kickDelegator,
      getDelegatorList,
      addDelegator,
      deleteDelegator,
      nullGateForwardMsgCMD,
      setBetHistorySearchFields,
      incomingCallCount
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
      managerName,
      dialogPaper,
      show,
      hide,
      gutters,
      labelContainer,
      version
    } = classes;
    const langConfig = getLangConfig();

    return (
      <div className={root}>
        <AppBar position="static" color="inherit" className={appBar}>
          <Typography variant='body2' className={version}>{CONFIG.VERSION}</Typography>
          <Toolbar classes={{ gutters }}>
            <DateTimeBadge />
            <div className={grow} />
            <Tabs value={value} onChange={this.handleChange} classes={{ root: tabsRoot, indicator: tabsIndicator }}>
              <Tab label={langConfig.MENU_BAR_LABEL.ANCHOR_MANAGEMENT} classes={{ root: tabRoot, selected: tabSelected, labelContainer }} />
              <Tab label={<CallNotification count={incomingCallCount} label={langConfig.MENU_BAR_LABEL.MANAGER_OPERATION} />} classes={{ root: tabRoot, selected: tabSelected, labelContainer }} />
              <Tab label={langConfig.MENU_BAR_LABEL.TABLE_MANAGEMENT} classes={{ root: tabRoot, selected: tabSelected, labelContainer }} />
            </Tabs>
            <div className={grow1} />
            <Button
              variant="contained"
              size="medium"
              color="inherit"
              className={classNames(menuButton, bold)}
              onClick={() => {
                toggleLoading(true);
                getBetHistory();
                this.handleOpen();
              }}
            >
              {langConfig.MENU_BAR_LABEL.BET_HISTORY}
            </Button>
            <div className={grow1} />
            <List>
              <ListItem alignItems="flex-start">
                <ListItemText
                  classes={{ secondary }}
                  secondary={
                    <Fragment>
                      <Typography color="inherit">{langConfig.MENU_BAR_LABEL.MANAGER}</Typography>
                      <Typography color="inherit" className={managerName}>{managerLoginname}</Typography>
                    </Fragment>
                  }
                />
              </ListItem>
            </List>
            <div className={grow} />
            <Button variant="contained" size="medium" color="inherit" className={classNames(menuButton, bold)} onClick={this.handleChange.bind(null, null, 4)}>{langConfig.MENU_BAR_LABEL.DELEGATOR_MANAGEMENT}</Button>
            <Button variant="contained" size="medium" color="inherit" className={classNames(menuButton, bold, managerLevel === 1 ? show : hide)} onClick={this.handleChange.bind(null, null, 3)}>{langConfig.MENU_BAR_LABEL.MANAGER_MANAGEMENT}</Button>
            <Button variant="contained" size="medium" color="inherit" className={classNames(menuButton, bold)} onClick={logout}>{langConfig.BUTTON_LABEL.LOGOUT}</Button>
          </Toolbar>
        </AppBar>
        <Grid container>
          <Grid item xs={9}>
            <TabContainer classes={classes}>
            {value === 0 && (
                <AnchorList
                  getAnchorList={getAnchorList}
                  addAnchor={addAnchor}
                  deleteAnchor={deleteAnchor}
                  setAnchorsDuty={setAnchorsDuty}
                  getAnchorsDutyList={getAnchorsDutyList}
                />              
            )}
            {value === 1 && (
                <TelebetList
                  joinChannel={joinChannel}
                  leaveChannel={leaveChannel}
                  assignTable={assignTable}
                  assignTableToChannel={assignTableToChannel}
                  toggleMuteChannel={toggleMuteChannel}
                  kickoutClientFromDataServer={kickoutClientFromDataServer}
                  kickoutClient={kickoutClient}
                  blacklistClient={blacklistClient}
                  assignTokenToDelegator={assignTokenToDelegator}
                  kickDelegator={kickDelegator}
                />
            )}
            {value === 2 && (
                <TableList kickoutClientFromDataServer={kickoutClientFromDataServer} />
            )}
            {value === 3 && (
                <ManagerList getManagerList={getManagerList} addManager={addManager} deleteManager={deleteManager} />
            )}
            {value === 4 && (
                <DelegatorList getDelegatorList={getDelegatorList} addDelegator={addDelegator} deleteDelegator={deleteDelegator} />
            )}
            </TabContainer>
          </Grid>
          <Grid item xs={3}>
            <TabContainer classes={classes}>
              <AnchorStatusList />
            </TabContainer>
          </Grid>
        </Grid>
        <Dialog
          onClose={this.handleClose}
          aria-labelledby="customized-dialog-title"
          open={this.state.open}
          classes={{ paper: dialogPaper }}
        >
          <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
            <SearchForm
              nullGateForwardMsgCMD={nullGateForwardMsgCMD}
              setBetHistorySearchFields={setBetHistorySearchFields}
            />
          </DialogTitle>
          <DialogContent>
            <BetHistory nullGateForwardMsgCMD={nullGateForwardMsgCMD} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

MenuBar.propTypes = {
  classes: PropTypes.object.isRequired,
  joinChannel: PropTypes.func,
  leaveChannel: PropTypes.func,
  assignTable: PropTypes.func,
  assignTableToChannel: PropTypes.func,
  toggleMuteChannel: PropTypes.func,
  kickoutClientFromDataServer: PropTypes.func,
  kickoutClient: PropTypes.func,
  blacklistClient: PropTypes.func,
  getAnchorList: PropTypes.func,
  addAnchor: PropTypes.func,
  deleteAnchor: PropTypes.func,
  setAnchorsDuty: PropTypes.func,
  getAnchorsDutyList: PropTypes.func,
  logout: PropTypes.func,
  managerLoginname: PropTypes.string,
  managerLevel: PropTypes.number,
  getManagerList: PropTypes.func,
  addManager: PropTypes.func,
  deleteManager: PropTypes.func,
  getBetHistory: PropTypes.func,
  toggleLoading: PropTypes.func,
  assignTokenToDelegator: PropTypes.func,
  kickDelegator: PropTypes.func,
  getDelegatorList: PropTypes.func,
  addDelegator: PropTypes.func,
  deleteDelegator: PropTypes.func,
  nullGateForwardMsgCMD: PropTypes.func,
  setBetHistorySearchFields: PropTypes.func,
  incomingCallCount: PropTypes.number
};

export default withStyles(styles)(MenuBar);