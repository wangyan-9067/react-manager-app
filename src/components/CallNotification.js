import React from 'react';
import PropTypes from 'prop-types';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    padding: {
        padding: `0 ${theme.spacing.unit * 2}px`,
    },
    badge: {
        background: '#FE0000',
        marginRight: '7px',
        color: '#FFFFFF'
    }
});

const CallNotification = ({ classes, count, label }) => {
    const { padding, badge } = classes;
    return (
        <Badge className={padding} classes={{ badge }} badgeContent={count}>
            {label}
        </Badge>
    );
}

CallNotification.propTypes = {
    classes: PropTypes.object.isRequired,
    count: PropTypes.number,
    label: PropTypes.string
};

export default withStyles(styles)(CallNotification);