import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import * as RTC from 'cube-rtc';

const styles = {
	cardHeader: {
		display: 'flex',
    padding: '12px',
    alignItems: 'center',
		backgroundColor: '#13C636',
		color: '#FFFFFF',
		fontWeight: 'bold'
	},
	cardContent: {
		textAlign: 'left',
		color: '#818181'
	},
	cardActionButton: {
		margin: '0 auto',
		backgroundColor: '#E2E2E2',
		color: '#6C6C6C'
	},
	tableNo: {
		flex: '0 0 auto'
	},
	tableStatus: {
		flex: '1 1 auto'
	},
	tableValue: {
		fontWeight: 'bold',
		padding: '10px'
	}
};

const joinRoom = () => {
	console.log("RTC", RTC, RTC.joinRoom);
	const result = RTC.joinRoom('hello', 'ce3ee69130464250abd9f756dd690b76');
	console.log('result', result);
}

const AnchorTile = props => {
  const { classes } = props;

  return (
    <Card>
			<div className={classes.cardHeader}>
				<div className={classes.tableNo}>T01</div>
				<div className={classes.tableStatus}>可進桌 / 可包桌</div>
			</div>
      <CardContent className={classes.cardContent}>
				<Typography color="inherit"><span>座位數:</span><span className={classes.tableValue}>1/7</span></Typography>
				<Typography color="inherit"><span>局號:</span><span className={classes.tableValue}>GB0012435602350534</span></Typography>
				<Typography color="inherit"><span>荷官:</span><span className={classes.tableValue}>Betty</span></Typography>
				<Typography color="inherit"><span>主播:</span><span className={classes.tableValue}>冰冰</span></Typography>
				<Typography color="inherit"><span>限紅:</span><span className={classes.tableValue}>10,000-300,000</span></Typography>
				<Typography color="inherit"><span>桌主:</span><span className={classes.tableValue}>***168</span></Typography>
				<Typography color="inherit"><span>牌靴:</span><span className={classes.tableValue}>n32</span></Typography>
				<Typography color="inherit"><span>遊戲狀態:</span><span className={classes.tableValue}>派牌中</span></Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="medium" color="inherit" className={classes.cardActionButton} onClick={joinRoom}>踢走桌主</Button>
      </CardActions>
    </Card>
  );
}

AnchorTile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AnchorTile);