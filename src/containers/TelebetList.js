import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import AnchorStatusList from '../containers/AnchorStatusList';
import AnswerCallPanel from '../containers/AnswerCallPanel';
import GridListBase from '../components/GridListBase';
import WaitingUser from '../components/WaitingUser';
import TelebetTile from './TelebetTile';
import AssignTableDialog from './AssignTableDialog';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { getLangConfig } from '../helpers/appUtils';
import voiceAPI from '../services/Voice/voiceAPI';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        borderRadius: '10px'
    },
    pageBorder: {
        border: '3px solid #FD0100',
        backgroundColor: '#FFFFFF',
    },
    tile: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    separator: {
        padding: '30px',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    }
});

class TelebetList extends React.Component {
    state = {
        openAssignTableDialog: false,
        assignName: '',
        openKickLineupDialog: false
    };

    closeAssignTableDialog = () => {
        this.setState({
            openAssignTableDialog: false,
            assignName: ''
        })
    }

    openAssignTableDialog = (name) => {
        this.setState({
            openAssignTableDialog: true,
            assignName: name
        });
    }

    openKickLineupDialog = (name) => {
        this.setState({
            openKickLineupDialog: true,
            assignName: name
        });
    }

    closeKickLineupDialog = () => {
        this.setState({
            openKickLineupDialog: false,
            assignName: ''
        });
    }

    kickLineupPlayer = () => {
        voiceAPI.kickPlayer(this.state.assignName);
    }

    render() {
        const {
            classes,
            channelList,
            joinChannel,
            isAnswerCall,
            waitingList,
            vipWaitingList,
            tableList
        } = this.props;
        const { separator, tile } = classes;

        const telebetListClasses = classNames.bind(classes);
        const classList = telebetListClasses({
            root: true,
            pageBorder: isAnswerCall
        });
        const langConfig = getLangConfig();

        let panel;
        if (isAnswerCall) {
            panel = (
                <AnswerCallPanel />
            );
        } else {
            panel = (
                <GridListBase list={channelList} tileClass={tile}>
                    <TelebetTile joinChannel={joinChannel} tableList={tableList} />
                </GridListBase>
            );
        }

        return (
            <Fragment>
                <Grid container>
                    <Grid item xs={isAnswerCall ? 12 : 8}>
                        <div className={classList}>
                            {panel}
                        </div>
                        {!isAnswerCall && <AnchorStatusList />}
                    </Grid>
                    {!isAnswerCall &&
                        <Grid item xs={2}>
                            <WaitingUser isVip={true} waitingList={vipWaitingList} openAssignTableDialog={this.openAssignTableDialog} openKickLineupDialog={this.openKickLineupDialog} />
                        </Grid>
                    }
                    {!isAnswerCall &&
                        <Grid item xs={2}>
                            <WaitingUser waitingList={waitingList} openAssignTableDialog={this.openAssignTableDialog} openKickLineupDialog={this.openKickLineupDialog} />
                        </Grid>
                    }
                </Grid>
                <AssignTableDialog openAssignTableDialog={this.state.openAssignTableDialog} closeAssignTableDialog={this.closeAssignTableDialog} name={this.state.assignName}/>
                <ConfirmationDialog
                    open={this.state.openKickLineupDialog}
                    onClose={this.closeKickLineupDialog}
                    message={langConfig.DIALOG_LABEL.CONFIRM_KICKOUT_PLAYER.replace("{clientName}", this.state.assignName)}
                    onConfirm={this.kickLineupPlayer} />
            </Fragment>
        );
    }
}

TelebetList.propTypes = {
    classes: PropTypes.object.isRequired,
    channelList: PropTypes.array,
    isAnswerCall: PropTypes.bool,
    waitingList: PropTypes.array,
    vipWaitingList: PropTypes.array,
    tableList: PropTypes.array
}

const StyledTelebetList = withStyles(styles)(TelebetList);

const mapStateToProps = state => {
    const {
        channelList,
        isAnswerCall,
        waitingList,
        vipWaitingList,
    } = state.voice;

    const {
        tableList
    } = state.data;
    const {
        managerCredential
    } = state.app
    return ({
        channelList,
        isAnswerCall,
        waitingList,
        vipWaitingList,
        tableList,
        managerCredential
    });
};

export default connect(mapStateToProps, null)(StyledTelebetList);