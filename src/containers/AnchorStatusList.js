import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';

import CustomAvatar from '../components/CustomAvatar';
import AnchorStatus from '../components/AnchorStatus';
import { getLangConfig } from '../helpers/appUtils';

const styles = () => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    padding: '20px',
		backgroundColor: '#9DA0A7',
    borderRadius: '10px'
  },
  title: {
    fontSize: '1.125rem',
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  grow: {
    flexGrow: 1
  },
  listRoot: {
    width: '100%',
    // height: '522px',
    overflow: 'auto'
  },
  primary: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textTransform: 'capitalize'
  },
  secondaryOn: {
    color: '#0FFD5D'
  },
  secondary: {
    color: '#FFFFFF'
  }
});

const AnchorStatusList = ({ classes, anchorList, anchorsOnDutyList }) => {
  const { root, title, grow, listRoot, primary, secondary } = classes; 
  const langConfig = getLangConfig();
	return (
		<div className={root}>
      <Typography align="left" color="inherit" className={title}>{langConfig.ANCHOR_LIST_LABEL.ANCHOR_LIST}</Typography>
      <div className={grow} />
      <List className={listRoot}>

        {
          // eslint-disable-next-line
          anchorsOnDutyList && anchorsOnDutyList.map((anchor, index) => {
          if (anchor) {
            const { anchorName, nickname, url, vid } = anchor;

            return (
              <ListItem key={index}>
                <AnchorStatus isBusy={vid ? true : false} />
                <ListItemAvatar>
                  <CustomAvatar
                    imgUrl={url}
                    label={anchorName}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={`${anchorName}(${nickname})`}
                  secondary={vid ? vid : langConfig.ANCHOR_LIST_LABEL.FREE}
                  classes={{
                    primary: primary,
                    secondary: vid ? classes.secondary : classes.secondaryOn
                  }}
                />
              </ListItem>
            );
          }
        })}
        {
          !anchorsOnDutyList && (
            <Typography align="left" color="inherit" className={secondary}>{langConfig.ANCHOR_LIST_LABEL.NO_ON_DUTY_ANCHOR}</Typography>
          )
        }
      </List>
    </div>
	);
}

AnchorStatusList.proptype = {
  classes: PropTypes.object.isRequired,
  anchorList: PropTypes.array,
  anchorsOnDutyList: PropTypes.array
};

const StyledAnchorStatusList = withStyles(styles)(AnchorStatusList);

const mapStateToProps = state => {
  const { anchorList, anchorsOnDutyList } = state.voice;

  return ({
    anchorList,
    anchorsOnDutyList
  });
};

export default connect(mapStateToProps, null)(StyledAnchorStatusList);