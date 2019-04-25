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

const AudioButton = ({ classes, gmcode, toggleToast, setToastMessage, setToastVariant }) => {
  const { playerIcon } = classes;
  const [ isPlaying, setIsPlaying ] = useState(false);
  const audioObject = useRef(null);

  return (
    <Fragment>
      <IconButton
        onClick={() => {
          const player = audioObject.current;

          // TODO: put base url to config file
          player.src = `https://36.255.220.33/e-telebet/${gmcode}.aac`;
          setIsPlaying(!isPlaying);

          if (isPlaying) {
            player.pause();
            player.currentTime = 0;
          } else {
            player.play();
          }

          player.onerror = () => {
            toggleToast(true);
            setToastMessage("錄音不能播放!");
            setToastVariant("error");
            setIsPlaying(false);
          }

          player.onended = () => {
            setIsPlaying(false);
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
  gmcode: PropTypes.string.isRequired,
  toggleToast: PropTypes.func.isRequired,
  setToastMessage: PropTypes.func.isRequired,
  setToastVariant: PropTypes.func.isRequired
};

export default withStyles(styles)(AudioButton);