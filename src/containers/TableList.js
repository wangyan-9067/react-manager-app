import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import GridListBase from '../components/GridListBase';
import TableTile from '../components/TableTile';
import KickoutDialog from '../components/KickoutDialog';
import { isNonEmptyArray } from '../helpers/utils';
import { getLangConfig } from '../helpers/appUtils';

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
    state = {
        openKickoutDialog: false,
        clientName: '',
        vid: '',
        channelId: ''
    };

    openKickoutDialog = (name, vid, channelId) => {
        this.setState({
            openKickoutDialog: true,
            clientName: name,
            vid: vid,
            channelId: channelId
        });
    }

    closeKickoutDialog = () => {
        this.setState({
            openKickoutDialog: false,
            clientName: '',
            vid: '',
            channelId: ''
        });
    }

    // kickoutClient = () => {
    //     const { vid, clientName } = this.props.clientToKickOut;

    //     this.props.setManagerAction(MANAGER_ACTION_TYPE.KICKOUT_CLIENT);
    //     dataAPI.kickoutClientFromDataServer(vid, clientName);
    //     this.closeDialog();
    // }

    render() {
        const {
            classes,
            tableList,
            channelList,
            tableLimit,
            anchorBets,
            jettons
        } = this.props;
        const { root, emptyText } = classes;
        const langConfig = getLangConfig();
        let panel;
        if (isNonEmptyArray(tableList)) {
            panel = (
                <Fragment>
                    <GridListBase list={tableList} bgColor={GRID_ITEM_BG_COLOR}>
                        <TableTile openKickoutDialog={this.openKickoutDialog} channelList={channelList} tableLimit={tableLimit} anchorBets={anchorBets} jettons={jettons}/>
                    </GridListBase>
                    <KickoutDialog
                        open={this.state.openKickoutDialog}
                        onClose={this.closeKickoutDialog}
                        type={KickoutDialog.TYPE.KICKOUT_IN_TABLE_PLAYERS}
                        clientName={this.state.clientName}
                        vid={this.state.vid}
                        channelId={this.state.channelId} />
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
    tableLimit: PropTypes.object,
    anchorBets: PropTypes.object,
    jettons: PropTypes.object
};

const StyledTableList = withStyles(styles)(TableList);

const mapStateToProps = state => {
    const { voice, data, app } = state;
    const { anchorsOnDutyList, channelList } = voice;
    const { tableList, clientToKickOut, tableLimit, anchorBets, jettons } = data;
    const { openDialog } = app;
    return ({
        anchorsOnDutyList,
        channelList,
        tableList,
        clientToKickOut,
        openDialog,
        tableLimit,
        anchorBets,
        jettons
    });
};

export default connect(mapStateToProps, null)(StyledTableList);