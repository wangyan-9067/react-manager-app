import React, { useState, Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';

const styles = () => ({
  playerIcon: {
    color: '#3970B0'
  }
});

const AudioButton = ({ classes }) => {
  const { playerIcon } = classes;
  const [ isPlaying, setIsPlaying ] = useState(false);
  const audioObject = useRef(null);

  return (
    <Fragment>
      <IconButton
        onClick={() => {          
          audioObject.current.src = "https://36.255.220.33/e-telebet/test.aac";
          setIsPlaying(!isPlaying);

          if (isPlaying) {
            audioObject.current.pause();
            audioObject.current.currentTime = 0;
          } else {
            audioObject.current.play();
          }
        }}
        aria-label="Play Audio"
        classes={{ root: playerIcon }}
      >
        {isPlaying ? <PauseCircleFilledIcon /> : <PlayCircleFilledIcon />}
      </IconButton>
      <audio ref={audioObject} />
    </Fragment>
  );
}

AudioButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AudioButton);