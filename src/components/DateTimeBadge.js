import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Clock from './Clock';

const styles = {
    badgeLabel: {
        fontSize: '1rem'
    }
};

const DateTimeBadge = ({ classes }) => {
    const { badgeLabel } = classes;
    const currentDateTime = new Date();

    return (
        <Fragment>
            <Typography color="inherit" className={badgeLabel} noWrap>
                <Moment format="YYYY-MM-DD">
                    {currentDateTime}
                </Moment>
                <br />
                <Clock />
            </Typography>
        </Fragment>
    );
};

DateTimeBadge.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DateTimeBadge);