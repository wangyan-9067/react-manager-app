import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import GridListBase from './GridListBase';
import WaitingUserTile from './WaitingUserTile';
import { getLangConfig } from '../helpers/appUtils';

import commonStyles from '../css/common.module.css';

const styles = theme => ({
    root: {
        width: '100%',
        height: '100%'
    },
    listRoot: {
        width: '100%',
        top: '0',
        left: '0',
        height: '650px',
        overflowY: 'auto'
    }
});

const WaitingUser = ({ classes, waitingList, openAssignTableDialog, openKickLineupDialog, isVip }) => {
    const { root, title, listRoot } = classes;
    const langConfig = getLangConfig();

    return (
        <div className={root}>
            <Typography color="inherit" align="left" className={commonStyles.sectionTitle} gutterBottom>
                {isVip ? langConfig.VIP_WAITING_PLAYER : langConfig.WAITING_PLAYER}
            </Typography>
            <div className={listRoot}>
                {waitingList.map((item, index) => (
                    <WaitingUserTile key={index} item={item} openAssignTableDialog={openAssignTableDialog} openKickLineupDialog={openKickLineupDialog} />
                ))}
            </div>
        </div>
    );
};

WaitingUser.propTypes = {
    classes: PropTypes.object.isRequired,
    waitingList: PropTypes.array,
    openAssignTableDialog: PropTypes.func.isRequired,
    openKickLineupDialog: PropTypes.func.isRequired,
    isVip: PropTypes.bool
};

export default withStyles(styles)(WaitingUser);