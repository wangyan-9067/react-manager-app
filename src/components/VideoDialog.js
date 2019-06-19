import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';

import MediaElement from './MediaElement';
import { CONFIG, ENV } from '../config';

const styles = theme => ({
    dialogPaper: {
        maxWidth: '700px'
    }
  });

class VideoDialog extends React.Component {
    render() {
        const { onClose, open, row, classes } = this.props;
        const { dialogPaper } = classes;

        return (
            <Dialog classes={{ paper: dialogPaper }} onClose={onClose} open={open}>
                <DialogTitle>gmcode: {row.gmcode}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={8}>
                        <Grid item xs={6}>
                            <MediaElement
                                width="100%"
                                height="240"
                                sources={[
                                    {
                                        src: 'https://re.010cdn.com/record/mp4:GC0161961807Y.flv',
                                        // TODO use this: src: `${CONFIG[ENV].VIDEO_URL}${row.gmcode}.flv`,
                                        type: 'video/flv'
                                    }
                                ]}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <MediaElement
                                width="100%"
                                height="240"
                                sources={[
                                    {
                                        src: 'https://re.010cdn.com/record/mp4:GC002196180DZ.flv',
                                        type: 'video/flv'
                                    }
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <MediaElement
                                isAudio={true}
                                width="100%"
                                height="50"
                                muted=""
                                sources={[
                                    {
                                        src: `${CONFIG[ENV].AUDIO_URL}${row.gmcode}.aac`,
                                        type: 'audio/aac'
                                    }
                                ]}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        )
    }
}

VideoDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    row: PropTypes.object.isRequired
}

export default withStyles(styles)(VideoDialog);