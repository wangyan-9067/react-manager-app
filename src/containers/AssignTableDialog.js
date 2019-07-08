import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { combineStyles, dialogStyles } from '../styles';

import dataAPI from '../services/Data/dataAPI';
import { getLangConfig } from '../helpers/appUtils';
import { DATA_SERVER_VIDEO_STATUS } from '../constants';


const telebetListTheme = createMuiTheme({
    shadows: new Array(25),
    overrides: {
        MuiToggleButton: {
            root: {
                '&$selected': {
                    color: '#FFFFFF',
                    backgroundColor: '#3970B0',
                    border: '3px solid #DF6C68',
                    '&:hover': {
                        color: '#FFFFFF',
                        backgroundColor: '#3970B0',
                        border: '3px solid #DF6C68'
                    }
                },
                '&:hover': {
                    color: '#FFFFFF',
                    backgroundColor: '#3970B0',
                    border: '3px solid #DF6C68'
                }
            }
        }
    }
});

const styles = {
    actionButton: {
        margin: '5px',
        padding: '3px 20px',
        borderRadius: '60px',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#FFFFFF',
        backgroundColor: '#0F58A7',
        '&:hover': {
            backgroundColor: '#0F58A7',
            borderColor: '#0F58A7',
        }
    },
    toggleButtonRoot: {
        height: '50px',
        margin: '5px',
        color: '#FFFFFF',
        backgroundColor: '#3970B0',
        border: '3px solid #3970B0'
    },
    toggleButtonDisabled: {
        backgroundColor: '#F4F4F4',
        color: '#D5D5D5',
        border: '3px solid #F4F4F4'
    },
    toggleButtonLabel: {
        fontSize: '1rem',
        fontWeight: 'bold'
    }
};

class AssignTableDialog extends React.Component {
    state = {
        tableAssigned: ''
    };

    onTableSelectChanged = (evt, table) => {
        this.setState({
            tableAssigned: table
        });
    }

    onAssignTableClicked = () => {
        if (this.state.tableAssigned) {
            dataAPI.assignTable(this.state.tableAssigned, this.props.name);
        }

        this.props.closeAssignTableDialog();
    };

    render() {
        const langConfig = getLangConfig();
        const {
            dialogPaper, dialogTitle, dialogActionsRoot, dialogActionButton, actionButton,
            toggleButtonRoot, toggleButtonDisabled, toggleButtonLabel
        } = this.props.classes;
        const { tableList, channelList } = this.props;
        const vidsInChannel = channelList.map(channel => channel.vid);

        return (
            <MuiThemeProvider theme={telebetListTheme}>
                <Dialog
                    open={this.props.openAssignTableDialog}
                    onClose={this.closeAssignTableDialog}
                    aria-labelledby="responsive-dialog-title"
                    classes={{ paper: dialogPaper }}>
                    <DialogTitle id="responsive-dialog-title">
                        <Typography color="inherit" className={dialogTitle}>{langConfig.TELEBET_LIST_LABEL.CHOOSE_TABLE}</Typography>
                    </DialogTitle>
                    <DialogContent>
                        <ToggleButtonGroup
                            value={this.state.tableAssigned}
                            exclusive
                            onChange={this.onTableSelectChanged}
                        >
                            {tableList.map((table, index) =>
                                <ToggleButton key={index} value={table.vid} disabled={table.status !== DATA_SERVER_VIDEO_STATUS.FREE || vidsInChannel.indexOf(table.vid) > -1} classes={{ root: toggleButtonRoot, disabled: toggleButtonDisabled }}>
                                    <Typography color="inherit" className={toggleButtonLabel}>{table.vid}</Typography>
                                </ToggleButton>
                            )}
                        </ToggleButtonGroup>
                    </DialogContent>
                    <DialogActions classes={{ root: dialogActionsRoot }}>
                        <Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton)} onClick={this.onAssignTableClicked}>{langConfig.BUTTON_LABEL.CONFIRM}</Button>
                        <Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton)} onClick={this.closeAssignTableDialog}>{langConfig.BUTTON_LABEL.CANCEL}</Button>
                    </DialogActions>
                </Dialog>
            </MuiThemeProvider>
        );
    }
}

AssignTableDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    tableList: PropTypes.array.isRequired,
    channelList: PropTypes.array.isRequired,
    openAssignTableDialog: PropTypes.bool.isRequired,
    closeAssignTableDialog: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired
}

const mapStateToProps = state => {
    const {
        channelList,
    } = state.voice;
    const {
        tableList,
    } = state.data;

    return ({
        channelList,
        tableList
    });
};

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(combineStyles(dialogStyles, styles))(AssignTableDialog));