import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import image from '../sample-5.jpg';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
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

const SingleLineGridListBase = props => {
  const { classes, children } = props;

  return (
    <div className={classes.root}>
      <GridList cellHeight="auto" className={classes.gridList} cols={6} spacing={8}>
        {tileData.map(tile => (
          <GridListTile key={tile.img}>
            {/* {<img src={tile.img} alt={tile.title} />} */}
            {children}
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

SingleLineGridListBase.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SingleLineGridListBase);