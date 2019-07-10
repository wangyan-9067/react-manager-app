import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';

/**
 *
 * @param {number} waitingStartTime in seconds
 */
const DurationClock = ({ waitingStartTime }) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let timer = setTimeout(() => {
        setDuration(moment().diff(waitingStartTime * 1000));
    }, 1000);

    return () => {
        clearTimeout(timer);
    }
  });

  return(
    <Moment format="HH:mm:ss">
        {moment.utc(duration)}
    </Moment>
  );
}

DurationClock.propTypes = {
    waitingStartTime: PropTypes.number.isRequired
};

export default DurationClock;