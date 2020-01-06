import React from 'react';
import PropTypes from 'prop-types';

import { Typography } from '@material-ui/core';

import anchorStatusStyles from '../css/anchorStatus.module.css';

class AnchorStatus extends React.Component {
    render() {
        return (
            <div className={anchorStatusStyles.card}>
                {this.props.item.messages.map((message, index) => (
                    <Typography key={index} align='left'>{message}</Typography>
                ))}
            </div>
        );
    }
}

AnchorStatus.proptype = {
    item: PropTypes.object.isRequired
}

export default AnchorStatus;