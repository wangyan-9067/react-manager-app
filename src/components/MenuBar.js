import React, { Fragment } from 'react';
import { connect } from 'react-redux';
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

import { getLangConfig, reset } from '../helpers/appUtils';
import voiceAPI from '../services/Voice/voiceAPI';
import { setBetHistorySearchFields } from '../actions/data';
import { toggleLoading } from '../actions/app';
import { VERSION } from '../constants';

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

    onHistoryClicked = () => {
        this.props.toggleLoading(true);
        voiceAPI.getBetHistory();
        this.handleOpen();
    }

    logout = () => {
        reset();
    }

    render() {
        const {
            classes,
            incomingCallCount,
            managerCredential,
            managerLevel,
            setBetHistorySearchFields
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
        const { managerLoginname } = managerCredential || {};

        return (
            <div className={root}>
                <AppBar position="static" color="inherit" className={appBar}>
                    <Typography variant='body2' className={version}>{VERSION}</Typography>
                    <Toolbar classes={{ gutters }}>
                        <DateTimeBadge />
                        <div className={grow} />
                        <Tabs value={value} onChange={this.handleChange} classes={{ root: tabsRoot, indicator: tabsIndicator }}>
                            <Tab label={langConfig.MENU_BAR_LABEL.ANCHOR_MANAGEMENT} value={0} classes={{ root: tabRoot, selected: tabSelected, labelContainer }} />
                            <Tab label={<CallNotification count={incomingCallCount} value={1} label={langConfig.MENU_BAR_LABEL.MANAGER_OPERATION} />} classes={{ root: tabRoot, selected: tabSelected, labelContainer }} />
                            <Tab label={langConfig.MENU_BAR_LABEL.TABLE_MANAGEMENT} value={2} classes={{ root: tabRoot, selected: tabSelected, labelContainer }} />
                        </Tabs>
                        <div className={grow1} />
                        <Button
                            variant="contained"
                            size="medium"
                            color="inherit"
                            className={classNames(menuButton, bold)}
                            onClick={this.onHistoryClicked}
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
                                    secondaryTypographyProps={{
                                        component: "div"
                                    }}
                                />
                            </ListItem>
                        </List>
                        <div className={grow} />
                        <Button variant="contained" size="medium" color="inherit" className={classNames(menuButton, bold, managerLevel === 1 ? show : hide)} onClick={this.handleChange.bind(null, null, 3)}>{langConfig.MENU_BAR_LABEL.MANAGER_MANAGEMENT}</Button>
                        <Button variant="contained" size="medium" color="inherit" className={classNames(menuButton, bold)} onClick={this.logout}>{langConfig.BUTTON_LABEL.LOGOUT}</Button>
                    </Toolbar>
                </AppBar>
                <Grid container>
                    <Grid item xs={9}>
                        <TabContainer classes={classes}>
                            {value === 0 && (
                                <AnchorList />
                            )}
                            {value === 1 && (
                                <TelebetList />
                            )}
                            {value === 2 && (
                                <TableList />
                            )}
                            {value === 3 && (
                                <ManagerList />
                            )}
                            {value === 4 && (
                                <DelegatorList />
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
                            setBetHistorySearchFields={setBetHistorySearchFields}
                        />
                    </DialogTitle>
                    <DialogContent>
                        <BetHistory />
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

MenuBar.propTypes = {
    classes: PropTypes.object.isRequired,
    managerCredential: PropTypes.object.isRequired,
    managerLevel: PropTypes.number,
    toggleLoading: PropTypes.func,
    incomingCallCount: PropTypes.number,
    setBetHistorySearchFields: PropTypes.func
};

const mapStateToProps = state => {
    const { incomingCallCount, managerLevel } = state.voice;
    const { managerCredential } = state.app;

    return {
        incomingCallCount,
        managerLevel,
        managerCredential
    };
};

const mapDispatchToProps = dispatch => ({
    toggleLoading: toggle => dispatch(toggleLoading(toggle)),
    setBetHistorySearchFields: fields => dispatch(setBetHistorySearchFields(fields))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MenuBar));