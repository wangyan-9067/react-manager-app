import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import image from '../sample-5.jpg';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    padding: '5px',
    backgroundColor: '#E8E8E8',
  }
});

const tileData = [
	{
			img: image,
			title: 'Image',
			author: 'author',
			cols: 1
	},
	{
			img: image,
			title: 'Image',
			author: 'author',
			cols: 1
	},
	{
			img: image,
			title: 'Image',
			author: 'author',
			cols: 1
	},
	{
			img: image,
			title: 'Image5',
			author: 'author',
			cols: 1
	},
	{
			img: image,
			title: 'Image',
			author: 'author',
			cols: 1
	}
];

function GridListBase(props) {
	const { classes, children, width } = props;
	let cols;
	
	switch(width) {
		case 'xs':
			cols = 1;
		break;

		case 'sm':
			cols = 2;
		break;

		case 'md':
			cols = 3;
		break;

		default:
			cols = 3;
		break;
	}

  return (
    <div className={classes.root}>
      <GridList cellHeight="auto" className={classes.GridListBase} cols={cols} spacing={16}>
        {tileData.map(tile => (
          <GridListTile key={tile.img} cols={tile.cols || 1}>
            { children }
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

GridListBase.propTypes = {
  classes: PropTypes.object.isRequired,
};

const StyledGridListBase = withStyles(styles)(GridListBase);

export default withWidth()(StyledGridListBase);