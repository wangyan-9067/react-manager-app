import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import dataAPI from '../services/Data/dataAPI';
import { getLangConfig } from '../helpers/appUtils';
import { DATA_SERVER_VIDEO_STATUS } from '../constants';

import dialogStyles from '../css/dialog.module.css';
import buttonStyles from '../css/button.module.scss';

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

    isTableFree(table) {
        if (table.status !== DATA_SERVER_VIDEO_STATUS.FREE) {
            return false;
        }

        const { channelList } = this.props;

        for (let i = 0; i < channelList.length; i++) {
            if (channelList[i].vid === table.vid) {
                return !channelList[i].clientName;
            }
        }

        return false;
    }

    render() {
        const langConfig = getLangConfig();
        const { dialogPaper, dialogTitle, dialogActionsRoot, dialogActionButton } = dialogStyles;
        const { actionButton, toggleButtonRoot, toggleButtonDisabled, toggleButtonLabel } = buttonStyles;
        const { tableList } = this.props;

        return (
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
                            <ToggleButton key={index} value={table.vid} disabled={!this.isTableFree(table)} classes={{ root: toggleButtonRoot, disabled: toggleButtonDisabled }}>
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
        );
    }
}

AssignTableDialog.propTypes = {
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

export default connect(mapStateToProps, null)(AssignTableDialog);