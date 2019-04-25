import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';

import CustomAvatar from '../components/CustomAvatar';
import AnchorStatus from '../components/AnchorStatus';

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
  secondary: {
    color: '#FFFFFF'
  }
});

const AnchorStatusList = ({ classes, anchorList, anchorsOnDutyList }) => {
  const { root, title, grow, listRoot, primary, secondary } = classes;

  let onDutyAnchors;
  
  if ((anchorList && anchorList.length) && (anchorsOnDutyList && anchorsOnDutyList.length)) {
    onDutyAnchors = anchorsOnDutyList.map(dutyAnchor => {
      const targetAnchor = anchorList.find(anchor => anchor.loginname === dutyAnchor.anchorName);
      targetAnchor.vid = anchorsOnDutyList.vid;

      return targetAnchor;
    });
  }

	return (
		<div className={root}>
      <Typography align="left" color="inherit" className={title}>主播列表</Typography>
      <div className={grow} />
      <List className={listRoot}>
        {onDutyAnchors && onDutyAnchors.map((anchor, index) => {
          if (anchor) {
            const { loginname, nickname, url, vid } = anchor;

            return (
              <ListItem index={index}>
                <AnchorStatus isBusy={vid ? true : false} />
                <ListItemAvatar>
                  <CustomAvatar
                    imgUrl={url}
                    label={loginname}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={nickname}
                  secondary={vid ? vid : "待機中"}
                  classes={{
                    primary,
                    secondary
                  }}
                />
              </ListItem>
            );
          }
        })}
        {
          !onDutyAnchors && (
            <Typography align="left" color="inherit" className={secondary}>沒有值班主播</Typography>
          )
        }
      </List>
    </div>
	);
}

const StyledAnchorStatusList = withStyles(styles)(AnchorStatusList);

const mapStateToProps = state => {
  const { anchorList, anchorsOnDutyList } = state.voice;

  return ({
    anchorList,
    anchorsOnDutyList
  });
};

export default connect(mapStateToProps, null)(StyledAnchorStatusList);