import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = {
	card: {
		borderRadius: '4px',
		border: '1px solid #000000',
		backgroundColor: '#F5F5F5',
		padding: '0 60px 0 0'
	},
	cardContent: {
		color: '#818181',
		textAlign: 'left'
	},
	cardContentText: {
		fontSize: '16px'
	}
};

const WaitingUserTitle = props => {
  const { classes } = props;

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
				<Typography color="inherit" className={classes.cardContentText}>T01</Typography>
				<Typography color="inherit" className={classes.cardContentText}>***168</Typography>
				<Typography color="inherit" className={classes.cardContentText}>$842,345,623</Typography>
      </CardContent>
    </Card>
  );
}

WaitingUserTitle.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WaitingUserTitle);