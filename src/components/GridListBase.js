import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const styles = () => ({
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

const GridListBase = ({ classes, children, width, bgColor, customCols, list, tileClass, gridListRootClass }) => {
	const { root, gridListRoot, tile } = classes;
	const data = list;
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
    <div className={root}>
			<GridList 
				cellHeight="auto"
				classes={{ root: gridListRootClass || gridListRoot }}
				cols={customCols || cols}
				spacing={16}
				style={{ backgroundColor: bgColor }}
			>
        {data.map((item, index) => (
					<GridListTile 
						classes={{ tile: tileClass || tile }}
						key={index || ''}
						cols={item.cols || 1}
					>
						{ React.cloneElement(children, { item }) }
          </GridListTile>
				))}
				{ !data || data.length <= 0 ? '沒有桌台資訊' : '' }
      </GridList>
    </div>
  );
}

GridListBase.propTypes = {
	classes: PropTypes.object.isRequired,
	children: PropTypes.object.isRequired,
	width: PropTypes.string,
	bgColor: PropTypes.string,
	customCols: PropTypes.number,
	list: PropTypes.array, 
	tileClass: PropTypes.string,
	gridListRootClass: PropTypes.string
};

const StyledGridListBase = withStyles(styles)(GridListBase);

export default withWidth()(StyledGridListBase);