import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
	card: {
		borderRadius: '16px',
		border: '3px solid #FD0100',
		padding: '30px',
		backgroundColor: '#F5F5F5'
	},
	cardContent: {
		color: '#818181'
	},
	cardActionButton: {
		margin: '0 auto',
		padding: '3px 40px',
		borderRadius: '10px',
		fontSize: '20px',
		fontWeight: 'bold',
		color: '#FFFFFF',
		backgroundColor: '#3970B0',
    '&:hover': {
      backgroundColor: '#3970B0',
      borderColor: '#3970B0',
    }
	},
	cardContentText: {
		fontSize: '24px'
	},
	client: {
		fontWeight: 'bold',
	},
	player: {
		color: '#FD0100'
	},
	anchor: {
		color: '#3970B0'
	}
};

const TelebetTile = props => {
  const { classes } = props;

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
				<Typography color="inherit" className={classNames(classes.cardContentText, classes.player)}>玩家 <span className={classes.client}>***168</span> 接入中</Typography>
				<Typography color="inherit" className={classes.cardContentText}>$842,345,623</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="medium" color="inherit" className={classes.cardActionButton}>接聽</Button>
      </CardActions>
    </Card>
  );
}

TelebetTile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TelebetTile);