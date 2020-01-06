import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { combineStyles, dialogStyles, toggoleButtons, toggleButtonTheme, buttonStyles } from '../styles';

import dataAPI from '../services/Data/dataAPI';
import { getLangConfig } from '../helpers/appUtils';
import { DATA_SERVER_VIDEO_STATUS } from '../constants';

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
            this.setState({
                tableAssigned: ''
            }, () => {
                this.props.closeAssignTableDialog();
            });
        }
    };

    render() {
        const langConfig = getLangConfig();
        const {
            dialogPaper, dialogTitle, dialogActionsRoot, dialogActionButton, actionButton,
            toggleButtonRoot, toggleButtonDisabled, toggleButtonLabel
        } = this.props.classes;
        const { tableList, channelList } = this.props;
        const occupiedChannels = channelList.map(channel => channel.clientName !== '');

        return (
            <MuiThemeProvider theme={toggleButtonTheme}>
                <Dialog
                    open={this.props.openAssignTableDialog}
                    onClose={this.props.closeAssignTableDialog}
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
                                <ToggleButton key={index} value={table.vid} disabled={table.status !== DATA_SERVER_VIDEO_STATUS.FREE || occupiedChannels.indexOf(table.vid) > -1} classes={{ root: toggleButtonRoot, disabled: toggleButtonDisabled }}>
                                    <Typography color="inherit" className={toggleButtonLabel}>{table.vid}</Typography>
                                </ToggleButton>
                            )}
                        </ToggleButtonGroup>
                    </DialogContent>
                    <DialogActions classes={{ root: dialogActionsRoot }}>
                        <Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton)} onClick={this.onAssignTableClicked}>{langConfig.BUTTON_LABEL.CONFIRM}</Button>
                        <Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton)} onClick={this.props.closeAssignTableDialog}>{langConfig.BUTTON_LABEL.CANCEL}</Button>
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

const combinedStyles = combineStyles(dialogStyles, toggoleButtons, buttonStyles);

export default connect(mapStateToProps, null)(withStyles(combinedStyles)(AssignTableDialog));