import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import GridListBase from '../components/GridListBase';
import TableTile from '../components/TableTile';
import DialogWrapper from '../components/DialogWrapper';
import { toggleDialog } from '../actions/app';
import { setKickoutClient } from '../actions/data';
import { setManagerAction } from '../actions/voice';
import { MANAGER_ACTION_TYPE } from '../constants';
import { isNonEmptyArray } from '../helpers/utils';
import { getLangConfig } from '../helpers/appUtils';
import dataAPI from '../services/Data/dataAPI';

const GRID_ITEM_BG_COLOR = '#E8E8E8';
const styles = () => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        // padding: '5px',
        backgroundColor: '#E8E8E8',
    },
    emptyText: {
        color: '#656565',
        fontSize: '1.1rem',
    }
});

class TableList extends React.Component {
    closeDialog = () => {
        this.props.toggleDialog(false);
    }

    kickoutClient = () => {
        const { vid, clientName } = this.props.clientToKickOut;

        console.log(MANAGER_ACTION_TYPE.KICKOUT_CLIENT, vid, clientName)
        this.props.setManagerAction(MANAGER_ACTION_TYPE.KICKOUT_CLIENT);
        dataAPI.kickoutClientFromDataServer(vid, clientName);
        this.closeDialog();
    }

    render() {
        const {
            classes,
            tableList,
            anchorsOnDutyList,
            channelList,
            openDialog,
            toggleDialog,
            setKickoutClient,
            tableLimit,
        } = this.props;
        const { root, emptyText } = classes;
        const langConfig = getLangConfig();
        let panel;

        if (isNonEmptyArray(tableList)) {
            panel = (
                <Fragment>
                    <GridListBase list={tableList} bgColor={GRID_ITEM_BG_COLOR}>
                        <TableTile anchorsOnDutyList={anchorsOnDutyList} toggleDialog={toggleDialog} setKickoutClient={setKickoutClient} channelList={channelList} tableLimit={tableLimit} />
                    </GridListBase>
                    <DialogWrapper
                        isOpen={openDialog}
                        onCloseHandler={this.closeDialog}
                        actionHandler={this.kickoutClient}
                        content={langConfig.DIALOG_LABEL.CONFIRM_KICKOUT_TABLE_OWNER}
                    />
                </Fragment>
            );
        } else {
            panel = <div className={emptyText}>{langConfig.TABLE_LIST_LABEL.NO_RECORD}</div>;
        }

        return (
            <div className={root}>{panel}</div>
        );
    }
}

TableList.propTypes = {
    classes: PropTypes.object.isRequired,
    tableList: PropTypes.array,
    anchorsOnDutyList: PropTypes.array,
    channelList: PropTypes.array,
    openDialog: PropTypes.bool,
    toggleDialog: PropTypes.func,
    setKickoutClient: PropTypes.func,
    clientToKickOut: PropTypes.object,
    tableLimit: PropTypes.object
};

const StyledTableList = withStyles(styles)(TableList);

const mapStateToProps = state => {
    const { voice, data, app } = state;
    const { anchorsOnDutyList, channelList } = voice;
    const { tableList, clientToKickOut, tableLimit } = data;
    const { openDialog } = app;

    return ({
        anchorsOnDutyList,
        channelList,
        tableList,
        clientToKickOut,
        openDialog,
        tableLimit
    });
};

const mapDispatchToProps = dispatch => ({
    toggleDialog: toggle => dispatch(toggleDialog(toggle)),
    setManagerAction: action => dispatch(setManagerAction(action)),
    setKickoutClient: data => dispatch(setKickoutClient(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledTableList);