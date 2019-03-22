import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import image from '../sample-5.jpg';

const styles = theme => ({
	gridListRoot: {
    display: 'flex',
    padding: 0,
    flexWrap: 'wrap',
    overflowY: 'auto',
		listStyle: 'none',
		width: '100%'
	},
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
		padding: '5px',
		width: '100%'
	},
	tile: {
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: '#F5F5F5'
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
	const { classes, children, width, bgColor, customCols, list, tileClass } = props;
	const data = list || tileData;
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
			<GridList 
				cellHeight="auto"
				classes={{ root: classes.gridListRoot }}
				className={classes.GridListBase}
				cols={customCols || cols}
				spacing={16}
				style={{ bgColor }}
			>
        {data.map(item => (
					<GridListTile 
						classes={{ tile: tileClass || classes.tile }}
						key={item.img || ''}
						cols={item.cols || 1}
					>
						{/* { children } */}
						{ React.cloneElement(children, { item }) }
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