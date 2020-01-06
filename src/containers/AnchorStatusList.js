import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';

import AnchorStatus from '../components/AnchorStatus';
import GridListBase from '../components/GridListBase';
import { getLangConfig } from '../helpers/appUtils';

import commonStyles from '../css/common.module.css';
import anchorStatusStyles from '../css/anchorStatus.module.css';

const AnchorStatusList = ({ channelLogs }) => {
    const langConfig = getLangConfig();
    return (
        <div className={anchorStatusStyles.root}>
            <Typography align="left" className={commonStyles.sectionTitle}>{langConfig.ANCHOR_LIST_LABEL.ANCHOR_LOG}</Typography>
            <GridListBase list={channelLogs}>
                <AnchorStatus />
            </GridListBase>
        </div>
    );
}

AnchorStatusList.proptype = {
    channelLogs: PropTypes.array.isRequired
};


const mapStateToProps = state => {
    const { channelLogs } = state.voice;
    const channelLogsAry = Object.values(channelLogs);

    return ({
        channelLogs: channelLogsAry
    });
};

export default connect(mapStateToProps, null)(AnchorStatusList);