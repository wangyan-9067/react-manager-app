import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames/bind';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

const styles = {
	card: {
		borderRadius: '4px',
		border: '1px solid #EDEDED',
		backgroundColor: '#EDEDED',
    padding: '0 60px 0 0',
    width: '100%',
    minHeight: '148px'
  },
  cardContentRoot: {
    padding: '5px',
    '&:first-child': {
      paddingBottom: '0'
    }
  },
	cardContent: {
		color: '#666666',
    textAlign: 'left'
	},
	cardContentText: {
    fontSize: '16px'
  },
  cardContentMainText: {
    color: '#1779E6',
    fontWeight: 'bold',
    fontSize: '1.3rem'
  },
  cardContentSubText: {
    color: '#139727',
    fontWeight: 'bold',
    margin: '5px 0'
  },
	actionButton: {
    color: '#FFFFFF',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    borderRadius: '18px',
    width: '80%',
    margin: '16px auto',
    padding: '2px 0',
		backgroundColor: '#1779E6',
    '&:hover': {
      backgroundColor: '#1779E6',
      borderColor: '#1779E6',
    }
  },
  kickButton: {
    margin: '0 auto',
    backgroundColor: '#FE0000',
    '&:hover': {
      backgroundColor: '#FE0000',
      borderColor: '#FE0000',
    }
  }
};

const AlreadyHaveToken = ({ classes, name, waitingTime, kickDelegator }) => {
  const { card, cardContentRoot, cardContent, cardContentText, cardContentMainText, cardContentSubText, actionButton, kickButton } = classes;

  return (
    <Card className={card}>
      <CardContent className={cardContent} classes={{ root: cardContentRoot }}>
				<Typography color="inherit" className={classNames(cardContentText, cardContentMainText)} noWrap={true} align="center">{name}</Typography>
        <Typography color="inherit" className={classNames(cardContentText, cardContentSubText)} noWrap={true} align="center">已接入</Typography>
				<CardActions>
          <Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, kickButton)} onClick={() => { kickDelegator(name); }}>踢走</Button>
				</CardActions>
        <Typography color="inherit" className={cardContentText} noWrap={true} align="center">{waitingTime}</Typography>
      </CardContent>
    </Card>
  );
};

AlreadyHaveToken.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  waitingTime: PropTypes.number,
  kickDelegator: PropTypes.func
};

const WaitingForToken = ({ classes, name, waitingTime, assignTokenToDelegator }) => {
  const { card, cardContentRoot, cardContent, cardContentText, cardContentMainText, actionButton } = classes;

  return (
    <Card className={card}>
      <CardContent className={cardContent} classes={{ root: cardContentRoot }}>
				<Typography color="inherit" className={classNames(cardContentText, cardContentMainText)} noWrap={true} align="center">{name}</Typography>
				<CardActions>
          <Button variant="contained" size="medium" color="inherit" className={actionButton} onClick={() => { assignTokenToDelegator(name); }}>派籌</Button>
				</CardActions>
        <Typography color="inherit" className={cardContentText} noWrap={true} align="center">{waitingTime}</Typography>
      </CardContent>
    </Card>
  );
};

WaitingForToken.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  waitingTime: PropTypes.number,
  assignTokenToDelegator: PropTypes.func
};

const WaitingUserTile = ({ classes, item, assignTokenToDelegator, kickDelegator }) => {
  const [waitingTime, setWaitingTime] = useState({});
  const { name, waitingStartTime, token } = item;

  let panel;

  if (token === 1) {
    panel = <AlreadyHaveToken classes={classes} name={name} waitingTime={waitingTime[item.name]} kickDelegator={kickDelegator} />;
  } else {
    panel = <WaitingForToken classes={classes} name={name} waitingTime={waitingTime[item.name]} assignTokenToDelegator={assignTokenToDelegator} />;
  }

  useEffect(() => {
    const updatedWaitingTime = {};
    updatedWaitingTime[item.name] = moment.utc(moment().diff(moment(waitingStartTime * 1000))).format("HH:mm:ss");
    setWaitingTime({ ...waitingTime, ...updatedWaitingTime});
  });

  return (
    <div>{panel}</div>
  );
}

WaitingUserTile.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object,
  assignTokenToDelegator: PropTypes.func,
  kickDelegator: PropTypes.func
};

export default withStyles(styles)(WaitingUserTile);