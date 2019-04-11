import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames/bind';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { getAnonymousName } from '../helpers/utils';

const styles = {
	card: {
		borderRadius: '4px',
		border: '1px solid #EDEDED',
		backgroundColor: '#EDEDED',
		padding: '0 60px 0 0'
	},
	cardContent: {
		color: '#666666',
    textAlign: 'left'
	},
	cardContentText: {
    fontSize: '16px'
  },
  cardContentMainText: {
    color: '#3970B0',
    fontWeight: 'bold'
  },
  cardContentSubText: {
    color: '#3970B0'
  }
};

const WaitingUserTitle = props => {
  const [waitingTime, setWaitingTime] = useState({});
  const { classes, item } = props;
  const { card, cardContent, cardContentText, cardContentMainText, cardContentSubText} = classes;
  const { clientName, validBet, waitingStartTime} = item;
  const maskedClientName = getAnonymousName(clientName);

  useEffect(() => {
    const updatedWaitingTime = {};
    updatedWaitingTime[item.clientName] = moment.utc(moment().diff(moment(waitingStartTime * 1000))).format("HH:mm:ss");
    setWaitingTime({ ...waitingTime, ...updatedWaitingTime});
  });

  return (
    <Card className={card}>
      <CardContent className={cardContent}>
				<Typography color="inherit" className={classNames(cardContentText, cardContentMainText)}>{maskedClientName}</Typography>
				<Typography color="inherit" className={classNames(cardContentText, cardContentSubText)}>{validBet}</Typography>
				<Typography color="inherit" className={cardContentText}>{waitingTime[item.clientName]}</Typography>
      </CardContent>
    </Card>
  );
}

WaitingUserTitle.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object
};

export default withStyles(styles)(WaitingUserTitle);