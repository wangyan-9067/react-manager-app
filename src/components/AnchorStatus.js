import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';

const styles = () => ({
    root: {
        marginRight: '15px'
    },
    busy: {
        height: '12px',
        minWidth: '12px',
        backgroundColor: '#FF390F'
    },
    idle: {
        height: '12px',
        minWidth: '12px',
        backgroundColor: '#0FFD5D'
    }
});

const AnchorStatus = ({ classes, isBusy }) => {
    const { root, busy, idle } = classes;

    return (
        <Badge
            classes={{
                root,
                dot: isBusy ? busy : idle
            }}
            variant="dot"
        >
            <span />
        </Badge>
    );
}

AnchorStatus.propTypes = {
    classes: PropTypes.object.isRequired,
    isBusy: PropTypes.bool
};

export default withStyles(styles)(AnchorStatus);