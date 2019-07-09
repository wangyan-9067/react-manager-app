import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import { withStyles } from '@material-ui/core/styles';

import AnswerCallPanel from '../containers/AnswerCallPanel';
import GridListBase from '../components/GridListBase';
import WaitingUser from '../components/WaitingUser';
import TelebetTile from './TelebetTile';
import AssignTableDialog from './AssignTableDialog';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { setIncomingCallCount } from '../actions/voice';
import { getLangConfig } from '../helpers/appUtils';
import voiceAPI from '../services/Voice/voiceAPI';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        // padding: '5px',
        // backgroundColor: '#FFFFFF',
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
        height: '100%',
        // backgroundColor: '#F5F5F5',
        // borderRadius: '16px',
        // minHeight: '200px'
    },
    answerCallPanel: {
        display: 'flex',
        borderRadius: '10px',
        width: '90%',
        margin: '50px 0 35px 0'
    },
    answerCallPanelLeftRoot: {
        width: '70%',
        borderRadius: '10px 0px 0px 10px'
    },
    answerCallPanelLeft: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#FD0100',
        color: '#FFFFFF',
        padding: '30px 0'
    },
    answerCallPanelLeftAnchor: {
        backgroundColor: '#1779E6'
    },
    answerCallPanelLeftText: {
        fontWeight: 'bold',
        fontSize: '2rem'
    },
    answerCallPanelRightRoot: {
        width: '30%',
        borderRadius: '0px 10px 10px 0px'
    },
    answerCallPanelRight: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        textAlign: 'left',
        backgroundColor: '#D8D8D8',
        color: '#797979',
        padding: '35px 30px 0 30px'
    },
    answerCallPanelRightText: {
        fontWeight: 'bold',
        fontSize: '1.125rem'
    },
    answerCallPanelRightTextValue: {
        padding: '10px'
    },
    actionButtonWrapper: {
        width: '100%',
        minWidth: '750px'
    },
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
    mutingButton: {
        backgroundColor: '#FD0100',
        '&:hover': {
            backgroundColor: '#FD0100',
            borderColor: '#FD0100',
        }
    },
    blacklistButton: {
        backgroundColor: '#4A4B4F',
        '&:hover': {
            backgroundColor: '#4A4B4F',
            borderColor: '#4A4B4F',
        }
    },
    cancelButton: {
        backgroundColor: '#AAAAAA',
        '&:hover': {
            backgroundColor: '#AAAAAA',
            borderColor: '#AAAAAA',
        }
    },
    separator: {
        padding: '30px',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    },
    icon: {
        marginRight: theme.spacing.unit,
        fontSize: 32
    },
    dialogPaper: {
        width: '100%'
    },
    dialogActionButton: {
        fontSize: '1.125rem',
    },
    dialogTitle: {
        color: '#7B7B7B',
        fontSize: '1.25rem',
        fontWeight: 'bold'
    },
    dialogActionsRoot: {
        borderTop: '1px solid #C8C8C8',
        paddingTop: '10px',
        justifyContent: 'center'
    },
    dialogActionsRootNoBorder: {
        paddingTop: '10px',
        justifyContent: 'center'
    },
    dialogContent: {
        fontWeight: 'bold',
        fontSize: '1.125rem',
        textAlign: 'center',
        color: '#7E7E7E'
    },
    show: {
        display: 'inline-flex'
    },
    hide: {
        display: 'none'
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
            tableList,
            setIncomingCallCount
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
                <AnswerCallPanel classes={classes} />
            );
        } else {
            panel = (
                <GridListBase list={channelList} tileClass={tile}>
                    <TelebetTile joinChannel={joinChannel} tableList={tableList} setIncomingCallCount={setIncomingCallCount} />
                </GridListBase>
            );
        }

        return (
            <Fragment>
            <div className={classList}>
                {panel}
                <div className={separator} />
                {!isAnswerCall &&
                    <WaitingUser waitingList={waitingList} openAssignTableDialog={this.openAssignTableDialog} openKickLineupDialog={this.openKickLineupDialog} />
                }
            </div>
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
    tableList: PropTypes.array,
    setIncomingCallCount: PropTypes.func
}

const StyledTelebetList = withStyles(styles)(TelebetList);

const mapStateToProps = state => {
    const {
        channelList,
        isAnswerCall,
        waitingList
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
        tableList,
        managerCredential
    });
};

const mapDispatchToProps = dispatch => ({
    setIncomingCallCount: count => dispatch(setIncomingCallCount(count))
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledTelebetList);